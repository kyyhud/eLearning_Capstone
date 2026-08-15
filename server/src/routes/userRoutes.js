const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/faculty", userController.getAllFacultyUsers);
router.post("/faculty", userController.registerFaculty);

module.exports = router;
