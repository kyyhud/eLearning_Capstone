const courseReviewService = require("../services/courseReviewService");

const submitCourseReview = async (req, res) => {
  try {
    const review = await courseReviewService.submitCourseReview(req.user.userId, req.params.id, req.body);
    res.status(201).json({
      success: true,
      data: review,
      message: "Course review submitted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

const getCourseReviews = async (req, res) => {
  try {
    const reviewData = await courseReviewService.getCourseReviews(req.params.id);
    res.status(200).json({
      success: true,
      data: reviewData,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  submitCourseReview,
  getCourseReviews,
};
