import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dbConnect from '@/app/utils/mongoDB';
import user from '@/app/models/User';

export async function POST(req) {
  await dbConnect();
  
  const { username, password } = await req.json();

  try {
    // Find the user by username
    const foundUser = await user.findOne({ username });

    if (!foundUser) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: 'Invalid password' }),
        { status: 401 }
      );
    }

    // If credentials are valid, return a success response
    return new Response(
      JSON.stringify({ message: 'Sign in successful', user: { username: foundUser.username, email: foundUser.email } }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error during sign in:', error);
    return new Response(
      JSON.stringify({ message: 'An error occurred during sign in', error: error.message }),
      { status: 500 }
    );
  }
}
