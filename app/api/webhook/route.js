import { buffer } from 'micro';
import Stripe from 'stripe';
import dbConnect from '@/app/utils/dbConnect';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const bodyParser = false;  

export async function POST(req) {
  let event;

  try {
    // Retrieve the raw body for Stripe signature verification
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];

    // Verify the event using Stripe's library
    event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log(`Stripe Event Received: ${event.type}`);
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle 'checkout.session.completed' event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.metadata?.email;

    if (!email) {
      console.error('Email not found in session metadata.');
      return NextResponse.json({ error: 'Email is missing in session metadata' }, { status: 400 });
    }

    try {
      await dbConnect();
      console.log("✅ Connected to the database");
      const updatedUser = await User.findOneAndUpdate(
        { email }, 
        { isSubscribed: true }, 
        { new: true }
      );

      if (updatedUser) {
        console.log(`✅ Subscription status for ${email} updated to true.`);
        return NextResponse.json({ message: `Subscription updated for ${email}` }, { status: 200 });
      } else {
        console.error(`❌ No user found with email ${email}`);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    } catch (err) {
      console.error(`⚠️ Error updating user subscription status: ${err.message}`);
      return NextResponse.json({ error: `Database Error: ${err.message}` }, { status: 500 });
    }
  } else {
    console.log(`⚠️ Unhandled event type ${event.type}`);
    return NextResponse.json({ message: 'Unhandled event type' }, { status: 400 });
  }
}
