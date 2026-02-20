import jwt from "jsonwebtoken";
import { env } from "../../../config/index.js";

export const generateToken = ({ payload = {}, signature = env.JWT_SECRET_KEY, expiresIn = "1d" } = {}) => {
  return jwt.sign(payload, signature, { 
    expiresIn,
    issuer: "sara7a-app" 
  });
};

