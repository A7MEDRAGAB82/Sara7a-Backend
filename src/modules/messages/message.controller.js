import { Router } from "express";
import {
  createMessage,
  getUserMessages,
  getMessageById,
  deleteMessage,
} from "./message.service.js";
import { SuccessResponse } from "../../common/utils/response/index.js";
import {
  verifyToken,
  asyncWrapper,
  allowedTo,
  validateRequest,
  multer_local,
} from "../../middlewares/index.js";
import { sendMessageSchema, messageIdSchema, paginationQuerySchema } from "./message.validation.js";

const router = Router();

router.post(
  "/send-message",
  multer_local({ customPath: "messages" }).single("messageImage"),
  verifyToken,
  allowedTo("User"),
  validateRequest(sendMessageSchema, "body"),
  asyncWrapper(async (req, res) => {
    const attachment = req.file?.path || null;

    const message = await createMessage({
      ...req.body,
      attachment,
      user: req.user,
    });

    return SuccessResponse({
      res,
      status: 201,
      message: "Message sent successfully",
      data: message,
    });
  }),
);

router.get(
  "/get-all-messages",
  verifyToken,
  allowedTo("Admin", "User"),
  validateRequest(paginationQuerySchema , 'query'),
  asyncWrapper(async (req, res) => {
    const messages = await getUserMessages(req.user.id , req.query);
    return SuccessResponse({
      res,
      message: "Messages fetched successfully",
      data: messages,
    });
  }),
);

router.get(
  "/get-message/:id",
  verifyToken,
  allowedTo("Admin", "User"),
  validateRequest(messageIdSchema , 'params'),
  asyncWrapper(async (req, res) => {
    const message = await getMessageById(req.params.id, req.user.id);
    return SuccessResponse({
      res,
      message: "Message fetched successfully",
      data: message,
    });
  }),
);

router.delete(
  "/delete-message/:id",
  verifyToken,
  allowedTo("Admin", "User"),
  validateRequest(messageIdSchema , 'params'),
  asyncWrapper(async (req, res) => {
    await deleteMessage(req.params.id, req.user.id);
    return SuccessResponse({
      res,
      message: "Message deleted successfully",
    });
  }),
);

export default router;
