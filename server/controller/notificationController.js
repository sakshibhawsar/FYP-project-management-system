import {asyncHandler} from "../middleware/asyncHandler.js"
import ErrorHandler from "../middleware/error.js"
import {Notification} from "../models/notification.js"
import * as notificationService from "../services/notificationService.js"



export const getNotifications=asyncHandler(async(req,res,next)=>{
    const userId=req.user.id
    const role=req.user.role

    let query={};

    if(role=="Admin"){
        query.type={$in:["request"]};
    }else{
        query.user=userId;
    }

    const notifications=await Notification.find(query).sort({createdAt:-1})
    const unreadOnly=notifications.filter((n)=>!n.isRead)
    const readOnly=notifications.filter((n)=>n.isRead)
    const highPriorityMessages=notifications.filter((n)=>n.priority==="high");

    const now=new Date();
    const dayOfWeek=now.getDay();
    const startOfWeek=new Date(now)
    startOfWeek.setDate(now.getDate()-dayOfWeek);
    startOfWeek.setHours(0,0,0,0);

    const endOfWeek=new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate()+6);
    endOfWeek.setHours(23,59,59,999);

    const thisWeekNotifications=notifications.filter((n)=>{
        const created=new Date(n.createdAt);
        return created >= startOfWeek&&created <=endOfWeek
    })

    res.status(200).json({
        success:true,
        message:"Notifications fetch successfully",
        data:{
            notifications,
            unreadOnly:unreadOnly.length,
            readOnly:readOnly.length,
            highPriorityMessages:highPriorityMessages.length,
            thisWeekNotifications:thisWeekNotifications.length,
        }
    })
})

export const markAsRead=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const userId=req.user.id

    const notification=await notificationService.markAsRead(id,userId);

    if(!notification){
        return next(new ErrorHandler("Notification not found",404))
    }

    res.status(200).json({
        success:true,
        message:"Notification marked as read",
        data:{notification},
    })
})

export const markAllAsRead=asyncHandler(async(req,res,next)=>{
    const userId=req.user.id
    await notificationService.markAllAsRead(userId);
    res.status(200).json({
        success:true,
        message:"All Notification marked as read",
    })
})


export const deleteNotification=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const userId=req.user.id

    const notification=await notificationService.deleteNotification(id,userId);

    if(!notification){
        return next(new ErrorHandler("Notification not found",404))
    }

    res.status(200).json({
        success:true,
        message:"Notification deleted successfully",
    })
})