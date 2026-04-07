import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URL, {
       dbName: "project-management-system"  
    } ).then(() => {
        console.log("Database connected successfully");
    }   
    ).catch((err) => {  

        console.log("Database connection failed", err);
    }   
    );
}

