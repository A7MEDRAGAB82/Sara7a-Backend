import { redisClient } from "../../database/index.js";
import crypto from "crypto"
import { generateHash , sendEmail } from "../index.js";




export const generateAndSendOTP = async (email, subject = "Your OTP Code") => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await generateHash(otp);

    await redisClient.set(`otp:${email}`, hashedOtp, { EX: 600 });

    await sendEmail({
        to: email,
        subject,
        html: `<h2>Your OTP is: ${otp}</h2><p>Expires in 10 minutes.</p>`
    });

    return true;
};