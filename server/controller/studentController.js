import { asyncHandler } from "../middleware/asyncHandler.js";
import ErrorHandler from "../middleware/error.js";
import * as userServices from "../services/userServices.js"
import * as projectServices from "../services/projectServices.js"
import * as requestService from "../services/requestService.js"
import * as notificationService from "../services/notificationService.js"
import * as fileServices from "../services/fileServices.js"
import User from "../models/user.js";
import Project from "../models/project.js";
import Notification from "../models/notification.js";

export const getStudentProject=asyncHandler(async(req,res,next)=>{
    const studentId=req.user._id;
    const project=await projectServices.getProjectByStudent(studentId)
   
    if(!project){
        return res.status(200).json({
            success:true,
            data:{project:null},
            message:"No project found for the student",
    })
    }
    res.status(200).json({
        success:true,
        data:{project},
    })
});

export const submitProposal=asyncHandler(async(req,res,next)=>{
    const {title,description}=req.body;
    const studentId=req.user._id;

    const existingProject=await projectServices.getProjectByStudent(studentId);

    if(existingProject && existingProject.status!=="rejected"){
        return next(new ErrorHandler("You already have an active project. You can only submit a new proposal if the previous project is rejected",400))
    }

  if (existingProject && existingProject.status === "rejected") {
  await Project.findByIdAndDelete(existingProject._id);
}

    const prejectData={
        student:studentId,
        title,
        description,
    }
    const project=await projectServices.createProject(prejectData);

    await User.findByIdAndUpdate(studentId,{project:project._id});

    res.status(201).json({
        success:true,
        message:"Project proposal submitted successfully",
        data:{project},
    })
});

export const uploadFiles=asyncHandler(async(req,res,next)=>{
const {projectId}=req.params;
const studentId=req.user._id;
const project=await projectServices.getProjectById(projectId);

if(!project||project.student._id.toString()!==studentId.toString()||project.status==="rejected"){
    return next(new ErrorHandler("Not authorized to upload files to this project",403))
}

if(!req.files||req.files.length===0){
    return next(new ErrorHandler("No files uploaded",400))
}

const updatedProject=await projectServices.addFilesToProject(projectId,req.files);

res.status(200).json({
    success:true,
    message:"Files uploaded successfully",
    data:{project:updatedProject},
})
});

export const getAvailableSupervisors=asyncHandler(async(req,res,next)=>{
    const supervisors=await User.find({role:"Teacher"}).select("name email department experties").lean();
    res.status(200).json({
        success:true,
        message:"Available supervisors fetched successfully",
        data:{supervisors},
    })
})

export const getSupervisor=asyncHandler(async(req,res,next)=>{
const studentId=req.user._id;
const student=await User.findById(studentId).populate("supervisor","name email department experties");

if(!student.supervisor){
    return res.status(200).json({
        success:true,
        data:{supervisor:null},
        message:"No supervisor assigned to this student",
    })
}

res.status(200).json({
    success:true,
    data:{supervisor:student.supervisor},
})
})

export const requestSupervisor=asyncHandler(async(req,res,next)=>{
    const {teacherId,message}=req.body;
    const studentId=req.user._id;

    const student=await User.findById(studentId);
    if(student.supervisor){
        return next(new ErrorHandler("You already have a supervisor assigned.",400))
    }

    const supervisor=await User.findById(teacherId);
    if(!supervisor||supervisor.role!=="Teacher"){
        return next(new ErrorHandler("Invalid supervisor ID",400))
    }

   if(supervisor.maxStudents===supervisor.assignedStudents.length){
    return next(new ErrorHandler("This supervisor has reached the maximum number of students they can supervise",400))
   }

    const requestData={
        student:studentId,
        supervisor:teacherId,
        message,
    }


    const request=await requestService.createRequest(requestData);
 await notificationService.notifyUser(
    teacherId,
    `${student.name} has request ${supervisor.name} to be their supervisor.`,
    "request",
    "/teacher/requests",
    "medium"
 )
    res.status(201).json({
        success:true,
        message:"Supervisor request sent successfully",
        data:{request},
    })


})

export const getDashboardStats=asyncHandler(async(req,res,next)=>{
const studentId=req.user._id;
const project=await Project.findOne({student:studentId}).sort({createdAt:-1}).populate("supervisor","name").lean();

const now =new Date();
const upcomingDeadline=await Project.find({student:studentId,
    deadline:{$gte:now},
}).select("title description deadline").sort({deadline:1}).limit(3).lean();

const topNotifications=await Notification.find({user:studentId})
.populate("user","name")
.sort({createdAt:-1})
.limit(3)
.lean();

const feedbackNotifications=project?.feedback && project?.feedback.length>0?project.feedback
.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,2):[]

const supervisorName=project?.supervisor?.name||null;

res.status(200).json({
success:true,
message:"Dashboard stats fetched successfully",
data:{
    project,
    upcomingDeadline,
    topNotifications,
    feedbackNotifications,
    supervisorName,
}
})


})

export const getFeedback=asyncHandler(async(req,res,next)=>{
const {projectId}=req.params;
const studentId=req.user._id

const project=await projectServices.getProjectById(projectId);

if(!project ||project.student._id.toString()!==studentId.toString()){
    return next(new ErrorHandler("Not authorized to view feedback for the project",403))
}
const sortedFeedback=project.feedback.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map((f)=>(
    {
    _id:f._id,
    title:f.title,
    message:f.message,
    type:f.type,
    createdAt:f.createdAt,
    supervisorName:f.supervisorId?.name,
    supervisoremail:f.supervisorId?.email,
}
));

res.status(200).json({
    success:true,
    data:{feedback:sortedFeedback}
})
})
export const downloadFile = asyncHandler(async (req, res, next) => {
  const { projectId, fileId } = req.params;
  const studentId = req.user._id;

  const project = await projectServices.getProjectById(projectId);

  if (!project) return next(new ErrorHandler("Project not found", 404));

  if (project.student._id.toString() !== studentId.toString()) {
    return next(new ErrorHandler("Not authorized", 403));
  }

  const file = project.files.find(
    (f) => f._id.toString() === fileId
  );

  if (!file) return next(new ErrorHandler("File not found", 404));

  const downloadUrl = file.fileUrl.replace(
    "/upload/",
    "/upload/fl_attachment/"
  );

  return res.status(200).json({
    success: true,
    url: downloadUrl,
  });
});