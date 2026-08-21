const { getNextId } = require("./idService.js");

const userRepository = require("../repositories/userRepository");
let passwordHashing = require("../middleware/passwordHashing");

const studentSignUp = async (firstName, lastName, email, password, typeOfUser) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const studentId = await getNextId("studentId", 10001);
  const hashedPassword = await passwordHashing.hashPassword(password);
  const newUser = await userRepository.createStudent({
    firstName,
    lastName,
    email,
    passwordHash: hashedPassword,
    typeOfUser: "student",
    studentProfile: { studentId },
  });
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

const deleteUser = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  await userRepository.deleteUser(id);
};

const getAllStudents = async () => {
  const students = await userRepository.findAllStudents();
  return students;
};

const getStudentById = async (id) => {
  const student = await userRepository.findUserById(id);
  if (!student || student.typeOfUser !== "student") {
    throw new Error("Student not found");
  }
  return student;
};

const updateStudent = async (id, updatedData) => {
  const student = await userRepository.findUserById(id);
  if (!student || student.typeOfUser !== "student") {
    throw new Error("Student not found");
  }
  if (updatedData.firstName !== undefined) {
    student.firstName = updatedData.firstName;
  }
  if (updatedData.lastName !== undefined) {
    student.lastName = updatedData.lastName;
  }
  if (updatedData.email !== undefined) {
    student.email = updatedData.email;
  }
  if (updatedData.phone !== undefined) {
    student.phone = updatedData.phone;
  }
  if (updatedData.isActive !== undefined) {
    student.isActive = updatedData.isActive;
  }
  if (updatedData.studentProfile) {
    student.studentProfile = {
      ...student.studentProfile,
      ...updatedData.studentProfile,
    };
  }
  await student.save();
  return student;
};

module.exports = {
  studentSignUp,
  loginUser,
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
