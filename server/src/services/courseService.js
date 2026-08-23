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

const updateCourse = async (id, updatedData) => {
  const course = await courseRepository.findCourseById(id);
  if (!course) {
    throw new Error("Course not found");
  }
  return await courseRepository.updateCourse(id, updatedData);
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
