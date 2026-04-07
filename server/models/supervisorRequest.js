import mongoose from "mongoose";

const supervisorRequestSchema=new mongoose.Schema({
   student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[ true,'Student ID is required'],
    },
     supervisor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[ true,'Supervisor ID is required'],
    },
    message:{
        type:String,
        required:[ true,'Message is required'],
        trim:true,
        maxlength:[250,'Message cannot be more than 250 characters'],
    },
    status:{
        type:String,
        default:'pending',
        enum:['pending','accepted','rejected'],
    },
},{timestamps:true});

//indexing for better query performance
supervisorRequestSchema.index({student:1});
supervisorRequestSchema.index({supervisor:1});
supervisorRequestSchema.index({status:1});



export const SupervisorRequest=mongoose.models.SupervisorRequest || mongoose.model('SupervisorRequest',supervisorRequestSchema);
export default SupervisorRequest;