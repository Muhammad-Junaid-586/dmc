const multer = require("multer");
const path = require("path");

// Define storage settings for Excel files (local storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/excel")); // Save Excel files locally
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// Allowed file extensions & MIME types
const allowedFileTypes = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
};

// File filter function
const fileFilter = (req, file, cb) => {
  if (allowedFileTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error("❌ Invalid file type. Only PNG, JPEG, JPG, XLSX, and XLS are allowed."), false);
  }
};

// Multer upload settings
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter: fileFilter,
});

module.exports = upload;