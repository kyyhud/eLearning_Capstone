const userService = require("../services/userService");

const registerUser = async (req, res) => {
  try {
    const { email, password, typeOfUser } = req.body;
    const newUser = await userService.registerUser(email, password, typeOfUser);
    res.status(201).json({ success: true, data: newUser, message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, typeOfUser } = req.body;
    const user = await userService.loginUser(email, password, typeOfUser);
    res.status(200).json({
  success: true,
  message: `Logged in as ${typeOfUser}`,
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

module.exports = {
  registerUser,
  loginUser,
  getAllFacultyUsers,
  registerFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};
