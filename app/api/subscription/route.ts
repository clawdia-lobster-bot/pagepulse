import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      return NextResponse.json({ active: false });
    }

    const customerId = (user.user_metadata as { stripe_customer_id?: string })?.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json({ active: false });
    }

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const active = subscriptions.data.length > 0;

    return NextResponse.json({
      active,
      customer_id: customerId,
    });
  } catch (err: any) {
    return NextResponse.json({ active: false, error: err.message }, { status: 500 });
  }
}
