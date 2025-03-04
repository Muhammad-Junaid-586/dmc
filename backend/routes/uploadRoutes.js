// routes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { uploadFile } = require("../controllers/uploadController");

// Upload Route
router.post("/api/uploadFiles", upload.fields([
  { name: "logo", maxCount: 1 },  // Image (Cloudinary)
  { name: "excel", maxCount: 1 }, // Excel (Local)
]), uploadFile);

module.exports = router;