import multer from "multer";
import cloudinary from "../config/cloudinary.js"; // 
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, //  FIXED
params: async (req, file) => {
  let folder = "temp";

  if (req.route.path.includes("/upload/:projectId")) {
    folder = `projects/${req.params.projectId}`;
  } else if (req.route.path.includes("/upload/:userId")) {
    folder = `users/${req.params.userId}`;
  }

  const ext = file.originalname.split(".").pop().toLowerCase();

  return {
    folder,

    resource_type: "auto", // ⭐ keep this

    format: ext, // ⭐ VERY IMPORTANT (forces correct type)

    public_id: `${Date.now()}-${file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "")}`,

    type: "upload",
  };
}
});

// File Filter (same as your logic, cleaned)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/x-rar",
    "application/vnd.rar",
    "application/octet-stream",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain",
    "application/javascript",
    "text/css",
    "text/html",
    "application/json",
  ];

  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".zip",
    ".rar",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".txt",
    ".js",
    ".css",
    ".html",
    ".json",
  ];

  const fileExt = file.originalname.split(".").pop().toLowerCase();
  const extWithDot = "." + fileExt;

  if (
    allowedTypes.includes(file.mimetype) ||
    allowedExtensions.includes(extWithDot)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, DOC, DOCX, PPTX, ZIP, RAR, IMAGES, and code files are allowed"
      ),
      false
    );
  }
};

// 🚀 Multer Upload Config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10,
  },
});

// ⚠️ Error Handler (same as yours, cleaned)
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the limit of 10MB",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "File count exceeds the limit of 10 files",
      });
    }
  }

  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  next(err);
};

export { upload, handleUploadError };