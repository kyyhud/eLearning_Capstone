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

const getCourseByCourseId = async (courseId) => {
  const course = await courseRepository.findCourseByCourseId(Number(courseId));
  if (!course) {
    throw new Error("Course not found");
  }
  return course;
};

const getCoursesByFacultyId = async (facultyId) => {
  return await courseRepository.findCoursesByFacultyId(facultyId);
};

const deleteCourseByCourseId = async (courseId) => {
  const course = await courseRepository.findCourseByCourseId(Number(courseId));
  if (!course) {
    throw new Error("Course not found");
  }
  return await courseRepository.deleteCourseByCourseId(Number(courseId));
};

module.exports = {
  createCourse,
  getCourses,
  getCourseByCourseId,
  getCoursesByFacultyId,
  deleteCourseByCourseId,
};
