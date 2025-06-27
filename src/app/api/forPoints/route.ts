import User from "@/models/userSchema";
import { dbConnect } from "@/dbConnect/dbConnect";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();


    const request = await req.json();
    const useremail = request.email;
    const operation = request.operation;

    if (!useremail) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const user = await User.findOne({ email: useremail });


    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.questionAttempt += 1;

    // Perform operation
    if (operation === "+") {
      user.userPoints += 1;
      user.questionSolved += 1;
    } 
    
    else if (operation === "-") {


      if (user.userPoints === 0) {

        return NextResponse.json({
          newPoint: user.userPoints
        })
      }
      else if(user.userPoints === 1){
        user.userPoints = 0

      }
      else {
        user.userPoints -= 2;
      }
    }
    if (operation === "") {
      return NextResponse.json({
        newPoint: user.userPoints
      })
    }
    await user.save()
    return NextResponse.json({ newPoint: user.userPoints, status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
