import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        maxLength:[50,'Name cannot exceed 50 characters'],
        trim:true,
    },
     email:{
        type:String,
        required:[true,'Email is required'],
        maxLength:[50,'Email cannot exceed 50 characters'],
        unique:true,
          lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please enter a valid email address'],
    },
     password:{
        type:String,
        required:[true,'Password is required'],
        maxLength:[8,'Password must be at least 8 characters'],
        select:false,
    },
    role:{
        type:String,
        default:'Student',
        enum:['Student','Teacher','Admin'],
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

    department:{
        type:String,
       trim:true,
       default:null,
    },
    experties:{
        type:[String],
         default:[],
    },
     maxStudents:{
        type:Number,
         default:10,
         min:[1,'Max students must be at least 1'],
    },
     assignedStudents:[
{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
}
     ],
supervisor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    default:null,
},
project:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Project',
    default:null,
}
},{
    timestamps:true,
});

userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return ;
    }
    this.password=await bcrypt.hash(this.password,10);
    
})

userSchema.methods.generateToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
}
)
}

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.hasCapacity= function(){
    if(this.role!=="Teacher")return false;
    return this.assignedStudents.length<this.maxStudents;
}

userSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+15*60*1000;
    return resetToken;
};

const User=mongoose.model("User",userSchema);
    
export default User;