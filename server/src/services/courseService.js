const courseRepository = require("../repositories/courseRepository");
const courseReviewRepository = require("../repositories/courseReviewRepository");
const enrollmentRepository = require("../repositories/enrollmentRepository");
const { getNextCourseId } = require("./idService");
const fs = require("fs/promises");
const path = require("path");

const createCourse = async (courseData) => {
  const { courseLevel, ...courseDetails } = courseData;
  const level = Number(courseLevel);
  if (![100, 200, 300, 400].includes(level)) {
    throw new Error("Invalid course level");
  }
  const courseId = await getNextCourseId(level);
  const existingCourse = await courseRepository.findCourseByCourseId(courseId);
  if (existingCourse) {
    throw new Error(`Course ID ${courseId} is already in use`);
  }
  const newCourseData = {
    ...courseDetails,
    courseId,
    status: "draft",
  };
  return await courseRepository.createCourse(newCourseData);
};

const addRatingSummaries = async (courses) => {
  const ids = courses.map((course) => course._id);
  const ratingSummaries = await courseReviewRepository.getRatingSummariesForCourses(ids);
  const ratingsByCourse = new Map(
    ratingSummaries.map((summary) => [
      summary._id.toString(),
      {
        average: Math.round(summary.averageRating * 10) / 10,
        count: summary.reviewCount,
      },
    ]),
  );
  return courses.map((course) => ({
    ...course.toObject(),
    rating: ratingsByCourse.get(course._id.toString()) || {
      average: 0,
      count: 0,
    },
  }));
};

const getCourses = async (filters, user) => {
  const authorizedFilters = { ...filters };
  if (user.typeOfUser === "student") {
    authorizedFilters.status = "published";
  }
  const courses = await courseRepository.findCourses(authorizedFilters);
  return await addRatingSummaries(courses);
};

const getCourseById = async (id, user) => {
  const course = await courseRepository.findCourseById(id);
  if (!course || (user.typeOfUser === "student" && course.status !== "published")) {
    throw new Error("Course not found");
  }
  if (user.typeOfUser === "student") {
    const courseData = course.toObject();
    delete courseData.sections;
    return courseData;
  }
  return course;
};

const getCourseContentFile = async (courseId, contentId, user) => {
  const course = await courseRepository.findCourseById(courseId);
  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }
  const contentItem = course.sections.flatMap((section) => section.content || []).find((content) => content._id.toString() === contentId);
  if (!contentItem) {
    const error = new Error("Course content not found");
    error.statusCode = 404;
    throw error;
  }
  const isAdmin = user.typeOfUser === "admin";
  const isFaculty = user.typeOfUser === "faculty";
  const isStudent = user.typeOfUser === "student";
  if (isFaculty) {
    const assignedFacultyId = course.faculty?._id?.toString() || course.faculty?.toString();
    if (assignedFacultyId !== user.userId) {
      const error = new Error("You are not assigned to this course");
      error.statusCode = 403;
      throw error;
    }
  }
  if (isStudent) {
    const enrollment = await enrollmentRepository.findEnrollmentByStudentAndCourse(user.userId, courseId);
    if (!enrollment || enrollment.status !== "approved") {
      const error = new Error("Approved enrollment is required to access this course content");
      error.statusCode = 403;
      throw error;
    }
  }
  if (!isAdmin && !isFaculty && !isStudent) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
  if (!contentItem.resourceUrl?.startsWith("/uploads/course-content/")) {
    const error = new Error("This content is not an uploaded course file");
    error.statusCode = 400;
    throw error;
  }
  const storedFileName = path.basename(contentItem.resourceUrl);
  const filePath = path.join(__dirname, "../../uploads/course-content", storedFileName);
  try {
    await fs.access(filePath);
  } catch {
    const error = new Error("Course file not found");
    error.statusCode = 404;
    throw error;
  }
  return {
    filePath,
    mimeType: contentItem.mimeType,
  };
};

const getCoursesByFacultyId = async (userId) => {
  const courses = await courseRepository.findCoursesByFacultyId(userId);
  return await addRatingSummaries(courses);
};

const getAllowedUpdates = (updatedData, allowedFields) => {
  const allowedUpdates = {};
  allowedFields.forEach((field) => {
    if (updatedData[field] !== undefined) {
      allowedUpdates[field] = updatedData[field];
    }
  });
  return allowedUpdates;
};

const updateCourse = async (id, updatedData, user) => {
  const course = await courseRepository.findCourseById(id);
  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }
  const oldResourceUrls = getUploadedResourceUrls(course.sections); // Get the list of resource URLs before the update
  const isAdmin = user.typeOfUser === "admin";
  const isFaculty = user.typeOfUser === "faculty";
  if (isFaculty && course.status === "archived") {
    const error = new Error("Archived courses cannot be edited");
    error.statusCode = 403;
    throw error;
  }
  if (!isAdmin && !isFaculty) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
  // Verify user access based on role and course assignment
  if (isFaculty) {
    const assignedFacultyId = course.faculty?._id?.toString() || course.faculty?.toString();
    if (assignedFacultyId !== user.userId) {
      const error = new Error("You are not assigned to this course");
      error.statusCode = 403;
      throw error;
    }
  }
  // Restrict faculty from archiving courses or modifying archived courses
  if (isFaculty && updatedData.status === "archived") {
    const error = new Error("Only administrators can archive courses");
    error.statusCode = 403;
    throw error;
  }
  if (isFaculty && course.status === "archived" && updatedData.status !== "archived") {
    const error = new Error("Only administrators can change an archived course");
    error.statusCode = 403;
    throw error;
  }
  // Determine which fields the user is allowed to update based on their role
  const adminFields = ["title", "description", "category", "faculty", "durationWeeks", "status", "sections"];
  const facultyFields = ["description", "status", "sections"];
  const allowedUpdates = getAllowedUpdates(updatedData, isAdmin ? adminFields : facultyFields);
  const updatedCourse = await courseRepository.updateCourse(id, allowedUpdates);
  // Get the list of resource URLs after the update, identify changes, and delete removed files
  const newResourceUrls = getUploadedResourceUrls(updatedCourse.sections);
  const removedResourceUrls = oldResourceUrls.filter((resourceUrl) => !newResourceUrls.includes(resourceUrl));
  await Promise.all(removedResourceUrls.map((resourceUrl) => deleteUploadedFile(resourceUrl)));
  return updatedCourse;
};

// Helper function to extract uploaded resource URLs from course sections
const getUploadedResourceUrls = (sections = []) => {
  return sections.flatMap((section) =>
    (section.content || []).map((contentItem) => contentItem.resourceUrl).filter((resourceUrl) => resourceUrl?.startsWith("/uploads/course-content/")),
  );
};

// Delete an uploaded file from the server based on its resource URL
const deleteUploadedFile = async (resourceUrl) => {
  const fileName = path.basename(resourceUrl);
  const filePath = path.join(__dirname, "../../uploads/course-content", fileName);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Failed to delete uploaded file ${fileName}`, error.message);
    }
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  getCourseContentFile,
  getCoursesByFacultyId,
  updateCourse,
};
