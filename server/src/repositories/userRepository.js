const User = require("../models/userModel");

const findUserById = async (userId) => {
  return await User.findById(userId);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+passwordHash");
};

const findUserByIdWithPassword = async (userId) => {
  return User.findById(userId).select("+passwordHash");
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

const deleteFacultyUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

const findAllStudents = async () => {
  return await User.find({ typeOfUser: "student" }).select("-passwordHash");
};

const findStudentById = async (id) => {
  return await User.findById(id);
};

module.exports = {
  findUserById,
  findUserByEmail,
  findUserByIdWithPassword,
  createUser,
  createFacultyUser,
  findAllFacultyUsers,
  deleteFacultyUser,
  findAllStudents,
  findStudentById,
};
