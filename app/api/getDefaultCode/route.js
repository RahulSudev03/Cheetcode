// app/api/loadSavedCode/route.js

import { NextResponse } from 'next/server';
import dbConnect from "@/app/utils/dbConnect";
import Functions from '@/app/models/Functions';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const questionId = searchParams.get('questionId');
  const language = searchParams.get('language');

  try {
    const defaultFunction = await Functions.findOne({ questionId, language });

    if (!defaultFunction) {
      return NextResponse.json({ message: "No saved code found." }, { status: 404 });
    }

    return NextResponse.json({ function: defaultFunction.function }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
