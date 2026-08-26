const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const courseContentUpload = require("../middleware/uploadMiddleware");

router.post("/", authenticateUser, authorizeRoles("admin"), courseController.createCourse);
router.get("/", authenticateUser, authorizeRoles("admin", "faculty", "student"), courseController.getCourses);
router.get("/my-courses", authenticateUser, authorizeRoles("faculty"), courseController.getMyCourses);
router.get("/:id", authenticateUser, authorizeRoles("admin", "faculty", "student"), courseController.getCourseById);
router.put("/:id/edit", authenticateUser, authorizeRoles("admin", "faculty"), courseController.updateCourse);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), courseController.deleteCourseById);
router.post("/uploads", authenticateUser, authorizeRoles("admin", "faculty"), courseContentUpload.single("file"), courseController.uploadCourseContent);

module.exports = router;
