const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

chatMessageSchema.index({ course: 1, createdAt: -1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
