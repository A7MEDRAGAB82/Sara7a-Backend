import { NotFoundException } from "../../common/utils/response/index.js";
import { messageModel } from "../../database/models/message.model.js";
import { findAll, findOne, findOneAndUpdate } from "../../database/index.js";

export const getUserMessages = async (userId) => {
  
  const messages = await findAll({
    model: messageModel,
    filter: { receiverId: userId, isDeleted: false },
    options: {
      populate: { path: "senderId", select: "userName profileImage" },
      lean:true
    },
  });
  return messages;
};

export const getMessageById = async (messageId, userId) => {
  const message = await findOne({
    model: messageModel,
    filter: { _id: messageId, receiverId: userId, isDeleted: false },
    options: {
      populate: { path: "senderId", select: "userName profileImage" },
      lean:true
    },
  });
  if (!message) {
   throw NotFoundException({
      message: "Message not found or you are not authorized to view it",
    });
  }
  return message;
};

export const deleteMessage = async (messageId, userId) => {
  const message = await findOneAndUpdate({
    model: messageModel,
    filter: { _id: messageId, receiverId: userId, isDeleted: false },
    update: { isDeleted: true },
  });
  if (!message) {
   throw NotFoundException({
      message: "Message not found or you are not authorized to delete it",
    });
  }
  return message;
};
