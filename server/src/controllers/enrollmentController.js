const enrollmentService = require("../services/enrollmentService");

// Student requests enrollment in a course
const requestEnrollment = async (req, res) => {
  try {
    const enrollment = await enrollmentService.requestEnrollment(req.userId, req.params.id);
    res.status(201).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

// Student gets their enrollment records
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getStudentEnrollments(req.userId);
    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

// Student gets their coursework for a specific course
const getStudentCoursework = async (req, res) => {
  try {
    const coursework =
      await enrollmentService.getStudentCoursework(
        req.userId,
        req.params.id,
      );
    res.status(200).json({
      success: true,
      data: coursework,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

// Student marks a content item as complete and updates course progress
const markContentComplete = async (req, res) => {
  try {
    const enrollment =
      await enrollmentService.markContentComplete(
        req.userId,
        req.params.id,
        req.params.contentId,
      );
    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

// Faculty gets enrollment records for their courses
const getFacultyEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getFacultyEnrollments(req.userId);
    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

// Faculty/admin approves or rejects an enrollment request
const reviewEnrollment = async (req, res) => {
  try {
    const { status } = req.body;
    const user = {
      userId: req.userId,
      typeOfUser: req.user.typeOfUser,
    };
    const enrollment = await enrollmentService.reviewEnrollment(req.params.id, status, user);
    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  requestEnrollment,
  getMyEnrollments,
  getStudentCoursework,
  markContentComplete,
  getFacultyEnrollments,
  reviewEnrollment,
};
