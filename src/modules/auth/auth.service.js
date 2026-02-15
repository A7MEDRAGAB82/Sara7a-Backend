import { ProviderEnums } from "../../common/index.js";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/response/index.js";
import { userModel } from "../../database/index.js";
import { findOne, insertOne ,findById, findOneAndUpdate} from "../../database/database.service.js";
import jwt from "jsonwebtoken"
import { env } from "../../../config/env.service.js";

export const signUp = async (data) => {
  let { userName, email, password  , phone ,gender , DOB } = data;
  let existUser = await findOne({model:userModel ,filter:{email}})
  if (existUser) {
     ConflictException({message:"email already exist"});
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
          provider: ProviderEnums.System 
      }
  });
  return addedUser;
};

export const login = async (data) => {
  let { email, password } = data;
  let existUser = await findOne({model:userModel , filter:{email , provider:ProviderEnums.System}})
  if (existUser) {
    const isMatched = await existUser.comparePassword(password)
    if(isMatched){
      let token = jwt.sign({id:existUser._id} , env.JWT_SECRET_KEY , {expiresIn:"1d"})
      return {user:existUser,token}
    }
  }
   NotFoundException({ message: "invalid email or password" });
};

export const getUserById = async (userId) =>{
 

   const  userData = await findById({model:userModel , id:userId}) 
   if(!userData){
     NotFoundException({message:"user not found"})
   }
   return userData
}

export const updateLoginData = async (id , data) =>{
  let {userName , phone, gender, DOB} = data
  const existUser = await findById({model:userModel , id})
  if(!existUser){
     NotFoundException({message:"user not found"})
  }
   
   
if (userName) existUser.userName = userName;
if (phone) existUser.phone = phone;
if (gender) existUser.gender = gender;
if (DOB) existUser.DOB = DOB;

  await existUser.save()


return existUser
  
}
