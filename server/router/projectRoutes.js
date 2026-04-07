import express from "express"
import {downloadFile} from "../controller/projectController.js"
import {isAuthenticated,isAuthorized} from "../middleware/authMiddleWare.js"

const router= express.Router();

router.get("/:projectId/files/:fileId/download",isAuthenticated,downloadFile);

export default router;