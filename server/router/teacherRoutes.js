import express from "express";
import  {isAuthenticated, isAuthorized}  from "../middleware/authMiddleWare.js";
import {
    getRequests,
 getTeacherDashboardStats,acceptRequest,rejectRequest,
 addFeedback,
 markComplete,
 getAssignedStudent,
 downloadFile,
 getFiles
} from "../controller/teacherController.js"
import { handleUploadError, upload } from "../middleware/upload.js";


const router = express.Router();

router.get("/fetch-dashboard-stats",isAuthenticated,isAuthorized("Teacher"),getTeacherDashboardStats)

router.get("/requests",isAuthenticated,isAuthorized("Teacher"),getRequests)
router.put("/requests/:requestId/accept",isAuthenticated,isAuthorized("Teacher"),acceptRequest)
router.put("/requests/:requestId/reject",isAuthenticated,isAuthorized("Teacher"),rejectRequest)
router.post("/feedback/:projectId",isAuthenticated,isAuthorized("Teacher"),addFeedback)
router.post("/mark-complete/:projectId",isAuthenticated,isAuthorized("Teacher"),markComplete)
router.get("/assigned-students",isAuthenticated,isAuthorized("Teacher"),getAssignedStudent)
router.get("/download/:projectId/:fileId",isAuthenticated, isAuthorized("Teacher"),downloadFile)
router.get("/files",isAuthenticated,isAuthorized("Teacher"),getFiles)
export default router;

