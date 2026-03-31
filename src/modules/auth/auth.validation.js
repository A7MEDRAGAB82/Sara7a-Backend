import Joi from "joi";
import { GenderEnums } from "../../common/index.js";


export const signUpSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(), 
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[0-9]+$/), 
 gender: Joi.number().valid(...Object.values(GenderEnums)),
  DOB: Joi.date().less("now"),
  profilePic: Joi.string().optional(),
  shareProfileName: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.pattern.base': 'Share profile name can only contain letters, numbers, underscores, and hyphens'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateLoginDataSchema = Joi.object({
  userName: Joi.string().min(3).max(30), 
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]+$/),
  gender: Joi.number().valid(...Object.values(GenderEnums)),
  DOB: Joi.date().less("now")
}).or("userName", "email", "phone", "gender", "DOB"); 

export const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required(),
});

export const refreshTokenSchema = Joi.object({
  token: Joi.string().required(),
});

export const logoutSchema = Joi.object({
  token: Joi.string().required(),
});
