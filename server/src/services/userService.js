const userRepository = require("../repositories/userRepository");
let passwordHashing = require("../middleware/passwordHashing");

const registerUser = async (email, password, typeOfUser) => {
  let existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await passwordHashing.hashPassword(password);
  const newUser = await userRepository.createUser({ email, passwordHash: hashedPassword, typeOfUser: "student" });
  return newUser;
};

const loginUser = async (email, password, typeOfUser) => {
  let existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    const isPasswordValid = await passwordHashing.comparePassword(password, existingUser.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    } else if (existingUser.typeOfUser === "admin") {
      return "admin";
    } else if (existingUser.typeOfUser === "faculty") {
      return "faculty";
    } else if (existingUser.typeOfUser === "student") {
      return "student";
    }
  } else {
    throw new Error("Invalid user type");
  }
};

module.exports = {
  createAdminUser,
  registerUser,
  loginUser,
};
