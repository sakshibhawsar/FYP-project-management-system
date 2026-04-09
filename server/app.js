import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/error.js';
import authRouter from './router/userRoutes.js';
import adminRouter from './router/adminRoutes.js';
import studentRouter from './router/studentRoutes.js';
import notificationRouter from './router/notificationRoutes.js';
import projectRouter from './router/projectRoutes.js';
import deadlineRouter from './router/deadlineRoutes.js';
import teacherRouter from './router/teacherRoutes.js';



config();



const app = express();



app.use(cors(
    {
        origin:[process.env.FRONTEND_URL],
        methods:['GET','POST','PUT','DELETE'],
        credentials:true
    }
));




app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/student",studentRouter)
app.use("/api/v1/notification",notificationRouter)
app.use("/api/v1/project",projectRouter)
app.use("/api/v1/deadline",deadlineRouter)
app.use("/api/v1/teacher",teacherRouter)

app.use(errorMiddleware)


export default app;