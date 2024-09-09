import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req) {
  try {
    const { code, questionDescription, testCases, language, userMessage } = await req.json();
    console.log("Received data:", { code, questionDescription, testCases, language, userMessage });

    if (!questionDescription || !testCases || !language) {
      return NextResponse.json(
        { success: false, error: "Question description, test cases, or language missing." },
        { status: 400 }
      );
    }

    let messages = [
      {
        role: "system",
        content: "You are a technical interviewer. If the input is a greeting (like 'hello'), respond briefly with a polite greeting and quickly transition back to the technical problem at hand. For example, acknowledge the greeting and then ask the candidate about their approach to the current problem. For all other inputs, provide concise, context-aware feedback or questions to help guide the candidate toward solving the problem.",
      },
      {
        role: "user",
        content: `The candidate is working on the following problem:\n\nProblem Description: ${questionDescription}\n\nTest Cases: ${testCases}\n\nLanguage: ${language}.`,
      },
    ];

    if (userMessage) {
      messages.push({
        role: "user",
        content: `The candidate has the following question:\n\n"${userMessage}"`,
      });
    }

    if (code) {
      messages.push({
        role: "user",
        content: `The candidate has provided the following ${language} code:\n\n${code}\n\nAsk concise follow-up questions regarding the approach, edge cases, and time complexity. Provide brief feedback and hints, and encourage the candidate to think critically about their solution.`,
      });
    } else {
      messages.push({
        role: "user",
        content: `The candidate hasn't provided any code yet. Ask short, direct questions to help them think about the problem conceptually. Lead them to consider edge cases, time complexity, and possible strategies.`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
