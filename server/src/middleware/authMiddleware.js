const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }
  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
  const currentUser = await userRepository.findUserById(decoded.userId);
  if (!currentUser) {
    return res.status(401).json({
      success: false,
      error: "Session is no longer valid",
    });
  }
  if (!currentUser.isActive) {
    return res.status(403).json({
      success: false,
      error: "This account is inactive",
    });
  }
  req.user = {
    userId: currentUser._id.toString(),
    typeOfUser: currentUser.typeOfUser,
  };
  req.userId = currentUser._id.toString();
  req.authenticatedUser = currentUser;
  next();
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.typeOfUser)) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeRoles,
};
