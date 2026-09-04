const express = require("express");
const chatMessageController = require("../controllers/chatMessageController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/courses/:id/messages", authenticateUser, authorizeRoles("student", "faculty"), chatMessageController.getCourseMessages);

router.post("/courses/:id/messages", authenticateUser, authorizeRoles("student", "faculty"), chatMessageController.sendCourseMessage);

module.exports = router;
