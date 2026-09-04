const ChatMessage = require("../models/chatMessageModel");

const findMessagesByCourse = async (id) => {
  const messages = await ChatMessage.find({ course: id }).populate("sender", "firstName lastName typeOfUser").sort({ createdAt: -1 }).limit(50);
  return messages.reverse();
};

const createMessage = async (messageData) => {
  const message = await ChatMessage.create(messageData);
  await message.populate("sender", "firstName lastName typeOfUser");
  return message;
};

module.exports = {
  findMessagesByCourse,
  createMessage,
};
