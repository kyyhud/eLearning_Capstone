const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
const createUserResponse = require("../utils/userResponse");

const studentSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const newUser = await userService.studentSignUp(firstName, lastName, email, password, "student");
    const safeUser = createUserResponse(newUser);
    res.status(201).json({ success: true, data: safeUser, message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          typeOfUser: user.typeOfUser,
          preferences: user.preferences,
        },
      },
      message: `Logged in successfully`,
    });
  } catch (error) {
    res.status(error.statusCode || 401).json({ success: false, error: error.message });
  }
};

const getCurrentUser = (req, res) => {
  const safeUser = createUserResponse(req.authenticatedUser);
  res.status(200).json({
    success: true,
    data: safeUser,
  });
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.user.userId, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllFacultyUsers = async (req, res) => {
  try {
    const facultyUsers = await userService.getAllFacultyUsers();
    res.status(200).json({ success: true, data: facultyUsers, message: "Faculty users retrieved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyUser = await userService.getFacultyById(id, req.user);
    res.status(200).json({ success: true, data: facultyUser, message: "Faculty user retrieved successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedFaculty = await userService.updateFaculty(id, updatedData, req.user);
    res.status(200).json({ success: true, data: updatedFaculty, message: "Faculty user updated successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message });
  }
};

const registerFaculty = async (req, res) => {
  try {
    const facultyData = req.body;
    const newFaculty = await userService.registerFaculty(facultyData);
    const safeFaculty = createUserResponse(newFaculty);
    res.status(201).json({ success: true, data: safeFaculty, message: "Faculty registered successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await userService.getAllStudents();
    res.status(200).json({ success: true, data: students, message: "Students retrieved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await userService.getStudentById(id, req.user);
    res.status(200).json({ success: true, data: student, message: "Student retrieved successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedStudent = await userService.updateStudent(id, updatedData, req.user);
    res.status(200).json({ success: true, data: updatedStudent, message: "Student updated successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message });
  }
};

module.exports = {
  studentSignUp,
  loginUser,
  getCurrentUser,
  changePassword,
  getAllFacultyUsers,
  registerFaculty,
  getFacultyById,
  updateFaculty,
  deleteUser,
  getAllStudents,
  getStudentById,
  updateStudent,
};
