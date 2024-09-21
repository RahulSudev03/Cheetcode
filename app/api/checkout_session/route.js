import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserFromToken } from '@/app/utils/auth'; // Import the helper

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100); // Convert dollars to cents
};

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: "Error retrieving checkout session" },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  const token = req.headers.get("authorization").split(' ')[1]; // Extract token from Authorization header

  // Get the user from the token
  const user = await getUserFromToken(token);

  if (!user) {
    return new Response(
      JSON.stringify({ error: 'User not authenticated' }),
      { status: 401 }
    );
  }

  try {
    const origin = req.headers.get("origin"); // Get the origin to use for the success and cancel URLs

    const params = {
      mode: "subscription",
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
        email: user.email, // Pass the user's email from the decoded token
      },
      success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    };

    // Create the checkout session with Stripe
    const checkoutSession = await stripe.checkout.sessions.create(params);

    // Return the checkout session details
    return new Response(JSON.stringify(checkoutSession), { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: "Error creating checkout session" }),
      { status: 500 }
    );
  }
}
