import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/app/utils/dbConnect"; 
import User from "@/app/models/User"; 

export async function POST(request) {
  try {
    // Ensure the database is connected
    await dbConnect();

    const { username, email, password } = await request.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error creating user:", error.message); // Log error to console
    return NextResponse.json(
      { message: "Error creating user", error: error.message },
      { status: 500 }
    );
  }
}
