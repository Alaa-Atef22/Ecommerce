
import nodemailer from "nodemailer"


export const sendEmail = async (to, subject, html, attachments = []) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.emailSender,
            pass: process.env.passwordEmail,
        },tls: {
            rejectUnauthorized: false
        }
    });
    const info = await transporter.sendMail({
        from: `"alaa" <${process.env.emailSender}>`,
        to: to ? to : "alaa.atef2235@gmail.com",
        subject: subject ? subject : "Hello ✔",
        html: html ? html : "Hello world?",
        attachments
    });
    if (info.accepted.length) {
        return true
    }
    return false
}