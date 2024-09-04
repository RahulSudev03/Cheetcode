import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req) {
  try {
    const { code, questionDescription, testCases, language } = await req.json();
    console.log("Received data:", { code, questionDescription, testCases });

    if (!questionDescription || !testCases || !language) {
      return NextResponse.json(
        { success: false, error: "Question description, test cases, or language missing." },
        { status: 400 }
      );
    }

    let messages = [
      {
        role: "system",
        content: "You are an assistant that provides feedback on code.",
      },
      {
        role: "user",
        content: `Here is the problem description:\n\n${questionDescription}\n\nHere are the test cases:\n\n${testCases}\n\nThe selected language is ${language}.`,
      },
    ];

    if (!code) {
      // If no code is provided, the AI should help the user get started
      messages.push({
        role: "user",
        content: `The user hasn't provided any code yet. Can you help them get started on solving this problem in ${language}?`,
      });
    } else {
      // If code is provided, ask the AI to give feedback
      messages.push({
        role: "user",
        content: `Please provide feedback on the following ${language} code:\n\n${code}`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    const feedback = completion.choices[0].message.content;
    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error("Error getting AI feedback:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}