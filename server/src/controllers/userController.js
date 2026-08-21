const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, typeOfUser } = req.body;
    const newUser = await userService.registerUser(firstName, lastName, email, password, typeOfUser);
    res.status(201).json({ success: true, data: newUser, message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, typeOfUser } = req.body;
    const user = await userService.loginUser(email, password, typeOfUser);
    const token = jwt.sign({ userId: user._id, typeOfUser: user.typeOfUser }, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.status(200).json({
      success: true,
      message: `Logged in as ${typeOfUser}`,
      token,
      user: {
        _id: user._id,
        email: user.email,
        typeOfUser: user.typeOfUser,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
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
    const facultyUser = await userService.getFacultyById(id);
    res.status(200).json({ success: true, data: facultyUser, message: "Faculty user retrieved successfully" });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedFaculty = await userService.updateFaculty(id, updatedData);
    res.status(200).json({ success: true, data: updatedFaculty, message: "Faculty user updated successfully" });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

const registerFaculty = async (req, res) => {
  try {
    const facultyData = req.body;
    const newFaculty = await userService.registerFaculty(facultyData);
    res.status(201).json({ success: true, data: newFaculty, message: "Faculty registered successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteFaculty(id);
    res.status(200).json({ success: true, message: "Faculty user deleted successfully" });
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
    if (req.user.typeOfUser === "student" && req.user.userId !== id) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }
    const student = await userService.getStudentById(id);
    res.status(200).json({ success: true, data: student, message: "Student retrieved successfully" });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.typeOfUser === "student" && req.user.userId !== id) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }
    const updatedData = req.body;
    const updatedStudent = await userService.updateStudent(id, updatedData);
    res.status(200).json({ success: true, data: updatedStudent, message: "Student updated successfully" });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  getAllFacultyUsers,
  registerFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
  getAllStudents,
  getStudentById,
  updateStudent,
};
