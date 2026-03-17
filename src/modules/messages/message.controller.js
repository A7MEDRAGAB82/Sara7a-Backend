import { Router } from "express";
import {
  getUserMessages,
  getMessageById,
  deleteMessage,
} from "./message.service.js";
import { SuccessResponse } from "../../common/utils/response/index.js";
import {
  verifyToken,
  asyncWrapper,
  allowedTo,
} from "../../middlewares/index.js";

const router = Router();

router.get(
  "/get-all-messages",
  verifyToken,
  allowedTo("Admin", "User"),
  asyncWrapper(async (req, res) => {
    const messages = await getUserMessages(req.user.id);
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
  "delete-message/:id",
  verifyToken,
  allowedTo("Admin", "User"),
  asyncWrapper(async (req, res) => {
    await deleteMessage(req.params.id, req.user.id);
    return SuccessResponse({
      res,
      message: "Message deleted successfully",
    });
  }),
);

export default router;
