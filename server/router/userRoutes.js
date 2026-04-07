import express from "express";
import { registerUser,forgetPassword,login,getUser,logout,resetPassword } from "../controller/authController.js";
import multer  from "multer";
import { isAuthenticated } from "../middleware/authMiddleWare.js";

const router=express.Router();

router.post("/register",registerUser);
router.post("/login",login);
router.get("/me",isAuthenticated, getUser);
router.get("/logout", isAuthenticated, logout);
router.post("/password/forgot",forgetPassword);
router.put("/password/reset/:token",resetPassword);

export default router;