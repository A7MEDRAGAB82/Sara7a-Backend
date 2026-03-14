import nodemailer from "nodemailer";
import { env } from "../../../config/index.js";

export const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.emailUser,
            pass: env.emailPassword,
        },
    });

    const info = await transporter.sendMail({
        from: `"Sara7a App" <${env.emailUser}>`, 
        to, 
        subject, 
        html, 
    });

    return info;
};