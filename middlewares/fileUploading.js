const multer = require("multer");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const { defaultServerResponse } = require("../constants/message");

// Use memory storage to temporarily hold files in memory
const storage = multer.memoryStorage();
module.exports.upload = multer({ storage: storage });

// Allowed file extensions and maximum size
const allowedExtensions = ["png", "jpg", "pdf"]; // Add more extensions if needed
const maxSize = 5 * 1024 * 1024; // 5MB

// Middleware to validate file extensions and size
module.exports.validateFiles = (req, res, next) => {
  const response = _.cloneDeep(defaultServerResponse);

  // Check if files exist in request
  if (!req.files || req.files.length === 0) {
    response.errors.files = "No files uploaded";
    response.message = "No files uploaded";
    return res.status(response.status).send(response);
  }

  // Validate each file
  for (let file of req.files) {
    const fileExtension = path
      .extname(file.originalname)
      .substring(1)
      .toLowerCase();

    // Validate file extension
    if (!allowedExtensions.includes(fileExtension)) {
      response.errors.files = `Invalid file extension: ${fileExtension}`;
      response.message = `Invalid file extension: ${fileExtension}`;
      return res.status(response.status).send(response);
    }

    // Validate file size
    if (file.size > maxSize) {
      response.errors.files = `File size exceeds limit: ${file.originalname}`;
      response.message = `File size exceeds limit: ${file.originalname}`;
      return res.status(response.status).send(response);
    }
  }

  // If validation passes, proceed to next middleware
  next();
};

// Manually save the files after validation
module.exports.saveFiles = (req, res, next) => {
  const uploadDir = "uploads/";

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  req.files.forEach((file) => {
    const filePath = path.join(
      uploadDir,
      Date.now() + path.extname(file.originalname)
    );

    // Save file from memory to disk
    fs.writeFileSync(filePath, file.buffer);
  });

  // Collect uploaded file details
  const fileDetails = req.files.map((file) => {
    return {
      originalName: file.originalname, // Original file name
      filename: file.filename, //  file name
      mimeType: file.mimetype, // File MIME type (e.g., 'image/png')
      size: file.size, // File size in bytes
      encoding: file.encoding, // Encoding type (e.g., '7bit')
      bufferSize: file.buffer.length, // Buffer size (the same as file size)
      path: file.path, // Full file path (location where it's saved)
    };
  });
  req.files = fileDetails;

  next();
  //   res.json({ message: "Files uploaded and validated successfully" });
};
