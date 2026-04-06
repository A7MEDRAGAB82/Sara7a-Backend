import { userModel } from "../../database/models/user.model.js";
import { findOne } from "../../database/database.service.js";
import { NotFoundException } from "../../common/utils/response/index.js";
import { env } from "../../../config/index.js";

export const getUserProfile = async (userId) => {
  const user = await findOne({
    model: userModel,
    filter: { _id: userId },
    select: "firstName lastName profileImage bio",
  });

  if (!user) {
    throw NotFoundException({ message: `User with ID "${userId}" not found` });
  }

  return {
    userName: user.userName,
    profileImage: user.profileImage,
    bio: user.bio,
    
  };
};

export const shareProfileLink = async (shareProfileName) => {
  const user = await findOne({
    model:userModel,
    filter:{shareProfileName:shareProfileName},
    select:"firstName lastName profileImage bio"
  })
  if(!user){
    throw NotFoundException({message:`user with username "${shareProfileName}" not found `})
  }
  else {
    const profileURL = `${env.BASE_URL}/profile/${shareProfileName}`
    return profileURL
  }
}

export const getUserData = async (fullLink) => {
  if (!fullLink) throw new Error("Profile link is required");

  const parts = fullLink.split("/").filter(Boolean);
  const shareProfileName = parts[parts.length - 1]; 

  const user = await findOne({
    model: userModel,
    filter: { shareProfileName: shareProfileName },
    select: "firstName lastName profileImage bio -_id"
  });

  if (!user) {
    throw NotFoundException({ message: `User with name "${shareProfileName}" not found` });
  }

  return user;
};