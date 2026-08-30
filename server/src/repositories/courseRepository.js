const Course = require("../models/courseModel");

const createCourse = async (courseData) => {
  return await Course.create(courseData);
};

const findCourseById = async (id) => {
  return await Course.findById(id).populate("faculty", "firstName lastName email facultyProfile.facultyId");
};

const findCourseByCourseId = async (courseId) => {
  return await Course.findOne({ courseId });
};

const findCourses = async ({ search, category }) => {
  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (search) {
    const numericSearch = Number(search);
    const searchConditions = [{ title: { $regex: search, $options: "i" } }];
    if (!isNaN(numericSearch)) {
      searchConditions.push({
        courseId: numericSearch,
      });
    }
    filter.$or = searchConditions;
  }
  return await Course.find(filter).populate("faculty", "firstName lastName email facultyProfile.facultyId");
};

const findCoursesByFacultyEmail = async (facultyEmail) => {
  return await Course.find({ faculty: facultyEmail });
};

const findCoursesByFacultyId = async (facultyId) => {
  return await Course.find({
    faculty: facultyId,
  }).populate("faculty", "firstName lastName email facultyProfile.facultyId");
};

const updateCourse = async (id, updatedData) => {
  return await Course.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
};

const deleteCourseById = async (id) => {
  return await Course.findByIdAndDelete(id);
};

module.exports = {
  createCourse,
  findCourseById,
  findCourseByCourseId,
  findCourses,
  findCoursesByFacultyId,
  findCoursesByFacultyEmail,
  updateCourse,
  deleteCourseById,
};
