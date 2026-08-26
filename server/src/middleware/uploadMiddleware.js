const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

const uploadDirectory = path.join(__dirname, "../../uploads/course-content");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${Date.now()}-${randomUUID()}${fileExtension}`;
    cb(null, uniqueFileName);
  },
});

const allowedExtensionsByType = {
  document: [".pdf", ".doc", ".docx", ".txt"],
  presentation: [".ppt", ".pptx", ".pdf"],
  video: [".mp4", ".webm", ".mov"],
  recording: [".mp4", ".webm"],
};

const fileFilter = (req, file, cb) => {
  const contentType = req.body.contentType;
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = allowedExtensionsByType[contentType];
  if (!allowedExtensions) {
    return cb(new Error("Invalid course content type."), false);
  }
  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error(`Unsupported file type for ${contentType}.`), false);
  }
  cb(null, true);
};

const courseContentUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max file size
  },
});

module.exports = courseContentUpload;
