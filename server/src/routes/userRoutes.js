const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/faculty", userController.getAllFacultyUsers);
router.get("/faculty/:id", userController.getFacultyById);
router.put("/faculty/:id", userController.updateFaculty);
router.post("/faculty", userController.registerFaculty);
router.delete("/faculty/:id", userController.deleteFaculty);

module.exports = router;
