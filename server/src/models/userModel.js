const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  typeOfUser: {
    type: String,
    enum: ["admin", "faculty", "student"],
    required: true,
    default: "student",
  },
});

module.exports = mongoose.model("User", userSchema);
