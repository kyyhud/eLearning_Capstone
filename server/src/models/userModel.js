const mongoose = require("mongoose");

const facultyProfileSchema = new mongoose.Schema(
  {
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
  { _id: false },
);

const studentProfileSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      default: "",
    },
    careerGoal: {
      type: String,
      trim: true,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    certifications: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
        },
        issuer: {
          type: String,
          trim: true,
          required: true,
        },
        dateEarned: {
          type: Date,
          required: true,
        },
      },
    ],
    emergencyContact: {
      name: {
        type: String,
        trim: true,
        default: "",
      },
      relationship: {
        type: String,
        trim: true,
        default: "",
      },
      phone: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  { _id: false },
);

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
      type: facultyProfileSchema,
      default: undefined,
    },
    studentProfile: {
      type: studentProfileSchema,
      default: undefined,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
module.exports.facultyProfileSchema = facultyProfileSchema;
module.exports.studentProfileSchema = studentProfileSchema;
