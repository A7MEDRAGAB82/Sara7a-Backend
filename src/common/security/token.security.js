import jwt from "jsonwebtoken";
import { env } from "../../../config/index.js";
import crypto from "crypto"

export const generateToken = ({ payload = {}, signature = env.JWT_SECRET_KEY, expiresIn = "30m" , audience = "User" } = {}) => {
  return jwt.sign(payload, signature, { 
    expiresIn,
    issuer: "sara7a-app",
    audience: audience
  });
};

export const generateRandomToken = () => {
  return crypto.randomBytes(40).toString('hex')
}

