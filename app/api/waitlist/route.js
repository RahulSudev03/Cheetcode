import { NextResponse } from 'next/server';
import dbConnect from '../../utils/dbConnect';
import Email from '../../models/Email';
import { sendConfirmationEmail } from '../../utils/sendEmail';

export async function POST(req) {
  await dbConnect();

  const { email } = await req.json();

  // // Verify reCAPTCHA
  // const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
  // });

  // const data = await response.json();

  // if (!data.success) {
  //   return NextResponse.json({ error: 'reCAPTCHA validation failed' }, { status: 400 });
  // }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  try {
    const newEmail = new Email({ email });
    await newEmail.save();

    // Send confirmation email
    await sendConfirmationEmail(email);

    return NextResponse.json({ message: 'Email added to the waitlist' }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) { // Duplicate key error
      return NextResponse.json({ error: 'Email already on the waitlist' }, { status: 409 });
    } else {
      return NextResponse.json({ error: 'Failed to add email to the waitlist' }, { status: 500 });
    }
  }
}