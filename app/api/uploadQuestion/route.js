import { NextResponse } from 'next/server';
import dbConnect from '../../utils/dbConnect';
import Question from '../../models/Question';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  try {
    if (name) {
      // Convert the URL-friendly name to the format used in the database
      const formattedName = name.replace(/-/g, ' ');
      console.log(`Received name: ${name}`);
      console.log(`Formatted name: ${formattedName}`);

      // Use a case-insensitive regular expression to find the question
      const question = await Question.findOne({ name: new RegExp(`^${formattedName}$`, 'i') });

      if (!question) {
        console.log('Question not found');
        return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
      }

      console.log('Question found:', question);
      return NextResponse.json({ success: true, question }, { status: 200 });
    } else {
      console.log('No name provided');
      const questions = await Question.find({});
      return NextResponse.json({ success: true, data: questions }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch questions' }, { status: 500 });
  }
}


export async function POST(req) {
  await dbConnect();

  const { name, description, difficulty, algorithm, testCase } = await req.json();

  if (!name || !description || !difficulty || !algorithm || !testCase) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    // Create a new question
    const newQuestion = new Question({
      name,
      description,
      difficulty,
      algorithm,
      testCase,
    });

    // Save the question to the database
    await newQuestion.save();

    return NextResponse.json({ message: 'Question uploaded successfully', data: newQuestion }, { status: 201 });
  } catch (error) {
    console.error('Error uploading question:', error);

    if (error.code === 11000) {
      return NextResponse.json({ error: 'Question name already exists' }, { status: 409 });
    } else {
      return NextResponse.json({ error: 'Failed to upload question' }, { status: 500 });
    }
  }
}
