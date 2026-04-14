import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req, file) => {
    let folder = "temp";

    if (req.route.path.includes("/upload/:projectId")) {
      folder = `projects/${req.params.projectId}`;
    } else if (req.route.path.includes("/upload/:userId")) {
      folder = `users/${req.params.userId}`;
    }

    // ✅ remove extension from filename
    const fileNameWithoutExt = file.originalname
      .split(".")
      .slice(0, -1)
      .join(".");

    return {
      folder,
      resource_type: "auto", // auto detect type

      // ❌ removed format (fixes double extension issue)

      public_id: `${Date.now()}-${fileNameWithoutExt
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "")}`,

      type: "upload",
    };
  },
});

// ✅ File Filter (only docs + images)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     "application/vnd.ms-powerpoint",
//     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//     "image/jpeg",
//     "image/png",
//     "image/jpg",
//   ];

  // const fileExt = file.originalname.split(".").pop().toLowerCase();
  // const allowedExtensions = ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png"];

  // if (
  //   allowedTypes.includes(file.mimetype) &&
  //   allowedExtensions.includes(fileExt)
  // ) {
  //   cb(null, true);
  // } else {
  //   cb(
  //     new Error("Only PDF, DOC, DOCX, PPT, PPTX and Images are allowed"),
  //     false
  //   );
  // }


// 🚀 Multer config
const upload = multer({
  storage,
  
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10,
  },
});

// ⚠️ Error handler
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 10MB",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Max 10 files allowed",
      });
    }
  }

  if (err.message) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next(err);
};

export { upload, handleUploadError };