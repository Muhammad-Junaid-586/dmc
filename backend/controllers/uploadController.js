const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../cloudinary");
const fetch = require("node-fetch"); // Install node-fetch if not already installed

// Subject & Student Field Mappings
const subjectMapping = {
  urdu: ["u", "ur", "urdu"],
  generalscience: ["gs", "general science", "generalscience"],
  pakstudy: ["ps", "pak study", "pakstudy"],
  english: ["e", "eng", "english"],
  islamiat: ["is", "islamiat", "islamic study", "islamicstudy"],
  mathematics: ["m", "math", "maths", "mathematics"],
  physics: ["p", "physics", "phy"],
  chemistry: ["c", "chemistry", "chem"],
  biology: ["b", "biology", "bio"],
  computerScience: ["cs", "computer science", "comp sci", "comp-science"],
  obtainMarks: ["om", "obt", "obtain marks", "obtainmarks"],
  totalMarks: ["tm", "total", "total marks", "totalmarks"],
  position: ["pos", "rank", "position"],
  status: ["st", "result", "status", "pass/fail"],
  percentage: ["per", "per%", "percentage"],
  grade: ["grade", "g"],
};

const studentFieldsMapping = {
  "Student-Name": ["student name", "name", "studentname", "student"],
  "Roll No": ["roll no", "rollno", "r.no"],
  "Father Name": ["father name", "fathername"],
  "School Name": ["school name", "schoolname"],
  "Remarks": ["remarks", "comment", "feedback"],
};

// Helper Function: Upload File to Cloudinary
const uploadToCloudinary = async (filePath, folder, resourceType = "image") => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      use_filename: true,
      unique_filename: false,
      resource_type: resourceType, // "image" for logo, "raw" for Excel
    });
    return uploadResponse.secure_url;
  } catch (err) {
    console.error(`❌ Cloudinary Upload Error (${resourceType}):`, err);
    throw new Error(`Error uploading ${resourceType} file`);
  }
};

// Upload File Handler
const uploadFile = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    if (!req.files || (!req.files.logo && !req.files.excel)) {
      return res.status(400).json({ error: "Please upload both a logo and an Excel file." });
    }

    let logoUrl = "";
    let excelUrl = "";

    // Upload Logo to Cloudinary (image)
    if (req.files.logo) {
      const logoPath = req.files.logo[0].path;

      // Validate Image File
      if (!req.files.logo[0].mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Uploaded logo is not a valid image file." });
      }

      logoUrl = await uploadToCloudinary(logoPath, "dmc_logos", "image");
      console.log("✅ Cloudinary Upload Successful (Logo):", logoUrl);

      // Delete Local File Asynchronously
      fs.promises.unlink(logoPath).catch((err) => console.error("❌ Error deleting file:", err));
    }

    // Upload Excel to Cloudinary (raw file)
    if (req.files.excel) {
      const excelPath = req.files.excel[0].path;

      // Validate Excel File Type
      if (!req.files.excel[0].mimetype.includes("spreadsheet")) {
        return res.status(400).json({ error: "Uploaded file is not a valid Excel file." });
      }

      excelUrl = await uploadToCloudinary(excelPath, "dmc_excels", "raw");
      console.log("✅ Cloudinary Upload Successful (Excel):", excelUrl);

      // Delete Local File Asynchronously
      fs.promises.unlink(excelPath).catch((err) => console.error("❌ Error deleting file:", err));
    }

    // Download Excel File from Cloudinary
    const excelResponse = await fetch(excelUrl);
    const excelBuffer = await excelResponse.buffer();

    // Read Excel File
    const workbook = xlsx.read(excelBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return res.status(400).json({ success: false, msg: "Uploaded Excel file is empty or invalid." });
    }

    // Normalize Headers
    const headers = Object.keys(data[0] || {}).reduce((acc, key) => {
      const normalizedKey = key.replace(/\n/g, " ").trim().toLowerCase();
      acc[normalizedKey] = key;
      return acc;
    }, {});

    // Extract & Validate Input Data
    const { schoolName, session, class_level, passingCriteria, passingPercentage, failedPapers, passedPapers, subjects, declarationDate, examType } = req.body;
    const selectedSubjects = JSON.parse(subjects || "[]");

    console.log("Selected Subjects:", selectedSubjects);
    console.log("Class Level:", class_level);

    // Process Student Data
    const processedData = data.map((student) => {
      const mappedStudent = {};

      // Map Student Details
      Object.keys(studentFieldsMapping).forEach((label) => {
        const possibleKeys = studentFieldsMapping[label];
        const key = Object.keys(headers).find((k) => possibleKeys.includes(k));
        mappedStudent[label] = key ? student[headers[key]] : "N/A";
      });

      // Map Subjects & Marks
      Object.keys(subjectMapping).forEach((label) => {
        const possibleKeys = subjectMapping[label];
        const key = Object.keys(headers).find((k) => possibleKeys.includes(k));
        let value = key ? student[headers[key]] : "N/A";

        // Ensure Percentage Values Are Formatted Correctly
        if (label === "percentage" && typeof value === "number") {
          value = value < 1 ? (value * 100).toFixed(2) : value.toFixed(2);
          value = `${value}%`;
        }

        mappedStudent[label] = value;
      });

      // Additional Fields
      mappedStudent["Session"] = session || "N/A";
      mappedStudent["School Name"] = schoolName || "N/A";
      mappedStudent["Class Level"] = class_level || "N/A";
      mappedStudent["Subjects"] = selectedSubjects;

      mappedStudent["Passing Criteria"] = passingCriteria || "N/A";
      if (passingCriteria === "Percentage") {
        mappedStudent["Passing Percentage"] = passingPercentage || "N/A";
      } else if (passingCriteria === "No of Papers Failed") {
        mappedStudent["Failed Papers"] = failedPapers || "N/A";
      } else if (passingCriteria === "No of Papers Passed") {
        mappedStudent["Passed Papers"] = passedPapers || "N/A";
      }

      mappedStudent["Logo"] = logoUrl;
      mappedStudent["Declaration Date"] = declarationDate || "N/A"; // Add declaration date
      mappedStudent["Exam Type"] = examType || "N/A"; // Add exam type

      return mappedStudent;
    });

    res.json({
      success: true,
      message: "File processed successfully.",
      totalStudents: processedData.length,
      data: processedData,
    });
  } catch (error) {
    console.error("❌ Error in Upload API:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports = { uploadFile };