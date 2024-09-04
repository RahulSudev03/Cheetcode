import { NextResponse } from 'next/server';
import Question from '../../../models/Question'; // Adjust the path as needed
import dbConnect from '../../../utils/dbConnect'; // Ensure you're connected to your database

// Function to slugify the question name (to make it URL safe)
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, ''); // Remove all non-word chars
};

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch questions where difficulty is either 'easy', 'medium', or 'hard'
    const questions = await Question.find({ difficulty: { $in: ['easy', 'medium', 'hard'] } });

    // Check if there are any eligible questions
    if (questions.length === 0) {
      return NextResponse.json({ success: false, error: 'No eligible questions found' }, { status: 404 });
    }

    // Randomly select a question
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];

    // Create a slug for the question name
    const slug = slugify(randomQuestion.name);

    // Return the random question with the slug
    return NextResponse.json({ success: true, question: { ...randomQuestion._doc, slug } });
  } catch (error) {
    console.error("Error fetching random question:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch random question" }, { status: 500 });
  }
}
