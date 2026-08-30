const express = require("express");
const { requestEnrollment, getMyEnrollments, getFacultyEnrollments, reviewEnrollment } = require("../controllers/enrollmentController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();

// Student requests enrollment in a published course
router.post("/courses/:courseId/request", authenticateUser, authorizeRoles("student"), requestEnrollment);

// Student views their own enrollments
router.get("/my", authenticateUser, authorizeRoles("student"), getMyEnrollments);

// Faculty views enrollments for their assigned courses
router.get("/faculty", authenticateUser, authorizeRoles("faculty"), getFacultyEnrollments);

// Faculty or admin approves/rejects an enrollment request
router.patch("/:id/status", authenticateUser, authorizeRoles("faculty", "admin"), reviewEnrollment);

module.exports = router;
