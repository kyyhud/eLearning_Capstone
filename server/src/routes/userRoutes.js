const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/change-password", authenticateUser, userController.changePassword);

router.get("/faculty", authenticateUser, authorizeRoles("admin"), userController.getAllFacultyUsers);
router.get("/faculty/:id", authenticateUser, authorizeRoles("admin", "faculty"), userController.getFacultyById);
router.put("/faculty/:id", authenticateUser, authorizeRoles("admin", "faculty"), userController.updateFaculty);
router.post("/faculty", authenticateUser, authorizeRoles("admin"), userController.registerFaculty);
router.delete("/faculty/:id", authenticateUser, authorizeRoles("admin"), userController.deleteFaculty);

router.get("/students", authenticateUser, authorizeRoles("admin"), userController.getAllStudents);
router.get("/students/:id", authenticateUser, authorizeRoles("admin", "student"), userController.getStudentById);
router.put("/students/:id", authenticateUser, authorizeRoles("admin", "student"), userController.updateStudent);

module.exports = router;
