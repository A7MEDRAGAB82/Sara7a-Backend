import crypto from "crypto";
import { env } from "../../../config/index.js";

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(env.ENC_KEY, "salt", 32); 
const ivSize = 16; 

export const encrypt = (text) => {
  if (!text) return text;

  const iv = crypto.randomBytes(ivSize);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (cipherText) => {
  if (!cipherText || !cipherText.includes(":")) return cipherText;

  const [ivHex, encryptedText] = cipherText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};