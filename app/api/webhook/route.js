import { buffer } from 'micro';
import Stripe from 'stripe';
import dbConnect from '@/app/utils/dbConnect';
import User from '@/app/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhook config
export const dynamic = 'force-dynamic'; // optional
export const runtime = 'nodejs';
export const bodyParser = false; // Disable body parsing for Stripe

export async function POST(req, res) {
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

    // Log the event type for debugging
    console.log(`Stripe Event Received: ${event.type}`);
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the 'checkout.session.completed' event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Retrieve email from metadata
    const email = session.metadata?.email;
    
    if (!email) {
      console.error('Email not found in session metadata.');
      return res.status(400).json({ error: 'Email is missing in session metadata' });
    }

    try {
      // Connect to the database
      await dbConnect();

      // Find the user by email and update their subscription status
      const updatedUser = await User.findOneAndUpdate({ email }, { isSubscribed: true }, { new: true });

      if (updatedUser) {
        console.log(`✅ User with email ${email} subscription status updated to true.`);
        return res.status(200).json({ received: true });
      } else {
        console.error(`❌ No user found with email ${email}`);
        return res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      console.error('Error updating user subscription status:', err);
      return res.status(500).json({ error: `Database Error: ${err.message}` });
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
    return res.status(200).json({ received: true });
  }
}






// import { buffer } from 'micro';
// import Stripe from 'stripe';
// import dbConnect from '@/app/utils/dbConnect';
// import user from '@/app/models/User';
// import { NextResponse } from 'next/server';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // Required for raw body parsing
// export const config = {
//   api: {
//     bodyParser: false, // Stripe needs the raw body
//   },
// };

// export async function POST(req) {
//   let event;

//   try {
//     // Parse the raw body
//     const rawBody = await buffer(req);
//     const signature = req.headers.get('stripe-signature');

//     // Log signature and raw body
//     console.log('Signature:', signature);
//     console.log('Raw Body:', rawBody.toString());

//     event = stripe.webhooks.constructEvent(
//       rawBody.toString(), // Ensure rawBody is a string
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );

//     // Log the event type
//     console.log('Event Type:', event.type);
//   } catch (err) {
//     console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
//     return NextResponse.json(
//       { error: `Webhook Error: ${err.message}` },
//       { status: 400 }
//     );
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed': {
//       const session = event.data.object;
//       const userId = session.metadata?.userId; // Extract the userId from the metadata

//       // Log the session data
//       console.log('Session Data:', session);

//       if (!userId) {
//         console.error('User ID is missing in session metadata.');
//         return NextResponse.json(
//           { error: 'User ID is missing in session metadata.' },
//           { status: 400 }
//         );
//       }

//       await dbConnect();

//       // Update the user to mark them as subscribed
//       try {
//         await user.findByIdAndUpdate(userId, { isSubscribed: true });
//         console.log(`User ${userId} subscription status updated.`);
//       } catch (err) {
//         console.error('Error updating user subscription:', err);
//         return NextResponse.json(
//           { error: `Database Error: ${err.message}` },
//           { status: 500 }
//         );
//       }

//       break;
//     }
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   return NextResponse.json({ received: true }, { status: 200 });
// }
