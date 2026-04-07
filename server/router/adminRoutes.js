import express from "express";
import { assignSupervisor, createStudent, createTeacher, deleteStudent, deleteTeacher, getAllProject, getallUsers, getDashboardStats, getProject, updateProjectStatus, updateStudent, updateTeacher } from "../controller/adminController.js";
import multer  from "multer";
import { isAuthenticated,isAuthorized } from "../middleware/authMiddleWare.js";

const router=express.Router();

router.post("/create-student",
    isAuthenticated,
    isAuthorized("Admin"),
    createStudent
)
router.put("/update-student/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    updateStudent
)
router.delete("/delete-student/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    deleteStudent
)

//teacher
router.post("/create-teacher",
    isAuthenticated,
    isAuthorized("Admin"),
    createTeacher
)
router.put("/update-teacher/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    updateTeacher
)
router.delete("/delete-teacher/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    deleteTeacher
)

router.get("/projects",
    isAuthenticated,
    isAuthorized("Admin"),
    getAllProject
)

router.get("/fetch-dashboard-stats",
    isAuthenticated,
    isAuthorized("Admin"),
    getDashboardStats
)

//get all users
router.get("/users",
    isAuthenticated,
    isAuthorized("Admin"),
    getallUsers
)

router.post("/assign-supervisor",
    isAuthenticated,
    isAuthorized("Admin"),
    assignSupervisor
)

router.get("/project/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    getProject
)

router.put("/project/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    updateProjectStatus
)


export default router;