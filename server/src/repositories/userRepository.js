const User = require("../models/userModel");

const findUserById = async (userId) => {
  return await User.findById(userId);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
};
