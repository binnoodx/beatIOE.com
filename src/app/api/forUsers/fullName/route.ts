import User from "@/models/userSchema";
import { dbConnect } from "@/dbConnect/dbConnect";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect()

    const reqBody = await req.json()
    const recievedName = reqBody.fullName
    const recievedEmail = reqBody.email

    const searchUser = await User.findOne({ email: recievedEmail })
    searchUser.fullName = recievedName
    searchUser.save()

    return NextResponse.json({
        status: 200
    })

}