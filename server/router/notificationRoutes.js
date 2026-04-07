import express from "express";
import { deleteNotification,markAllAsRead,markAsRead,getNotifications} from "../controller/notificationController.js";
import { isAuthenticated } from "../middleware/authMiddleWare.js";

const router=express.Router();

router.get("/",isAuthenticated,getNotifications)
router.put("/:id/read",isAuthenticated,markAsRead)
router.delete("/:id/delete",isAuthenticated,deleteNotification)
router.put("/read-all",isAuthenticated,markAllAsRead)

export default router;