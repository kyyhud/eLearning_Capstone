const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
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
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    facultyProfile: {
      department: {
        type: String,
        trim: true,
      },
      title: {
        type: String,
        trim: true,
      },
      specialization: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
