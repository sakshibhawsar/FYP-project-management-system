import {SupervisorRequest} from "../models/supervisorRequest.js"

export const createRequest=async(requestData)=>{
    const existingRequest=await SupervisorRequest.findOne({
        student:requestData.student,
        supervisor:requestData.supervisor,
        status:"pending",
    })
    if(existingRequest){
        throw new Error("You have already sent a request to this supervisor. Please wait for their response.");
    }
    const request=await SupervisorRequest.create(requestData);
    return await request.save();
}

export const getAllRequests=async(filters)=>{
const requests=await SupervisorRequest.find(filters).populate("student","name email").populate("supervisor","name email").sort({createdAt:-1})
const total=await SupervisorRequest.countDocuments(filters)
return {requests,total}
}

export const acceptRequest=async(requestId,supervisorId)=>{
    const request=await SupervisorRequest.findById(requestId).populate("student","name email supervisor project").populate("supervisor","name email assignedStudents maxStudents")
    if(!request) throw new Error("Request not found");

    if(request.supervisor._id.toString()!==supervisorId.toString()){
         throw new Error("Not authorized to accept this request");
    }

    if(request.status!=="pending"){
         throw new Error("Request has already been precessed");
    }

    request.status="accepted"
    await request.save();
    return request

}

export const rejectRequest=async(requestId,supervisorId)=>{
     const request=await SupervisorRequest.findById(requestId).populate("student","name email").populate("supervisor","name email")
    if(!request) throw new Error("Request not found");

    if(request.supervisor._id.toString()!==supervisorId.toString()){
         throw new Error("Not authorized to reject this request");
    }

    if(request.status!=="pending"){
         throw new Error("Request has already been precessed");
    }

     request.status="rejected"
    await request.save();
    return request;


}