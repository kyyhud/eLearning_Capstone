const express = require("express");
const {
  requestEnrollment,
  getMyEnrollments,
  getFacultyEnrollments,
  reviewEnrollment,
  getStudentCoursework,
  markContentComplete,
} = require("../controllers/enrollmentController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();

// Student requests enrollment in a published course
router.post("/courses/:id/request", authenticateUser, authorizeRoles("student"), requestEnrollment);

// Student views their own enrollments
router.get("/my", authenticateUser, authorizeRoles("student"), getMyEnrollments);

// Student views coursework for a specific course
router.get("/courses/:id/coursework", authenticateUser, authorizeRoles("student"), getStudentCoursework);

// Student marks a content item as complete and updates course progress
router.patch("/courses/:id/content/:contentId/complete", authenticateUser, authorizeRoles("student"), markContentComplete);

// Faculty views enrollments for their assigned courses
router.get("/faculty", authenticateUser, authorizeRoles("faculty"), getFacultyEnrollments);

// Faculty/admin approves/rejects an enrollment request
router.patch("/:id/status", authenticateUser, authorizeRoles("faculty", "admin"), reviewEnrollment);

module.exports = router;
