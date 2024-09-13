import jwt from 'jsonwebtoken';
import dbConnect from '@/app/utils/dbConnect';
import User from '@/app/models/User'; // Your user model
import { getUserFromToken } from '@/app/utils/auth';

const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have the secret in your environment variables

// Function to verify token and get the user from the database
export async function verifyTokenAndGetUser(token) {
  try {
    // Verify the token with the secret
    const decoded = jwt.verify(token, JWT_SECRET);

    // Connect to your database
    await dbConnect();

    // Find the user in the database using the decoded information (e.g., decoded user ID or email)
    const user = await User.findById(decoded.userId); // Adjust this based on how your token is structured

    return user; // Return the user if found
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
