const createUserResponse = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  typeOfUser: user.typeOfUser,
  isActive: user.isActive,
  preferences: user.preferences,
  facultyProfile: user.facultyProfile,
  studentProfile: user.studentProfile,
});

module.exports = createUserResponse;