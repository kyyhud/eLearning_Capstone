const chatMessageService = require("../services/chatMessageService");

const getCourseMessages = async (req, res) => {
  try {
    const messages = await chatMessageService.getCourseMessages(req.params.id, req.user);
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

const sendCourseMessage = async (req, res) => {
  try {
    const message = await chatMessageService.sendCourseMessage(req.params.id, req.body.message, req.user);
    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getCourseMessages,
  sendCourseMessage,
};
