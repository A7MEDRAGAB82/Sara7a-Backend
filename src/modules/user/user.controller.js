import { Router } from "express";
import { getUserProfile , shareProfileLink } from "./user.service.js";
import { SuccessResponse } from "../../common/utils/response/index.js";
import { asyncWrapper, verifyToken } from "../../middlewares/index.js";

const router = Router();

router.get("/get-user-profile" , verifyToken , asyncWrapper(async(req , res)=>{
    const profile = await getUserProfile(req.user.id)

    return SuccessResponse({
        res,
        message: "User profile fetched successfully",
        data: profile
    })
}))

router.get("/get-url-profile/:shareProfileName" ,  asyncWrapper(async(req , res)=>{
     const {shareProfileName} = req.params
     const profileURL = await shareProfileLink(shareProfileName)

     return SuccessResponse({
        res,
        message: "User profile URL fetched successfully",
        data: profileURL
     })
}))

export default router;
