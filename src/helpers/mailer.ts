import nodemailer from "nodemailer"
import { v4 as uuidv4 } from 'uuid';
import User from "@/models/userSchema";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async ({ email, emailType, userId }: any) => {

    const otp = Math.floor(100000 + Math.random() * 900000);

    if (emailType === "VERIFY") {



        await User.findByIdAndUpdate(userId, {
            verifyToken: otp,
            verifyTokenExpiry: Date.now() + 1000 * 60 * 60,

        })

    }

    if (emailType === "RESET") {
        await User.findByIdAndUpdate(userId, {
            forgetPasswordToken: otp,
            forgetPasswordExpiry: Date.now() + 1000 * 60 * 60,

        })

    }

    try {        // Looking to send emails in production? Check out our Email API/SMTP product!


        const transport = nodemailer.createTransport({
            host: process.env.TRANSPORT_HOST,
            port: Number(process.env.TRANSPORT_PORT),
            auth: {
                user: process.env.TRANSPORT_USER,
                pass: process.env.TRANSPORT_PASS
            },
            secure: false // set to true if using port 465
        } as SMTPTransport.Options);


        (async () => {
            const info = await transport.sendMail({
                from: 'verify@crackIOE.com',
                to: email,
                subject: emailType === "VERIFY" ? "Verify Your Email" : "Reset Password",
                html: `Your Verification Code is ${otp}. Don't share it to anyone. -crackIOE Team`, // HTML body
            });

            console.log("Message sent:", info.messageId);
        })();





    } catch (error) {

        console.log("Message Sent Failed", error)
    }

}