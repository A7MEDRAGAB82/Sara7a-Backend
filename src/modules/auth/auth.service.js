import { ProviderEnums } from "../../common/index.js";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/response/index.js";
import { userModel } from "../../database/index.js";
import {
  findOne,
  insertOne,
  findById,
  findByIdAndDelete,
  redisClient,
} from "../../database/index.js";
import jwt from "jsonwebtoken";
import { env } from "../../../config/index.js";
import {
  sendEmail,
  generateHash,
  compareHash,
  validateExists,
  generateAndSendOTP,
} from "../../common/index.js";
import { generateToken } from "../../common/security/token.security.js";

export const signUp = async (data) => {
  let { userName, email, password, phone, gender, DOB } = data;
  let existUser = await findOne({ model: userModel, filter: { email } });
  if (existUser) {
    ConflictException({ message: "email already exist" });
  }
  let addedUser = await insertOne({
    model: userModel,
    data: {
      userName,
      email,
      password,
      phone,
      gender,
      DOB,
      provider: ProviderEnums.System,
    },
  });
  return addedUser;
};

export const login = async (data) => {
  let { email, password } = data;
  let existUser = await findOne({
    model: userModel,
    filter: { email, provider: ProviderEnums.System },
  });
  if (existUser) {
    const isMatched = await existUser.comparePassword(password);
    if (isMatched) {
      let token = generateToken({ payload: { id: existUser._id } });
      return { user: existUser, token };
    }
  }
  NotFoundException({ message: "invalid email or password" });
};

export const getUserById = async (userId) => {
  return await validateExists({
    model: userModel,
    filter: { _id: userId },
    message: "user not found",
  });
};

export const updateLoginData = async (id, data) => {
  let { userName, phone, gender, DOB } = data;
  const existUser = await validateExists({
    model: userModel,
    filter: { _id: id },
    message: "user not found",
  });

  Object.assign(existUser, data);

  await existUser.save();

  return existUser;
};

export const deleteUser = async (id) => {
  const deletedUser = await findByIdAndDelete({ model: userModel, id });
  if (!deletedUser) {
    NotFoundException({ message: "user not found" });
  }
  return deletedUser;
};

export const updatePassword = async (id, oldPassword, newPassword) => {
  const existUser = await validateExists({
    model: userModel,
    filter: { _id: id },
    message: "user not found",
  });

  const isMatched = await existUser.comparePassword(oldPassword);
  if (!isMatched) {
    UnauthorizedException({ message: "old password is incorrect" });
  }
  existUser.password = newPassword;
  await existUser.save();
  return existUser;
};

export const forgotPassword = async (email) => {
  const user = await validateExists({
    model: userModel,
    filter: { email: email },
    message: "user not found",
  });
  await generateAndSendOTP(email, "Reset your password - Sara7a App");
  return { message: "OTP sent to your email" };
};

export const resetPassword = async (email, otp, newPassword) => {
  const storedHashedOtp = await redisClient.get(`otp:${email}`);
  if (!storedHashedOtp) {
    UnauthorizedException({ message: "OTP has expired or not found" });
  }
  const isOtpMatch = await compareHash(otp, storedHashedOtp);
  if (!isOtpMatch) {
    UnauthorizedException({ message: "Invalid OTP" });
  }

  const user = await validateExists({
    model: userModel,
    filter: { email: email },
    message: "user not found",
  });

  user.password = newPassword;
  await user.save();
  await redisClient.del(`otp:${email}`);
  return { message: "Password has been reset successfully" };
};
