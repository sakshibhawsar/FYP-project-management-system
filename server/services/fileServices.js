import fs from "fs"
import ErrorHandler from "../middleware/error.js"

export const streamDownload=(filePath,res,originalName)=>{
    try {
        if(!fs.existsSync(filePath)){
            throw new ErrorHandler("File not found",404)
        }
        res.download(filePath,originalName,(err)=>{
            if(err){
                throw new ErrorHandler("Error downloading file",500)
            }
        })
    } catch (error) {
        if(error instanceof ErrorHandler){
            return res.status(err.statusCode).json({
                success:false,
                error:error.message
            })
        }
        return res.status(500).json({
            success:false,
            error:"Error streaming file"
        })
    }
}

