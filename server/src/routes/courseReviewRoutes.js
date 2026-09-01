const express = require("express");
const courseReviewController = require("../controllers/courseReviewController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/courses/:id", authenticateUser, authorizeRoles("student"), courseReviewController.submitCourseReview);

router.get("/courses/:id", authenticateUser, authorizeRoles("admin", "faculty", "student"), courseReviewController.getCourseReviews);

module.exports = router;
