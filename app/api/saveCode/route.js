import { NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import SavedCode from '@/app/models/SavedCode';
import User from '@/app/models/User';

export async function POST(request) {
  try {
    const { code, questionId, username, isCompleted } = await request.json();

    await dbConnect();

    await SavedCode.findOneAndUpdate(
      { username, questionId },
      { code },
      { upsert: true, new: true }
    );

    const user = await User.findOne({ username, 'questions.question': questionId });

    if (user) {
      // If the question exists, update the `isCompleted` field
      await User.findOneAndUpdate(
        { username, 'questions.question': questionId },
        { $set: { 'questions.$.isCompleted': isCompleted } },
        { new: true }
      );
    } else {
      // If the question doesn't exist, add it to the questions array
      await User.findOneAndUpdate(
        { username },
        { $addToSet: { questions: { question: questionId, isCompleted } } },
        { new: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error for debugging
    console.error('Error in saveCode handler:', error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
