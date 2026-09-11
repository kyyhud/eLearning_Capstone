const bcrypt = require("bcrypt");
const PASSWORD_REQUIREMENTS = "Password must be 12 to 64 characters and include an uppercase letter, lowercase letter, number, and special character.";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const validatePassword = (password) => {
  const isValid =
    typeof password === "string" &&
    password.length >= 12 &&
    password.length <= 64 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);
  if (!isValid) {
    throw new Error(PASSWORD_REQUIREMENTS);
  }
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  validatePassword,
  comparePassword,
};
