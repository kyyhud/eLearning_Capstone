const courseRepository = require("../repositories/courseRepository");
const { getNextCourseId } = require("./idService");

const createCourse = async (courseData) => {
  const { courseLevel, ...courseDetails } = courseData;
  const courseId = await getNextCourseId(courseLevel);
  if (!Number.isInteger(courseId) || courseId < 1) {
    throw new Error("Course ID must be a positive whole number");
  }
  const existingCourse = await courseRepository.findCourseByCourseId(courseId);
  if (existingCourse) {
    throw new Error(`Course ID ${courseId} is already in use`);
  }
  const newCourseData = {
    ...courseDetails,
    courseId,
    status: courseData.status || "draft",
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
  const facultyFields = ["description", "sections"];
  const allowedUpdates = getAllowedUpdates(updatedData, isAdmin ? adminFields : facultyFields);
  return await courseRepository.updateCourse(id, allowedUpdates);
};

const deleteCourseById = async (id) => {
  const course = await courseRepository.findCourseById(id);
  if (!course) {
    throw new Error("Course not found");
  }
  return await courseRepository.deleteCourseById(id);
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  getCoursesByFacultyId,
  updateCourse,
  deleteCourseById,
};
