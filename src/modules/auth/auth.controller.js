import { Router } from "express";
import {
  signUp,
  login,
  getUserById,
  updateLoginData,
  deleteUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  refreshTokens,
  logout,
} from "./auth.service.js";
import {
  NotFoundException,
  SuccessResponse,
  BadRequestException,
} from "../../common/utils/response/index.js";
import {
  verifyToken,
  asyncWrapper,
  allowedTo,
  validateRequest,
} from "../../middlewares/index.js";
import {
  signUpSchema,
  loginSchema,
  updateLoginDataSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  logoutSchema,
} from "./auth.validation.js";
import multer from "multer";
import { multer_local } from "../../middlewares/multer.js";

const router = Router();




router.post(
  "/sign-up",
  multer_local({ customPath: "profileImages" }).single("profilePic"),
  
  validateRequest(signUpSchema),
  
  asyncWrapper(async (req, res) => {
    const finalData = {
      ...req.body,
      profilePic: req.file ? req.file.path : undefined 
    };

    let addedUser = await signUp(finalData);

    return SuccessResponse({
      res,
      message: "User added successfully",
      status: 201,
      data: addedUser,
    });
  }),
);

router.post(
  "/login",
  validateRequest(loginSchema),
  asyncWrapper(async (req, res) => {
    let loginUser = await login(req.body);
    return SuccessResponse({
      res,
      message: "user login successfully",
      status: 200,
      data: loginUser,
    });
  }),
);

router.get(
  "/get-user-by-id",
  verifyToken,
  allowedTo("Admin", "User"),
  asyncWrapper(async (req, res) => {
    let userData = await getUserById(req.user.id);
    return SuccessResponse({
      res,
      message: "User profile fetched successfully",
      data: userData,
    });
  }),
);

router.patch(
  "/update-login-data",
  verifyToken,
  allowedTo("Admin", "User"),
  validateRequest(updateLoginDataSchema),
  asyncWrapper(async (req, res) => {
    let updateUser = await updateLoginData(req.user.id, req.body);
    return SuccessResponse({
      res,
      message: "user data updated successfully",
      data: updateUser,
    });
  }),
);

router.delete(
  "/delete-user",
  verifyToken,
  allowedTo("Admin"),
  asyncWrapper(async (req, res) => {
    let deletedUser = await deleteUser(req.user.id);
    return SuccessResponse({
      res,
      message: "user deleted successfully",
    });
  }),
);

router.patch(
  "/update-password",
  verifyToken,
  allowedTo("Admin", "User"),
  validateRequest(updatePasswordSchema),
  asyncWrapper(async (req, res) => {
    let { oldPassword, newPassword } = req.body;
    let updatedUser = await updatePassword(
      req.user.id,
      oldPassword,
      newPassword,
    );
    return SuccessResponse({
      res,
      message: "password updated successfully",
      data: updatedUser,
    });
  }),
);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  asyncWrapper(async (req, res) => {
    const { email } = req.body;

    const result = await forgotPassword(email);

    return SuccessResponse({
      res,
      message: result.message,
      status: 200,
    });
  }),
);

router.patch(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  asyncWrapper(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const result = await resetPassword(email, otp, newPassword);

    return SuccessResponse({
      res,
      message: result.message,
      status: 200,
    });
  }),
);

router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema),
  asyncWrapper(async (req, res) => {
    const { token } = req.body;

    const result = await refreshTokens(token);

    return SuccessResponse({
      res,
      message: "Tokens refreshed successfully",
      status: 200,
      data: result,
    });
  }),
);

router.post(
  "/logout",
  validateRequest(logoutSchema),
  asyncWrapper(async (req, res) => {
    const { token } = req.body;

    await logout(token);

    return SuccessResponse({
      res,
      message: "Logged out successfully",
      status: 200,
    });
  }),
);

 

export default router;
