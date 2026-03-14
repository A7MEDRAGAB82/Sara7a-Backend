import { BadRequestException } from "../common/utils/response/index.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      return BadRequestException({
        message: `Validation Error: ${messages}`,
      });
    }

    req.body = value;
    next();
  };
};
