import Joi from "joi";

export const sendMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).max(5000).optional().messages({
    "string.empty": "Message content cannot be empty",
    "string.max": "Message is too long (max 5000 characters)",
  }),
  receiverId: Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid receiver ID format",
    }),
});

export const messageIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid message ID format",
    }),
});

export const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
