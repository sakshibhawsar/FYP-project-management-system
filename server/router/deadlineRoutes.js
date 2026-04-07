import express from "express";
import { createDeadline} from "../controller/deadlineController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleWare.js";

const router=express.Router();

router.post("/create-deadline/:id",isAuthenticated,isAuthorized("Admin"),createDeadline)

export default router;