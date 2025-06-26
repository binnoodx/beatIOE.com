import User from "@/models/userSchema";
import { dbConnect } from "@/dbConnect/dbConnect";
import { NextResponse,NextRequest } from "next/server";

export async function POST(request:NextRequest) {

    const req = await request.json()
    const recievedEmail  = await req.email


    await dbConnect()
    const searchUser = await User.findOne({email:recievedEmail})


    return NextResponse.json({
        
        image:searchUser.profileImage,
        name:searchUser.userName
    })
    
}