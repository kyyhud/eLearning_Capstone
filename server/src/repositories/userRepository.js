const User = require("../models/userModel");

const findUserById = async (userId) => {
  return await User.findById(userId);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+passwordHash");
};

const findAllFacultyUsers = async () => {
  return await User.find({ typeOfUser: "faculty" }).select("-passwordHash");
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const createFacultyUser = async (facultyData) => {
  return await User.create(facultyData);
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  createFacultyUser,
  findAllFacultyUsers,
};
