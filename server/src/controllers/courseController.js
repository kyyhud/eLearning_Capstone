const courseService = require("../services/courseService");

const createCourse = async (req, res) => {
  try {
    const { title, description, faculty, duration } = req.body;
    const newCourse = await courseService.saveCourse(title, description, faculty, duration);
    res.status(201).json({ success: true, data: newCourse, message: "Course created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getCoursesByFacultyEmail = async (req, res) => {
  try {
    const { facultyEmail } = req.params;
    const courses = await courseService.getCoursesByFacultyEmail(facultyEmail);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCourseByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const courses = await courseService.getCourseByTitle(title);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseByTitle,
  getCoursesByFacultyEmail,
};
