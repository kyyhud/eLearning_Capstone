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
    throw new Error("Invalid email");
  }
  const isPasswordValid = await passwordHashing.comparePassword(
    password,
    existingUser.passwordHash
  );
  if (!isPasswordValid || existingUser.typeOfUser !== typeOfUser) {
    throw new Error("Invalid credentials");
  }
  return existingUser;
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
  const { firstName, lastName, email, password, facultyProfile } = facultyData;
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
    isActive: true,
    facultyProfile: {
      phone: facultyProfile.phone,
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

module.exports = {
  registerUser,
  loginUser,
  getAllFacultyUsers,
  registerFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};
