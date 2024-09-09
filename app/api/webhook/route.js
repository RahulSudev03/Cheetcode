import { buffer } from 'micro';
import Stripe from 'stripe';
import dbConnect from '@/app/utils/dbConnect';
import User from '@/app/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route segment config - configure bodyParser and runtime
export const dynamic = 'force-dynamic'; // optional, based on your use case
export const runtime = 'nodejs';        // Ensure it's run on Node.js
export const bodyParser = false;        // Disable body parsing for Stripe

export async function POST(req, res) {
  let event;

  try {
    // Retrieve the raw body
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];

    // Verify the event using Stripe's library
    event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Log the event for debugging
    console.log("Stripe Event: ", event);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the 'checkout.session.completed' event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Retrieve userId from the session's metadata
    const userId = session.metadata?.userId;

    if (userId) {
      try {
        await dbConnect(); // Connect to the database

        // Find the user and update their subscription status
        await User.findByIdAndUpdate(userId, { isSubscribed: true });
        console.log(`User ${userId} subscription status updated to true.`);
      } catch (err) {
        console.error('Error updating user subscription status:', err);
        return new Response(`Database Error: ${err.message}`, { status: 500 });
      }
    } else {
      console.error('User ID not found in session metadata.');
      return new Response('User ID missing in session metadata', { status: 400 });
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
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
