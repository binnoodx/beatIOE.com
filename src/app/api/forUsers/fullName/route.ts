import User from "@/models/userSchema";
import { dbConnect } from "@/dbConnect/dbConnect";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect()

    const reqBody = await req.json()
    const recievedName = reqBody.fullName
    const recievedEmail = reqBody.email

    const searchUser = await User.findOne({ email: recievedEmail })

    if (recievedName) {

        searchUser.fullName = recievedName
        searchUser.save()

    }
    else {
        searchUser.fullName = "User"
        searchUser.save()
    }


    return NextResponse.json({
        status: 200
    })

}