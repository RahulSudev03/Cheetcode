import jwt from 'jsonwebtoken';
import User from '@/app/models/User';

// Utility to decode the token and fetch the user's email
export const getUserFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });
    return user;
  } catch (error) {
    console.error('Error fetching user from token:', error);
    return null;
  }
};
