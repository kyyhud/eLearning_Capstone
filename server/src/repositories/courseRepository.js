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

const findCourses = async ({ search, category, status }) => {
  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (status) {
    filter.status = status;
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
  return await Course.find(filter).select("-sections").populate("faculty", "firstName lastName email facultyProfile.facultyId");
};

const findCoursesByFacultyId = async (userId) => {
  return await Course.find({
    faculty: userId,
  })
    .select("-sections")
    .populate("faculty", "firstName lastName email facultyProfile.facultyId");
};

const updateCourse = async (id, updatedData) => {
  return await Course.findByIdAndUpdate(id, updatedData, { returnDocument: "after", runValidators: true });
};

module.exports = {
  createCourse,
  findCourseById,
  findCourseByCourseId,
  findCourses,
  findCoursesByFacultyId,
  updateCourse,
};
