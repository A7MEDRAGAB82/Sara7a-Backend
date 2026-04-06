import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

const mongoURL = process.env.DATABASE_URI;
const mood = process.env.MOOD;
const port = process.env.PORT;
const saltRounds = process.env.SALT;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const ENC_KEY = process.env.ENC_KEY || "defaultKey";
const emailUser = process.env.EMAIL_USER
const emailPassword = process.env.EMAIL_PASS
const BASE_URL = process.env.BASE_URL || "http://localhost:3000"


export const env = {
  port,
  mongoURL,
  mood,
  saltRounds,
  JWT_SECRET_KEY,
  ENC_KEY,
  emailUser,
  emailPassword,
  BASE_URL
};
