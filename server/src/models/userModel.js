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
    phone: {
      type: String,
      trim: true,
      default: "",
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
    isActive: {
      type: Boolean,
      default: true,
    },
    facultyProfile: {
      facultyId: {
        type: Number,
        unique: true,
        sparse: true,
      },
      department: {
        type: String,
        trim: true,
        default: "",
      },
      title: {
        type: String,
        trim: true,
        default: "",
      },
      specialization: {
        type: String,
        trim: true,
        default: "",
      },
      bio: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
