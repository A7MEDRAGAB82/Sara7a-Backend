import { Router } from "express";
import { getUserProfile } from "./user.service.js";
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

export default router;
