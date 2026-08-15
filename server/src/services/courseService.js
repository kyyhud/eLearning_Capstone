const courseRepository = require("../repositories/courseRepository");

const saveCourse = async (title, description, faculty, duration) => {
  const existingCourse = await courseRepository.findCourseByTitle(title);
  if (existingCourse) {
    throw new Error("Course with this title already exists");
  }
  return await courseRepository.createCourse({ title, description, faculty, duration });
};

const getCoursesByFacultyEmail = async (facultyEmail) => {
  const courses = await courseRepository.findCoursesByFacultyEmail(facultyEmail);
  if (courses.length === 0) {
    throw new Error("No courses found for this faculty email.");
  }
  return courses;
};

const getAllCourses = async () => {
  return await courseRepository.findAllCourses();
};

const getCourseByTitle = async (title) => {
  const courses = await courseRepository.findCourseByTitle(title);
  if (courses.length === 0) {
    throw new Error("Course not found");
  }
  return courses;
};

module.exports = {
  saveCourse,
  getAllCourses,
  getCourseByTitle,
  getCoursesByFacultyEmail,
};
