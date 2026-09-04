const chatMessageRepository = require("../repositories/chatMessageRepository");
const courseRepository = require("../repositories/courseRepository");
const enrollmentRepository = require("../repositories/enrollmentRepository");

const verifyChatAccess = async (id, user) => {
  const course = await courseRepository.findCourseById(id);
  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }
  if (user.typeOfUser === "student") {
    const enrollment = await enrollmentRepository.findEnrollmentByStudentAndCourse(user.userId, id);
    if (!enrollment || enrollment.status !== "approved") {
      const error = new Error("You do not have access to this course discussion");
      error.statusCode = 403;
      throw error;
    }
  } else if (user.typeOfUser === "faculty") {
    const assignedFacultyId = course.faculty?._id?.toString() || course.faculty?.toString();
    if (assignedFacultyId !== user.userId) {
      const error = new Error("You do not have access to this course discussion");
      error.statusCode = 403;
      throw error;
    }
  } else {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
  return course;
};

const getCourseMessages = async (id, user) => {
  await verifyChatAccess(id, user);
  return await chatMessageRepository.findMessagesByCourse(id);
};

const sendCourseMessage = async (id, message, user) => {
  const course = await verifyChatAccess(id, user);
  // Check if the course is archived before allowing a new message
  if (course.status === "archived") {
    const error = new Error("Messages cannot be added to an archived course discussion");
    error.statusCode = 403;
    throw error;
  }
  // Validate the message content
  if (typeof message !== "string" || !message.trim()) {
    const error = new Error("Message is required");
    error.statusCode = 400;
    throw error;
  }
  const trimmedMessage = message.trim();
  if (trimmedMessage.length > 500) {
    const error = new Error("Message cannot exceed 500 characters");
    error.statusCode = 400;
    throw error;
  }
  return await chatMessageRepository.createMessage({
    course: id,
    sender: user.userId,
    message: trimmedMessage,
  });
};

module.exports = {
  getCourseMessages,
  sendCourseMessage,
};
