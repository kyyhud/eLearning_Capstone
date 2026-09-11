const { getNextId } = require("./idService.js");

const userRepository = require("../repositories/userRepository");
const passwordUtils = require("../utils/passwordUtils");

const verifySelfOrAdmin = (targetUserId, expectedRole, currentUser) => {
  const isAdmin = currentUser.typeOfUser === "admin";
  const isOwner = currentUser.typeOfUser === expectedRole && String(currentUser.userId) === String(targetUserId);
  if (!isAdmin && !isOwner) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
};

const getAllowedUpdates = (updatedData, allowedFields) => {
  const allowedUpdates = {};
  allowedFields.forEach((field) => {
    if (updatedData[field] !== undefined) {
      allowedUpdates[field] = updatedData[field];
    }
  });
  return allowedUpdates;
};

const saveProfileUpdate = async (user) => {
  try {
    await userRepository.saveUser(user);
  } catch (error) {
    const duplicateEmail =
      error.code === 11000 &&
      (error.keyPattern?.email || error.keyValue?.email);
    if (duplicateEmail) {
      const duplicateEmailError = new Error("Email already exists");
      duplicateEmailError.statusCode = 400;
      throw duplicateEmailError;
    }
    if (error.name === "ValidationError") {
      const validationMessage =
        Object.values(error.errors)[0]?.message ||
        "Invalid user information";
      const validationError = new Error(validationMessage);
      validationError.statusCode = 400;
      throw validationError;
    }
    throw error;
  }
};

const studentSignUp = async (firstName, lastName, email, password, typeOfUser) => {
  passwordUtils.validatePassword(password);
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const studentId = await getNextId("studentId", 10001);
  const hashedPassword = await passwordUtils.hashPassword(password);
  const newUser = await userRepository.createStudent({
    firstName,
    lastName,
    email,
    passwordHash: hashedPassword,
    studentProfile: { studentId },
  });
  return newUser;
};

const loginUser = async (email, password) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (!existingUser) {
    throw new Error("Invalid credentials");
  }
  const isPasswordValid = await passwordUtils.comparePassword(password, existingUser.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  if (!existingUser.isActive) {
    const error = new Error("This account is inactive");
    error.statusCode = 403;
    throw error;
  }
  return existingUser;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userRepository.findUserByIdWithPassword(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  const isPasswordValid = await passwordUtils.comparePassword(currentPassword, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect.");
  }
  passwordUtils.validatePassword(newPassword);
  const isSamePassword = await passwordUtils.comparePassword(newPassword, user.passwordHash);
  if (isSamePassword) {
    throw new Error("New password must be different from the current password.");
  }

  user.passwordHash = await passwordUtils.hashPassword(newPassword);
  await userRepository.saveUser(user);
  return {
    message: "Password changed successfully.",
  };
};

const getAllFacultyUsers = async () => {
  const facultyUsers = await userRepository.findAllFacultyUsers();
  return facultyUsers;
};

const getFacultyById = async (id, currentUser) => {
  verifySelfOrAdmin(id, "faculty", currentUser);
  const facultyUser = await userRepository.findUserById(id);
  if (!facultyUser || facultyUser.typeOfUser !== "faculty") {
    const error = new Error("Faculty user not found");
    error.statusCode = 404;
    throw error;
  }
  return facultyUser;
};

const updateFaculty = async (id, updatedData, currentUser) => {
  verifySelfOrAdmin(id, "faculty", currentUser);
  const facultyUser = await userRepository.findUserById(id);
  if (!facultyUser || facultyUser.typeOfUser !== "faculty") {
    const error = new Error("Faculty user not found");
    error.statusCode = 404;
    throw error;
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
  if (currentUser.typeOfUser === "admin" && updatedData.isActive !== undefined) {
    facultyUser.isActive = updatedData.isActive;
  }
  if (typeof updatedData.preferences?.chatAutoRefresh === "boolean") {
    facultyUser.preferences.chatAutoRefresh = updatedData.preferences.chatAutoRefresh;
  }
  if (updatedData.facultyProfile) {
    const allowedFacultyProfileUpdates = getAllowedUpdates(updatedData.facultyProfile, ["department", "title", "specialization", "bio"]);
    Object.assign(facultyUser.facultyProfile, allowedFacultyProfileUpdates);
  }
  await saveProfileUpdate(facultyUser);
  return facultyUser;
};

const registerFaculty = async (facultyData) => {
  const { firstName, lastName, email, password, phone, facultyProfile } = facultyData;
  passwordUtils.validatePassword(password);
  let existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await passwordUtils.hashPassword(password);
  const facultyId = await getNextId("facultyId", 1001);
  const newFaculty = await userRepository.createFacultyUser({
    firstName,
    lastName,
    email,
    phone,
    passwordHash: hashedPassword,
    typeOfUser: "faculty",
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

const getStudentById = async (id, currentUser) => {
  verifySelfOrAdmin(id, "student", currentUser);
  const student = await userRepository.findUserById(id);
  if (!student || student.typeOfUser !== "student") {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }
  return student;
};

const updateStudent = async (id, updatedData, currentUser) => {
  verifySelfOrAdmin(id, "student", currentUser);
  const student = await userRepository.findUserById(id);
  if (!student || student.typeOfUser !== "student") {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
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
  if (currentUser.typeOfUser === "admin" && updatedData.isActive !== undefined) {
    student.isActive = updatedData.isActive;
  }
  if (typeof updatedData.preferences?.chatAutoRefresh === "boolean") {
    student.preferences.chatAutoRefresh = updatedData.preferences.chatAutoRefresh;
  }
  if (updatedData.studentProfile) {
    const allowedStudentProfileUpdates = getAllowedUpdates(updatedData.studentProfile, [
      "bio",
      "fieldOfStudy",
      "careerGoal",
      "skills",
      "certifications",
      "emergencyContact",
    ]);
    Object.assign(student.studentProfile, allowedStudentProfileUpdates);
  }
  await saveProfileUpdate(student);
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
