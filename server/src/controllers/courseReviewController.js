const courseReviewService = require("../services/courseReviewService");

const submitCourseReview = async (req, res, next) => {
  try {
    const review = await courseReviewService.submitCourseReview(req.user.userId, req.params.id, req.body);
    res.status(201).json({
      message: "Course review submitted successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseReviews = async (req, res, next) => {
  try {
    const reviewData = await courseReviewService.getCourseReviews(req.params.id);
    res.status(200).json(reviewData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitCourseReview,
  getCourseReviews,
};
