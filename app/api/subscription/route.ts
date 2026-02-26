import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get("customer_id");
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!customerId && !sessionId) {
    return NextResponse.json({ active: false, error: "No customer_id or session_id" }, { status: 400 });
  }

  try {
    let custId = customerId;

    // If we have a session_id, look up the customer from the session
    if (sessionId && !custId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      custId = session.customer as string;
    }

    if (!custId) {
      return NextResponse.json({ active: false });
    }

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: custId,
      status: "active",
      limit: 1,
    });

    const active = subscriptions.data.length > 0;

    return NextResponse.json({
      active,
      customer_id: custId,
    });
  } catch (err: any) {
    return NextResponse.json({ active: false, error: err.message }, { status: 500 });
  }
}
