import { dbConnect } from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const reqBody = await req.json();
    const { name } = reqBody;

    if (!name) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const user = await User.findOne({ userName: name }).select(
      "profileImage email createdAt userPoints questionSolved questionAttempt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const higherRankCount = await User.countDocuments({
      userPoints: { $gt: user.userPoints },
    });
    const rank = higherRankCount + 1;

    return NextResponse.json({
      image: user.profileImage,
      joined: user.createdAt,
      points: user.userPoints,
      sPoints: user.questionSolved,
      aPoints: user.questionAttempt,
      rank: rank,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
