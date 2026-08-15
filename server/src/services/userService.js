const userRepository = require("../repositories/userRepository");
let passwordHashing = require("../middleware/passwordHashing");

const registerUser = async (email, password, typeOfUser) => {
  let existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }
  if (typeOfUser === "admin") {
    throw new Error("Cannot register as admin.");
  }
  const hashedPassword = await passwordHashing.hashPassword(password);
  const newUser = await userRepository.createUser({ email, passwordHash: hashedPassword, typeOfUser });
  return newUser;
};

const loginUser = async (email, password, typeOfUser) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (!existingUser) {
    throw new Error("Invalid email"); // email => credentials
  }
  const isPasswordValid = await passwordHashing.comparePassword(password, existingUser.passwordHash);
  if (!isPasswordValid || existingUser.typeOfUser !== typeOfUser) {
    throw new Error("Invalid credentials");
  }
  return existingUser.typeOfUser;
};

const getAllFacultyUsers = async () => {
  const facultyUsers = await userRepository.findAllFacultyUsers();
  return facultyUsers;
};

const registerFaculty = async (facultyData) => {
  const { firstName, lastName, email, password, phone, bio, facultyProfile } = facultyData;
  let existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await passwordHashing.hashPassword(password);
  const newFaculty = await userRepository.createFacultyUser({
    firstName,
    lastName,
    email,
    passwordHash: hashedPassword,
    typeOfUser: "faculty",
    phone,
    bio,
    isActive: true,
    facultyProfile: {
      department: facultyProfile.department,
      title: facultyProfile.title,
      specialization: facultyProfile.specialization,
    },
  });
  return newFaculty;
};

module.exports = {
  registerUser,
  loginUser,
  getAllFacultyUsers,
  registerFaculty,
};
