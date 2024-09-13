import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from '@/app/utils/dbConnect';
import User from '@/app/models/User';
import { getUserFromToken } from '@/app/utils/auth';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100);
};

export async function POST(req) {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    // Fetch user details using the token
    await dbConnect();
    const user = await getUserFromToken(token); // Create a utility to fetch user info from token

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = user.email; // Email fetched from the logged-in user

    const origin = req.headers.get("origin");
    const params = {
      mode: "subscription", // Corrected from submit_type to mode
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pro Subscription",
            },
            unit_amount: formatAmountForStripe(10), // 10 dollars
            recurring: {
              interval: "month",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        email: email, // Email passed in metadata
      },
      success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
