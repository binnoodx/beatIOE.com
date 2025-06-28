import { dbConnect } from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const reqBody = await req.json();
  const { email: userEmailRecieved } = reqBody;

  const topUsers = await User.find({isVerified:true})
    .sort({ userPoints: -1 })
    .limit(100)
    .select({ fullName: 1, userPoints: 1, email: 1,profileImage:1 }) // add email to match later
    .exec();

  const viewUser = await User.findOne({ email: userEmailRecieved });
  const higherRankCount = await User.countDocuments({ userPoints: { $gt: viewUser.userPoints } });
  const rank = higherRankCount + 1;



  return NextResponse.json({
    users: topUsers,
    userNameToSent: viewUser?.fullName || "Anonymous",
    userPointToSent:viewUser.userPoints,
    userRankToSent : rank,
    userImage:viewUser.profileImage
  });
}
