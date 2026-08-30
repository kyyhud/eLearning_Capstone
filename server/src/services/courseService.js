const courseRepository = require("../repositories/courseRepository");
const { getNextCourseId } = require("./idService");
const fs = require("fs");
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

const getCourses = async (filters) => {
  return await courseRepository.findCourses(filters);
};

const getCourseById = async (id) => {
  const course = await courseRepository.findCourseById(id);
  if (!course) {
    throw new Error("Course not found");
  }
  return course;
};

const getCoursesByFacultyId = async (facultyId) => {
  return await courseRepository.findCoursesByFacultyId(facultyId);
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
  const oldResourceUrls = getUploadedResourceUrls(course.sections);
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
  const adminFields = ["title", "description", "category", "faculty", "durationWeeks", "status", "sections"];
  const facultyFields = ["description", "status", "sections"];
  const allowedUpdates = getAllowedUpdates(updatedData, isAdmin ? adminFields : facultyFields);
  const updatedCourse = await courseRepository.updateCourse(id, allowedUpdates);
  const newResourceUrls = getUploadedResourceUrls(updatedCourse.sections);
  const removedResourceUrls = oldResourceUrls.filter((resourceUrl) => !newResourceUrls.includes(resourceUrl));
  removedResourceUrls.forEach(deleteUploadedFile);
  return updatedCourse;
};

const deleteCourseById = async (id) => {
  const course = await courseRepository.findCourseById(id);
  if (!course) {
    throw new Error("Course not found");
  }
  return await courseRepository.deleteCourseById(id);
};

// Helper function to extract uploaded resource URLs from course sections
const getUploadedResourceUrls = (sections = []) => {
  return sections.flatMap((section) =>
    (section.content || []).map((contentItem) => contentItem.resourceUrl).filter((resourceUrl) => resourceUrl?.startsWith("/uploads/course-content/")),
  );
};
// Delete an uploaded file from the server based on its resource URL
const deleteUploadedFile = (resourceUrl) => {
  const fileName = path.basename(resourceUrl);
  const filePath = path.join(__dirname, "../../uploads/course-content", fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  getCoursesByFacultyId,
  updateCourse,
  deleteCourseById,
  getUploadedResourceUrls,
  deleteUploadedFile,
};
