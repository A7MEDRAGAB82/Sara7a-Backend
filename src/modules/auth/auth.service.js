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
import { generateToken , generateRandomToken } from "../../common/security/token.security.js";

const createSession = async (user) => {
  const audience = user.role === "0" ? "Admin" : "User";
  const accessToken = generateToken({
    payload: { id: user._id },
    expiresIn: "30m",
    audience: audience,
  });

  const refreshToken = generateRandomToken();
  
  await redisClient.set(`refreshToken:${refreshToken}`, user._id.toString(), {
    EX: 30 * 24 * 60 * 60 
  });

  return { accessToken, refreshToken };
};

export const signUp = async (data) => {
  const { 
    userName, 
    email, 
    password, 
    phone, 
    gender, 
    DOB, 
    profilePic,
    shareProfileName 
  } = data;

  const existUser = await findOne({ 
    model: userModel, 
    filter: { email } 
  });

  if (existUser) {
    throw ConflictException({ message: "Email already exists" });
  }

  const addedUser = await insertOne({
    model: userModel,
    data: {
      userName, 
      email,
      password,
      phone,
      gender,
      DOB,
      profilePic, 
      shareProfileName,
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
  if (!existUser) {
    NotFoundException({ message: "invalid email or password" });
  }

  const isMatched = await existUser.comparePassword(password);
  if (!isMatched) NotFoundException({ message: "invalid email or password" });

  const tokens = await createSession(existUser);
  return { user: existUser, ...tokens };
};

export const logout = async (refreshToken) => {
  return await redisClient.del(`refreshToken:${refreshToken}`);
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

export const refreshTokens = async (token) => {
  const userId = await redisClient.get(`refreshToken:${token}`);
  if (!userId) {
    UnauthorizedException("refresh token is expired or not valid")
  }

  await redisClient.del(`refreshToken:${token}`);

  const user = await findById({ model: userModel, id: userId });
  if (!user) NotFoundException("user not found");

  return await createSession(user);
};



