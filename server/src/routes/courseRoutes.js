const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", authenticateUser, authorizeRoles("admin"), courseController.createCourse);
router.get("/", authenticateUser, authorizeRoles("admin", "faculty", "student"), courseController.getCourses);
router.get("/my-courses", authenticateUser, authorizeRoles("faculty"), courseController.getMyCourses);
router.get("/:courseId", authenticateUser, authorizeRoles("admin", "faculty", "student"), courseController.getCourseByCourseId);
router.delete("/:courseId", authenticateUser, authorizeRoles("admin"), courseController.deleteCourseByCourseId);

module.exports = router;
