const enrollmentRepository = require("../repositories/enrollmentRepository");
const courseRepository = require("../repositories/courseRepository");

// Student request enrollment in a course
const requestEnrollment = async (userid, id) => {
  const course = await courseRepository.findCourseById(id);
  // Check if the course exists and is published before proceeding
  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }
  if (course.status !== "published") {
    const error = new Error("Enrollment is only available for published courses");
    error.statusCode = 400;
    throw error;
  }
  // Check if an enrollment already exists for this student and course
  const existingEnrollment = await enrollmentRepository.findEnrollmentByStudentAndCourse(userid, id);
  if (existingEnrollment) {
    if (existingEnrollment.status === "pending") {
      const error = new Error("Enrollment request is already pending");
      error.statusCode = 400;
      throw error;
    }
    if (existingEnrollment.status === "approved") {
      const error = new Error("You are already enrolled in this course");
      error.statusCode = 400;
      throw error;
    }
    if (existingEnrollment.status === "rejected") {
      return await enrollmentRepository.updateEnrollmentById(existingEnrollment._id, {
        status: "pending",
        requestedAt: new Date(),
        reviewedAt: null,
        reviewedBy: null,
      });
    }
  }
  // If no existing enrollment request, create a new one
  return await enrollmentRepository.createEnrollment({
    student: userid,
    course: id,
  });
};

// Student gets all enrolled courses, including their progress
const getStudentEnrollments = async (userid) => {
  const enrollments =
    await enrollmentRepository.findEnrollmentsByStudent(
      userid,
    );
  return enrollments.map((enrollment) => {
    const enrollmentObject = enrollment.toObject();
    const requiredContent =
      enrollment.course?.sections?.flatMap(
        (section) =>
          section.content.filter(
            (content) => content.isRequired,
          ),
      ) || [];
    // Calculate the completed required content
    const completedContent =
      enrollment.progress?.completedContent || [];
    const completedRequiredContent =
      requiredContent.filter((content) =>
        completedContent.some(
          (completedId) =>
            completedId.toString() ===
            content._id.toString(),
        ),
      );
    // Calculate the progress percentage based on completed required content
    const progressPercent =
      requiredContent.length === 0
        ? 0
        : Math.round(
            (completedRequiredContent.length /
              requiredContent.length) *
              100,
          );
    delete enrollmentObject.course.sections;
    return {
      ...enrollmentObject,
      progressPercent,
    };
  });
};

// Student gets the coursework for a specific course
const getStudentCoursework = async (userid, id) => {
  const enrollment =
    await enrollmentRepository.findEnrollmentByStudentAndCourse(
      userid,
      id,
    );
  if (!enrollment) {
    const error = new Error(
      "You are not enrolled in this course",
    );
    error.statusCode = 403;
    throw error;
  }
  if (enrollment.status !== "approved") {
    const error = new Error(
      "Course access requires an approved enrollment",
    );
    error.statusCode = 403;
    throw error;
  }
  const course =
    await courseRepository.findCourseById(id);
  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }
  // Update the last accessed timestamp for the student's enrollment
  const updatedEnrollment =
    await enrollmentRepository.updateEnrollmentById(
      enrollment._id,
      {
        "progress.lastAccessedAt": new Date(),
      },
    );
  return {
    course,
    enrollment: updatedEnrollment,
  };
};

// Student marks a content item as complete and updates course progress
const markContentComplete = async (
  userid,
  id,
  contentId,
) => {
  const enrollment =
    await enrollmentRepository.findEnrollmentByStudentAndCourse(
      userid,
      id,
    );
  if (!enrollment) {
    const error = new Error(
      "You are not enrolled in this course",
    );
    error.statusCode = 403;
    throw error;
  }
  if (enrollment.status !== "approved") {
    const error = new Error(
      "Course access requires an approved enrollment",
    );
    error.statusCode = 403;
    throw error;
  }
  const course =
    await courseRepository.findCourseById(id);
  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }
  // Find the requested content item somewhere in the course
  const contentItem = course.sections
    .flatMap((section) => section.content)
    .find(
      (content) =>
        content._id.toString() === contentId,
    );
  if (!contentItem) {
    const error = new Error(
      "Course content not found",
    );
    error.statusCode = 404;
    throw error;
  }
  // Preserve existing completed content
  const completedContent =
    enrollment.progress?.completedContent || [];
  const alreadyCompleted = completedContent.some(
    (completedId) =>
      completedId.toString() === contentId,
  );
  // Add the content only if it has not already been completed
  const updatedCompletedContent = alreadyCompleted
    ? completedContent
    : [...completedContent, contentItem._id];
  // Gather all required content IDs in the course
  const requiredContentIds = course.sections.flatMap(
    (section) =>
      section.content
        .filter((content) => content.isRequired)
        .map((content) => content._id.toString()),
  );
  // Course is complete when every required content item appears in completedContent
  const allRequiredComplete =
    requiredContentIds.length > 0 &&
    requiredContentIds.every((requiredId) =>
      updatedCompletedContent.some(
        (completedId) =>
          completedId.toString() === requiredId,
      ),
    );
  // Update the enrollment with the new progress information
  const updatedEnrollment =
    await enrollmentRepository.updateEnrollmentById(
      enrollment._id,
      {
        "progress.completedContent":
          updatedCompletedContent,
        "progress.lastAccessedAt": new Date(),
        "progress.completedAt":
          allRequiredComplete
            ? enrollment.progress?.completedAt ||
              new Date()
            : null,
      },
    );
  return updatedEnrollment;
};

// Faculty gets all enrollments for their courses
const getFacultyEnrollments = async (facultyId) => {
  const courses = await courseRepository.findCoursesByFacultyId(facultyId);
  if (!courses.length) {
    return [];
  }
  const courseIds = courses.map((course) => course._id);
  return await enrollmentRepository.findEnrollmentsByCourseIds(courseIds);
};

// Faculty/admin reviews an enrollment request (approve or reject)
const reviewEnrollment = async (enrollmentId, status, user) => {
  if (!["approved", "rejected"].includes(status)) {
    const error = new Error("Enrollment status must be approved or rejected");
    error.statusCode = 400;
    throw error;
  }
  const enrollment = await enrollmentRepository.findEnrollmentById(enrollmentId);
  if (!enrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }
  if (enrollment.status !== "pending") {
    const error = new Error("Only pending enrollment requests can be reviewed");
    error.statusCode = 400;
    throw error;
  }
  const course = await courseRepository.findCourseById(enrollment.course);
  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }
  const isAdmin = user.typeOfUser === "admin";
  const isFaculty = user.typeOfUser === "faculty";
  if (!isAdmin && !isFaculty) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
  if (isFaculty) {
    const assignedFacultyId = course.faculty?._id?.toString() || course.faculty?.toString();
    if (assignedFacultyId !== user.userId) {
      const error = new Error("You are not assigned to this course");
      error.statusCode = 403;
      throw error;
    }
  }
  return await enrollmentRepository.updateEnrollmentById(enrollmentId, {
    status,
    reviewedAt: new Date(),
    reviewedBy: user.userId,
  });
};

module.exports = {
  requestEnrollment,
  getStudentEnrollments,
  getStudentCoursework,
  markContentComplete,
  getFacultyEnrollments,
  reviewEnrollment,
};
