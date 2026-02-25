import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const { plan = "pro" } = await req.json();

  let priceId = null;
  // In production, use environment/config to store Stripe price IDs
  if (plan === "pro") {
    priceId = "price_1PN1vFJhLqiv2pVvU2AA_TEST"; // Replace with real price id
  }

  if (!priceId) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: "Stripe error", details: err }, { status: 500 });
  }
}
