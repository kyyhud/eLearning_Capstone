const mongoose = require("mongoose");

const nameRegex = /^[A-Za-z'-]+(?: [A-Za-z'-]+)*$/;
const studentTextRegex = /^[A-Za-z0-9\s.,+#&'/-]+$/;

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
      maxlength: [75, "Field of Study cannot exceed 75 characters"],
      match: [studentTextRegex, "Field of Study contains invalid characters"],
    },
    careerGoal: {
      type: String,
      trim: true,
      default: "",
      maxlength: [100, "Career Goal cannot exceed 100 characters"],
      match: [studentTextRegex, "Career Goal contains invalid characters"],
    },
    skills: {
      type: [String],
      default: [],
      maxlength: [250, "Skills cannot exceed 250 characters"],
      match: [studentTextRegex, "Skills contains invalid characters"],
    },
    certifications: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
          maxlength: [100, "Certification name cannot exceed 100 characters"],
          match: [studentTextRegex, "Certification name contains invalid characters"],
        },
        issuer: {
          type: String,
          trim: true,
          required: true,
          maxlength: [100, "Issuer cannot exceed 100 characters"],
          match: [studentTextRegex, "Issuer contains invalid characters"],
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
        maxlength: [100, "Emergency contact name cannot exceed 100 characters"],
        match: [nameRegex, "Emergency contact name can only contain letters, spaces, hyphens, and apostrophes."],
      },
      relationship: {
        type: String,
        trim: true,
        default: "",
        maxlength: [100, "Emergency contact relationship cannot exceed 100 characters"],
        match: [studentTextRegex, "Emergency contact relationship contains invalid characters"],
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
    },
  },
  { _id: false },
);

const removeSensitiveUserFields = (_document, returnedObject) => {
  delete returnedObject.passwordHash;
  return returnedObject;
};

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      match: [nameRegex, "First name can only contain letters, spaces, hyphens, and apostrophes."],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      match: [nameRegex, "Last name can only contain letters, spaces, hyphens, and apostrophes."],
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
    preferences: {
      chatAutoRefresh: {
        type: Boolean,
        default: true,
      },
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
  {
    timestamps: true,
    toJSON: {
      transform: removeSensitiveUserFields,
    },
    toObject: {
      transform: removeSensitiveUserFields,
    },
  },
);

module.exports = mongoose.model("User", userSchema);
module.exports.facultyProfileSchema = facultyProfileSchema;
module.exports.studentProfileSchema = studentProfileSchema;
