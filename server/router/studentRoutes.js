import express from "express";
import  {isAuthenticated, isAuthorized}  from "../middleware/authMiddleWare.js";
import {
  downloadFile,
  getAvailableSupervisors,
  getDashboardStats,
  getFeedback,
  getStudentProject,
  getSupervisor,
  requestSupervisor,
  submitProjectLinks,
  submitProposal,
  updateStudentProfile,
  uploadFiles,
} from "../controller/studentController.js"
import { handleUploadError, upload } from "../middleware/upload.js";


const router = express.Router();

router.get("/project",isAuthenticated, isAuthorized("Student"), getStudentProject);
console.log(getStudentProject);

router.post("/project-proposal",isAuthenticated, isAuthorized("Student"), submitProposal);
router.put("/submit-links/:projectId", isAuthenticated,isAuthorized("Student"), submitProjectLinks);
router.post("/upload/:projectId",isAuthenticated, isAuthorized("Student") ,upload.array("files",10),handleUploadError, uploadFiles);
router.get("/fetch-supervisors",isAuthenticated, isAuthorized("Student"), getAvailableSupervisors);
router.put("/update-profile",isAuthenticated, isAuthorized("Student"), updateStudentProfile);
router.get("/supervisor",isAuthenticated, isAuthorized("Student"), getSupervisor);
router.post("/request-supervisor",isAuthenticated, isAuthorized("Student"), requestSupervisor);
router.get("/feedback/:projectId",isAuthenticated, isAuthorized("Student"), getFeedback);
router.get("/fetch-dashboard-stats",isAuthenticated, isAuthorized("Student"), getDashboardStats);
router.get("/download/:projectId/:fileId",isAuthenticated, isAuthorized("Student"), downloadFile);

export default router;
