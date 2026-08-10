const Course = require("../models/courseModel");

const findAllCourses = async () => {
  return await Course.find({});
};

const findCourseByTitle = async (title) => {
  return await Course.find({ title: { $regex: title, $options: "i" } });
};

const createCourse = async (courseData) => {
  return await Course.create(courseData);
};

module.exports = {
  findAllCourses,
  findCourseByTitle,
  createCourse,
};
