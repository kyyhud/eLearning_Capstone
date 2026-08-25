const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  type: {
    type: String,
    enum: ["document", "video", "presentation", "recording", "link", "quiz"],
    required: true,
  },
  resourceUrl: {
    type: String,
    default: "",
  },
  fileName: {
    type: String,
    default: "",
  },
  isRequired: {
    type: Boolean,
    default: true,
  },
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  order: {
    type: Number,
    required: true,
  },
  content: {
    type: [contentSchema],
    default: [],
  },
});

const courseSchema = new mongoose.Schema(
  {
    courseId: {
      type: Number,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    durationWeeks: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Course", courseSchema);
