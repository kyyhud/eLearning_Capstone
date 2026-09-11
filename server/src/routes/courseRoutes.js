const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const handleCourseContentUpload = require("../middleware/uploadMiddleware");

router.post("/", authenticateUser, authorizeRoles("admin"), courseController.createCourse);
router.get("/", authenticateUser, authorizeRoles("admin", "faculty", "student"), courseController.getCourses);
router.get("/my-courses", authenticateUser, authorizeRoles("faculty"), courseController.getMyCourses);
router.get("/:id/content/:contentId", authenticateUser, authorizeRoles("admin", "faculty", "student"), courseController.getCourseContentFile);
router.get("/:id", authenticateUser, authorizeRoles("admin", "faculty", "student"), courseController.getCourseById);
router.put("/:id/edit", authenticateUser, authorizeRoles("admin", "faculty"), courseController.updateCourse);
router.post("/uploads", authenticateUser, authorizeRoles("admin", "faculty"), handleCourseContentUpload, courseController.uploadCourseContent);

module.exports = router;
