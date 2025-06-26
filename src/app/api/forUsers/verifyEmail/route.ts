import { NextResponse , NextRequest } from "next/server";
import User from "@/models/userSchema";
import { dbConnect } from "@/dbConnect/dbConnect";


export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const tokenJson = await req.json();
    console.log(tokenJson.token);

    const searchUser = await User.findOne({
      verifyToken: tokenJson.token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    // ❗ Check if user with valid token exists
    if (!searchUser) {
      return NextResponse.json(
        {
          message: "Invalid or expired token",
          status: false,
        },
        { status: 400 }
      );
    }

    searchUser.isVerified = true;
    searchUser.verifyToken = undefined;
    searchUser.verifyTokenExpiry = undefined;

    await searchUser.save();

    return NextResponse.json({
      message: "Successfully Verified",
      status: true,
      email: searchUser.email,
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { message: "Server error", status: false },
      { status: 500 }
    );
  }
}
