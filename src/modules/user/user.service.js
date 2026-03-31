import { userModel } from "../../database/models/user.model.js";
import { findOne } from "../../database/database.service.js";
import { NotFoundException } from "../../common/utils/response/index.js";

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
