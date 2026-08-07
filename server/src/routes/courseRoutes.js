const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.post("/create", courseController.createCourse);
router.get("/all", courseController.getAllCourses);
router.get("/title/:title", courseController.getCourseByTitle);

module.exports = router;
