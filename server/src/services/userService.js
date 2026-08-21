const { getNextId } = require("./idService.js");

const userRepository = require("../repositories/userRepository");
let passwordHashing = require("../middleware/passwordHashing");

const registerUser = async (firstName, lastName, email, password, typeOfUser) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }
  if (typeOfUser === "admin" || typeOfUser === "faculty") {
    throw new Error("Cannot register as admin or faculty.");
  }
  const hashedPassword = await passwordHashing.hashPassword(password);
  const newUser = await userRepository.createUser({ firstName, lastName, email, passwordHash: hashedPassword, typeOfUser: "student" });
  return newUser;
};

const loginUser = async (email, password, typeOfUser) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (!existingUser) {
    throw new Error("Invalid email");
  }
  const isPasswordValid = await passwordHashing.comparePassword(password, existingUser.passwordHash);
  if (!isPasswordValid || existingUser.typeOfUser !== typeOfUser) {
    throw new Error("Invalid credentials");
  }
  return existingUser;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userRepository.findUserByIdWithPassword(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  const isPasswordValid = await passwordHashing.comparePassword(currentPassword, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect.");
  }
  user.passwordHash = await passwordHashing.hashPassword(newPassword);
  await user.save();
  return {
    message: "Password changed successfully.",
  };
};

const getAllFacultyUsers = async () => {
  const facultyUsers = await userRepository.findAllFacultyUsers();
  return facultyUsers;
};

const getFacultyById = async (id) => {
  const facultyUser = await userRepository.findUserById(id);
  if (!facultyUser || facultyUser.typeOfUser !== "faculty") {
    throw new Error("Faculty user not found");
  }
  return facultyUser;
};

const updateFaculty = async (id, updatedData) => {
  const facultyUser = await userRepository.findUserById(id);
  if (!facultyUser || facultyUser.typeOfUser !== "faculty") {
    throw new Error("Faculty user not found");
  }
  if (updatedData.firstName !== undefined) {
    facultyUser.firstName = updatedData.firstName;
  }
  if (updatedData.lastName !== undefined) {
    facultyUser.lastName = updatedData.lastName;
  }
  if (updatedData.email !== undefined) {
    facultyUser.email = updatedData.email;
  }
  if (updatedData.phone !== undefined) {
    facultyUser.phone = updatedData.phone;
  }
  if (updatedData.isActive !== undefined) {
    facultyUser.isActive = updatedData.isActive;
  }
  if (updatedData.facultyProfile) {
    facultyUser.facultyProfile = {
      ...facultyUser.facultyProfile,
      ...updatedData.facultyProfile,
    };
  }
  await facultyUser.save();
  return facultyUser;
};

const registerFaculty = async (facultyData) => {
  const { firstName, lastName, email, password, phone, facultyProfile } = facultyData;
  let existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await passwordHashing.hashPassword(password);
  const facultyId = await getNextId("facultyId", 1001);
  const newFaculty = await userRepository.createFacultyUser({
    firstName,
    lastName,
    email,
    phone,
    passwordHash: hashedPassword,
    typeOfUser: "faculty",
    isActive: true,
    facultyProfile: {
      facultyId,
      department: facultyProfile.department,
      title: facultyProfile.title,
      specialization: facultyProfile.specialization,
      bio: facultyProfile.bio,
    },
  });
  return newFaculty;
};

const deleteFaculty = async (id) => {
  const facultyUser = await userRepository.findUserById(id);
  if (!facultyUser || facultyUser.typeOfUser !== "faculty") {
    throw new Error("Faculty user not found");
  }
  await userRepository.deleteFacultyUser(id);
};

const getAllStudents = async () => {
  const students = await userRepository.findAllStudents();
  return students;
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
};
