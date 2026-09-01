const courseService = require("../services/courseService");

const createCourse = async (req, res) => {
  try {
    const courseData = {
      courseLevel: req.body.courseLevel,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      faculty: req.body.faculty,
      durationWeeks: req.body.durationWeeks,
      status: "draft",
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

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id, req.user);
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

const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await courseService.updateCourse(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: updatedCourse, message: "Course updated successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message });
  }
};

const deleteCourseById = async (req, res) => {
  try {
    const deletedCourse = await courseService.deleteCourseById(req.params.id);
    res.status(200).json({ success: true, data: deletedCourse, message: "Course deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

const uploadCourseContent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file was uploaded." });
    }
    const resourceUrl = `/uploads/course-content/${req.file.filename}`;
    res.status(201).json({ success: true, data: { fileName: req.file.originalname, resourceUrl, mimeType: req.file.mimetype } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  getMyCourses,
  updateCourse,
  deleteCourseById,
  uploadCourseContent,
};
