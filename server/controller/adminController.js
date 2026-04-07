import { asyncHandler } from "../middleware/asyncHandler.js";
import ErrorHandler from "../middleware/error.js";
import * as userServices from "../services/userServices.js"
import * as projectServices from "../services/projectServices.js"
import * as notificationService from "../services/notificationService.js"
import User from "../models/user.js"
import {Project} from "../models/project.js"
import {SupervisorRequest} from "../models/supervisorRequest.js"

export const createStudent=asyncHandler(async(req,res,next)=>{
    const {name,email,password,department}=req.body;
    if(!name||!email||!password||!department){
        return next(new ErrorHandler("Please provide all required fields",400))
    }
    const user =await userServices.createUser({name,email,password,department,role:"Student"})

    res.status(201).json({
        success:true,
        message:"Student created successfully",
        data:{user}
    })
})

export const updateStudent=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const updateData={...req.body};
    delete updateData.role; //prevent role update 

    const user=await userServices.updateUser(id,updateData);
    if(!user){
        return next(new ErrorHandler("Student not found",404))
    }
    res.status(200).json({
        success:true,
        message:"Student updated successfully",
        data:{user},
    })
})

export const deleteStudent=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const user=await userServices.getUserById(id);
    if(!user){
        return next(new ErrorHandler("Student not found",404))

    }
     if(user.role!=="Student"){
        return next(new ErrorHandler("User is not a student",400))
    }
    await userServices.deleteUser(id);
       res.status(200).json({
        success:true,
        message:"Student deleted successfully",
    })
})

//teacher
export const createTeacher=asyncHandler(async(req,res,next)=>{
    const {name,email,password,department,experties,maxStudents}=req.body;
    if(!name||!email||!password||!department||!maxStudents||!experties){
        return next(new ErrorHandler("Please provide all required fields",400))
    }
    const user =await userServices.createUser({name,email,password,department,maxStudents,
        experties:Array.isArray(experties)
        ?experties
        :typeof experties==="string"&&experties.trim()!==""
        ?experties.split(",").map(s=>s.trim())
        :[]
        ,role:"Teacher"})

    res.status(201).json({
        success:true,
        message:"Teacher created successfully",
        data:{user}
    })
})

export const updateTeacher=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const updateData={...req.body};
    delete updateData.role; //prevent role update 

    const user=await userServices.updateUser(id,updateData);
    if(!user){
        return next(new ErrorHandler("Teacher not found",404))
    }
    res.status(200).json({
        success:true,
        message:"Teacher updated successfully",
        data:{user},
    })
})

export const deleteTeacher=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const user=await userServices.getUserById(id);
    if(!user){
        return next(new ErrorHandler("Teacher not found",404))

    }
     if(user.role!=="Teacher"){
        return next(new ErrorHandler("User is not a teacher",400))
    }
    await userServices.deleteUser(id);
       res.status(200).json({
        success:true,
        message:"Teacher deleted successfully",
    })
})

export const getallUsers=asyncHandler(async(req,res,next)=>{
    const users=await userServices.getallUsers();
    res.status(200).json({
        success:true,
        message:"Users fetched successfully",
        data:{users},
    })
})

export const getAllProject=asyncHandler(async(req,res,next)=>{
    const projects=await projectServices.getAllProjects();
    res.json({
        success:true,
        message:"Projects fetched successfully",
        data:{projects},
    })
})

export const getDashboardStats=asyncHandler(async(req,res,next)=>{
   const [totalStudents,totalTeachers,totalProjects,pendingRequests,completeProjects,pendingProjects]=await Promise.all([
    User.countDocuments({role:"Student"}),
    User.countDocuments({role:"Teacher"}),
    Project.countDocuments(),
    SupervisorRequest.countDocuments({status:"pending"}),
    Project.countDocuments({status:"completed"}),
    Project.countDocuments({status:"pending"}),
   ]);

   res.status(200).json({
    success:true,
    message:"Admin Dashboard stats fetched",
    data:{
        totalStudents,totalTeachers,totalProjects,pendingRequests,completeProjects,pendingProjects
    }
   })
   
   
})


export const assignSupervisor=asyncHandler(async(req,res,next)=>{
    const {studentId,supervisorId}=req.body;

    if(!studentId||!supervisorId){
        return next(new ErrorHandler("Student ID and supdervisor ID are required",400))
    };

    const project=await Project.findOne({student:studentId})
    
    if(!project){
        return next(new ErrorHandler("Project not found",404))
    }
    if(project.supervisor!==null){
        return next(new ErrorHandler("Supervisor already assigned",400))
    }
 
    if(project.status!=="approved"){
        return next(new ErrorHandler("Project not approved yet",400))
    }else if(project.status==="pending"||project.status==="rejected"){
        return next(new ErrorHandler("Project is in pending state or rejected",400))
    }

    const {student,supervisor}=await userServices.assignSuppervisorDirectly(studentId,supervisorId)

    project.supervisor=supervisor;
    await project.save();

    await notificationService.notifyUser(studentId,`You have been assigned a supervisor ${supervisor.name}`,"approval","/students/status","low")

    await notificationService.notifyUser(supervisorId,`The student ${student.name} has been ofiicially assigned to you for FYP supervision.`,"general","/teachers/status","low")

    res.status(200).json({
        success:true,
        message:"Supervisor assigned successfully",
        data:{student,supervisor}
    })

})

export const getProject=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const project=await projectServices.getProjectById(id);
    if(!project){
        return next(new ErrorHandler("Project not found",403))
    }

const user=req.user;    
    const userRole=(user.role||"").toLowerCase();
    const userId=user._id?.toString()||user.id;
    const hasAccess=userRole==="admin"||project.student._id.toString()===userId||(project.supervisor&&project.supervisor._id.toString()===userId)
    
    if(!hasAccess){
        return next(new ErrorHandler("Not authorized to fetch this project",403))
    }

    res.status(200).json({
        success:true,
        data:{project}
    })
})

export const updateProjectStatus=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const updateData=req.body;
    const user=req.user;

    const project=await projectServices.getProjectById(id);
    if(!project){
        return next(new ErrorHandler("Project not found",404))
    }

 const userRole=(user.role||"").toLowerCase();
    const userId=user._id?.toString()||user.id;
    const hasAccess=userRole==="admin"||project.student._id.toString()===userId||(project.supervisor&&project.supervisor._id.toString()===userId)
    
    if(!hasAccess){
        return next(new ErrorHandler("Not authorized to update this project status",403))

    }

    const updatedProject=await projectServices.updateProject(id,updateData);

    res.status(200).json({
        success:true,
        message:"Project status updated successfully",
        data:{project:updatedProject}
    })

})