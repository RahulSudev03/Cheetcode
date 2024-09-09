// app/api/loadSavedCode/route.js

import { NextResponse } from 'next/server';
import dbConnect from "@/app/utils/dbConnect";
import SavedCode from "@/app/models/SavedCode";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const questionId = searchParams.get('questionId');

  try {
    const savedCode = await SavedCode.findOne({ username, questionId });

    if (!savedCode) {
      return NextResponse.json({ message: "No saved code found." }, { status: 404 });
    }

    return NextResponse.json({ code: savedCode.code }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
