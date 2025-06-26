import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "Invalid question" }, { status: 400 });
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000", // 🔥 required
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        max_tokens: 1000, // 🔥 Add this to stay under free quota
        messages: [
          { role: "system", content: "You are a summaruzed answer Provider with little text" },
          { role: "user", content: question },
        ],
      }),
    });

    const data = await res.json();

    // 🔍 Debug logs — useful for checking structure
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    if (data.error) {
      return NextResponse.json({ error: data.error.message || "API error" }, { status: 500 });
    }

    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      return NextResponse.json({ error: "AI response missing message content" }, { status: 500 });
    }

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Fetch failed:", err);
    return NextResponse.json({ error: "Failed to reach OpenRouter" }, { status: 500 });
  }
}
