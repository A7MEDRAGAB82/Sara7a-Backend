import { Router } from "express";
import { getUserProfile , shareProfileLink  , getUserData} from "./user.service.js";
import { SuccessResponse } from "../../common/utils/response/index.js";
import { asyncWrapper, verifyToken } from "../../middlewares/index.js";

const router = Router();

router.get("/get-user-profile" , verifyToken , asyncWrapper(async(req , res)=>{

    const profile = await getUserProfile(req.user.id)

    return SuccessResponse({
        res,
        message: "User profile fetched successfully",
        statusCode:200,
        data: profile
    })
}))

router.get("/get-url-profile/:shareProfileName" ,  asyncWrapper(async(req , res)=>{
     const {shareProfileName} = req.params
     const profileURL = await shareProfileLink(shareProfileName)

     return SuccessResponse({
        res,
        message: "User profile URL fetched successfully",
        statusCode:200,
        data: profileURL
     })
}))

router.get("/get-user-data" , asyncWrapper(async(req ,res)=>{
   const data = await getUserData(req.body.shareProfileLink)
   return SuccessResponse({
    res,
    message: "User data fetched successfully",
    statusCode:200,
    data: data
   })
}))

export default router;
