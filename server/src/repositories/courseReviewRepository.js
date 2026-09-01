const CourseReview = require("../models/courseReviewModel");

const createReview = async (reviewData) => {
  return await CourseReview.create(reviewData);
};

const findReviewByStudentAndCourse = async (userId, id) => {
  return await CourseReview.findOne({
    student: userId,
    course: id,
  });
};

const findReviewsByCourse = async (id) => {
  return await CourseReview.find({ course: id }).populate("student", "firstName lastName").sort({ createdAt: -1 });
};

const getRatingSummariesForCourses = async (ids) => {
  return await CourseReview.aggregate([
    {
      $match: {
        course: { $in: ids },
      },
    },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);
};

module.exports = {
  createReview,
  findReviewByStudentAndCourse,
  findReviewsByCourse,
  getRatingSummariesForCourses,
};
