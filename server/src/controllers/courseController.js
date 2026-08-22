const courseService = require("../services/courseService");

const createCourse = async (req, res) => {
  try {
    const courseData = {
      courseId: req.body.courseId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      faculty: req.body.faculty,
      durationWeeks: req.body.durationWeeks,
    };
    const newCourse = await courseService.createCourse(courseData);
    res.status(201).json({ success: true, data: newCourse, message: "Course created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
    };
    const courses = await courseService.getCourses(filters);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCourseByCourseId = async (req, res) => {
  try {
    const course = await courseService.getCourseByCourseId(req.params.courseId);
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const courses = await courseService.getCoursesByFacultyId(req.user.userId);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseByCourseId,
  getMyCourses,
};
