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
  recording: [".mp4", ".webm", ".mov"],
};

const createUploadValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const fileFilter = (req, file, cb) => {
  const contentType = req.body.contentType;
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = allowedExtensionsByType[contentType];
  if (!allowedExtensions) {
    return cb(createUploadValidationError("Invalid course content type."), false);
  }
  if (!allowedExtensions.includes(fileExtension)) {
    return cb(createUploadValidationError(`Unsupported file type for ${contentType}.`), false);
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

const handleCourseContentUpload = (req, res, next) => {
  courseContentUpload.single("file")(req, res, (error) => {
    if (!error) {
      return next();
    }
    if (error instanceof multer.MulterError) {
      const fileTooLarge = error.code === "LIMIT_FILE_SIZE";
      return res.status(fileTooLarge ? 413 : 400).json({
        success: false,
        error: fileTooLarge ? "Course content files cannot exceed 50 MB." : "Unable to process the uploaded file.",
      });
    }
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.statusCode ? error.message : "Unable to upload course content.",
    });
  });
};

module.exports = handleCourseContentUpload;
