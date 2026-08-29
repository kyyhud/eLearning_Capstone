const mongoose = require("mongoose");

const nameRegex = /^[A-Za-z'-]+(?: [A-Za-z'-]+)*$/;

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
      maxlength: [500, "Bio cannot exceed 500 characters"],
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
      maxlength: [500, "Bio cannot exceed 500 characters"],
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
      validate: {
        validator: function (value) {
          return nameRegex.test(value);
        },
        message: "First name can only contain letters, spaces, hyphens, and apostrophes.",
      },
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          return nameRegex.test(value);
        },
        message: "Last name can only contain letters, spaces, hyphens, and apostrophes.",
      },
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
      validate: {
        validator: function (value) {
          if (!value) return true;
          const digitsOnly = value.replace(/\D/g, "");
          return digitsOnly.length === 10;
        },
        message: "Please enter a valid phone number",
      },
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
