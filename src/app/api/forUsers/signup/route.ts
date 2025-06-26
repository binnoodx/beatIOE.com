import { dbConnect } from "@/dbConnect/dbConnect";
import bcrypt from "bcryptjs";
import User from "@/models/userSchema";
import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/helpers/mailer";
import Email from "next-auth/providers/email";


export async function POST(req: NextRequest) {
    await dbConnect()

    try {

        const reqBody = await req.json()

        const { userEmail, userPassword , userName }: any = reqBody

        const findUser = await User.findOne({ userEmail })

        if (findUser) {
            return NextResponse.json({
                error: "User Already Found",
            }, { status: 500 })
        }

        else {

            const checkUsername = await User.findOne({ userName })

            if(!checkUsername){

            

            const salt = bcrypt.genSaltSync(10); //IDK wTF is salt
            const hashedPassword = await bcrypt.hash(userPassword, salt)


            const newUser = new User({
                userName : userName,
                email: userEmail,
                password: hashedPassword,
                isVerified: false,
                createdAt: Date.now(),

            })
            const createdUser = await newUser.save()

            // Send Verification Email
               await sendEmail({
                email:userEmail,
                emailType:"VERIFY",
                userId:newUser._id

               })

               


            return NextResponse.json({
                message: "User Registered Successfully",
                success: true,
                status:200,
                id: createdUser._id
            })

        }
        else{

            return NextResponse.json({
            message:"Username already Taken",
            status:500
        })

        }
    }

    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            status:500


        })
    }
}