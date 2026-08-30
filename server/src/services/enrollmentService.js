const enrollmentRepository = require("../repositories/enrollmentRepository");
const courseRepository = require("../repositories/courseRepository");

const requestEnrollment = async (studentId, courseId) => {
  const course = await courseRepository.findCourseById(courseId);
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
  const existingEnrollment = await enrollmentRepository.findEnrollmentByStudentAndCourse(studentId, courseId);
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
    student: studentId,
    course: courseId,
  });
};

const getStudentEnrollments = async (studentId) => {
  return await enrollmentRepository.findEnrollmentsByStudent(studentId);
};

// Get all enrollments for a faculty member's courses
const getFacultyEnrollments = async (facultyId) => {
  const courses = await courseRepository.findCoursesByFacultyId(facultyId);
  if (!courses.length) {
    return [];
  }
  const courseIds = courses.map((course) => course._id);
  return await enrollmentRepository.findEnrollmentsByCourseIds(courseIds);
};

// Review an enrollment request (approve or reject)
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
  getFacultyEnrollments,
  reviewEnrollment,
};
