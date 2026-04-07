import mongoose from "mongoose";

const deadlineSchema=new mongoose.Schema({
    name:{
       type:String,
        required:[  true,'Deadline name/title is required'],
        trim:true,
        maxlength:[100,'Deadline name cannot be more than 100 characters'],
    },
    dueDate:{
         type:String,
         required:[ true,'Due date is required'],
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[ true,'Creator By is required'],
    },
     Project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        default:null,
    },
},{timestamps:true});

//indexing for better query performance
deadlineSchema.index({dueDate:1});
deadlineSchema.index({createdBy:1});
deadlineSchema.index({Project:1});


export const Deadline=mongoose.models.Deadline || mongoose.model('Deadline',deadlineSchema);
export default Deadline;