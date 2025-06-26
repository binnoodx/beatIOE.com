 import { dbConnect } from "@/dbConnect/dbConnect";
import Question from "@/models/questionSchema";
import { NextResponse } from "next/server";
import User from "@/models/userSchema";

// Route: /api/getQuestions?page=1&limit=5
export async function POST(req: Request) {
  await dbConnect();
  const request = await req.json()

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const skip = (page - 1) * limit;

  const findUser = await User.findOne({ email: request.email })
  const newArray = findUser.seenQuestons

  try {
    // const randomQuestions = await Question.find({})
    // const questionsToSend = await Question.find({
    //   seed: { $nin: newArray } // fetch questions NOT in seen list
    // }).limit(limit);

    const randomQuestions = await Question.aggregate([
      { $match: { seed: { $nin: newArray } } }, // Exclude seen // Randomly pick limit questions
    ]);


    const formatted = randomQuestions.map((q) => ({
      _id: q._id.toString(),
      seed: q.seed,
      question: q.question,
      options: q.options.slice(0, 4), // Make sure 'option' array exists and has at least 4
      correctOption: q.correctOption,
      subject: q.subject,
      topic: q.topic,
      solvedBy: q.solved_by,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (err) {
    console.error("DB Fetch Error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch questions." }, { status: 500 });
  }
}


