import User from "../models/user.js"

export const createUser=async(userData)=>{
    try {
        const user=await User(userData)
        return await user.save()
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`)
    }
}

export const updateUser=async(id,updatedData)=>{
    try {
        return await User.findByIdAndUpdate(id,updatedData,{
            new:true,
            runValidators:true,
        }).select("-password");
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`)
    }
}

export const getUserById=async (id)=>{
   return await User.findById(id).select("-password -resetPasswordToken -resetPasswordExpire")
}

export const deleteUser=async (id)=>{
    const user=await User.findById(id);

    if(!user){
        throw new Error("User not found")
    }
    return await user.deleteOne();
}

export const getallUsers=async()=>{
    const query={role:{$ne:"Admin"}}; //exclude admins

   const users= (await User.find(query).select("-password -resetPasswordToken -resetPasswordExpire").sort({createdAt:-1}))

   return users;

}

export const assignSuppervisorDirectly=async(studentId,supervisorId)=>{
   const student=await User.findOne({_id:studentId,role:"Student"})
   const supervisor=await User.findOne({_id:supervisorId,role:"Teacher"})
   if(!student||!supervisor){
    throw new Error("Student or supervisor not found")
   }

    if(!supervisor.hasCapacity()){
    throw new Error("Student or supervisor not found")
   }

   student.supervisor=supervisorId;
   supervisor.assignedStudents.push(studentId);
   await Promise.all([student.save(),supervisor.save()]);
   return {student,supervisor};

}
