import User from "@/models/userSchema";
import { dbConnect } from "@/dbConnect/dbConnect";
import { NextResponse,NextRequest } from "next/server";

export async function POST(req:NextRequest) {

    const request = await req.json()


    const findUser = await User.findOne({email:request.email})
    let prevSeenQue = findUser.seenQuestons
    const newArray = prevSeenQue.push((request.seed))
    await findUser.save()
    return NextResponse.json({
        status:200
    })

    
}