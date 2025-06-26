import User from "@/models/userSchema";
import { dbConnect } from "@/dbConnect/dbConnect";
import { NextResponse,NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    await dbConnect()

  try {
      const reqBody = await req.json()
    const recievedEmail = reqBody.email

    const searchUser = await User.findOne({email:recievedEmail})


    if(searchUser.fullName != ""){
       return NextResponse.json({
        message:"Repeat"
       })
    }
    else{
       return NextResponse.json({
        message:"First Time"
       })}
    
  } catch (error) {

    return NextResponse.json({
        message:error
       })
    
  }

    
    
    
}