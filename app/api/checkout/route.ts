import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const PRICE_ID = process.env.STRIPE_PRICE_ID || "price_1T4rh2JsGDXMOz8juDsqMwuw";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripeCustomerId = (user.user_metadata as { stripe_customer_id?: string })?.stripe_customer_id;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer: stripeCustomerId || undefined,
      customer_email: stripeCustomerId ? undefined : user.email || undefined,
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        supabase_user_id: user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://pagepulse-tawny.vercel.app"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://pagepulse-tawny.vercel.app"}/cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
