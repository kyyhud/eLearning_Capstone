const courseRepository = require("../repositories/courseRepository");
const enrollmentRepository = require("../repositories/enrollmentRepository");
const courseReviewRepository = require("../repositories/courseReviewRepository");

const submitCourseReview = async (userId, id, reviewData) => {
  const course = await courseRepository.findCourseById(id);
  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  const enrollment = await enrollmentRepository.findEnrollmentByStudentAndCourse(userId, id);
  if (!enrollment || enrollment.status !== "approved") {
    const error = new Error("You must be enrolled in this course to leave a review");
    error.statusCode = 403;
    throw error;
  }

  // Calculate completion using required course content.
  const requiredContent = course.sections.flatMap((section) => section.content.filter((contentItem) => contentItem.isRequired));
  const completedContentIds = enrollment.progress.completedContent.map((contentId) => contentId.toString());
  const completedRequiredContent = requiredContent.filter((contentItem) => completedContentIds.includes(contentItem._id.toString()));
  const progressPercent = requiredContent.length > 0 ? Math.round((completedRequiredContent.length / requiredContent.length) * 100) : 0;
  if (progressPercent !== 100) {
    const error = new Error("Course must be completed before leaving a review");
    error.statusCode = 400;
    throw error;
  }

  // Allow only 1 review per student per course
  const existingReview = await courseReviewRepository.findReviewByStudentAndCourse(userId, id);
  if (existingReview) {
    const error = new Error("You have already reviewed this course");
    error.statusCode = 409;
    throw error;
  }

  const rating = Number(reviewData.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    const error = new Error("Rating must be a whole number between 1 and 5");
    error.statusCode = 400;
    throw error;
  }

  return await courseReviewRepository.createReview({
    student: userId,
    course: id,
    enrollment: enrollment._id,
    rating,
    feedback: reviewData.feedback || "",
  });
};

const getCourseReviews = async (id) => {
  const course = await courseRepository.findCourseById(id);
  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  const reviews = await courseReviewRepository.findReviewsByCourse(id);
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
    reviews,
  };
};

module.exports = {
  submitCourseReview,
  getCourseReviews,
};
