import express from 'express'
import { env } from "../config/index.js"
import cors from 'cors'
import { databaseConnection } from './database/index.js'
import { globalErrorHandler } from './common/utils/response/index.js'
import authRouter from "./modules/auth/auth.controller.js"
import messageRouter from "./modules/messages/message.controller.js"
import userRouter from "./modules/user/user.controller.js"
import { connectRedis } from "./database/index.js"
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'



export const bootStrap = async () => {
    const app = express()
    app.use(express.json())
    app.use(helmet())
    app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
	limit: 100, 
	message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: 'draft-7', 
	legacyHeaders: false, 
}));
    app.use("/uploads", express.static("uploads"))
    await databaseConnection()
    await connectRedis()
    app.use('/auth', authRouter)
    app.use('/message', messageRouter)
    app.use('/user', userRouter)
    app.use('{*dummy}', (req, res) => res.status(404).json('invalid route'))
    app.use(globalErrorHandler)
    app.listen(env.port, () => {
        console.log(`server is running on port ${env.port}`);
    })
}