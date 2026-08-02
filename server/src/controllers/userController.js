const userService = require("../services/userService");

const registerUser = async (req, res) => {
  try {
    const { email, password, typeOfUser } = req.body;
    const newUser = await userService.registerUser(email, password, typeOfUser);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, typeOfUser } = req.body;
    const userType = await userService.loginUser(email, password, typeOfUser);
    res.status(200).json({ success: true, message: `Logged in as ${userType}` });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
