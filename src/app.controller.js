import express from 'express'
import { env } from "../config/index.js"
import { databaseConnection } from './database/index.js'
import { globalErrorHandler } from './common/utils/response/index.js'
import authRouter from "./modules/auth/auth.controller.js"
import messageRouter from "./modules/messages/message.controller.js"
import userRouter from "./modules/user/user.controller.js"
import { connectRedis } from "./database/index.js"



export const bootStrap = async () => {
    const app = express()
    app.use(express.json())
    app.use("/upload", express.static("upload"))
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