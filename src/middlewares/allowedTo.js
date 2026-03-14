// src/middlewares/allowedTo.js
import { UnauthorizedException } from "../common/utils/response/index.js";

export const allowedTo = (...targetAudiences) => {
  return (req, res, next) => {
    if (!targetAudiences.includes(req.user.aud)) {
      return UnauthorizedException({ 
        res, 
        message: `Access denied! This route is for ${targetAudiences.join(" or ")} only.` 
      });
    }
    next();
  };
};