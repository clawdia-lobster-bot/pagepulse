import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdminClient } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // If webhook secret is configured, verify signature
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`[PagePulse] Checkout completed: customer=${session.customer}, subscription=${session.subscription}`);

    const customerId = typeof session.customer === "string" ? session.customer : null;
    const supabaseUserId = session.metadata?.supabase_user_id;

    if (customerId && supabaseUserId) {
      try {
        const supabaseAdmin = createSupabaseAdminClient();
        await supabaseAdmin.auth.admin.updateUserById(supabaseUserId, {
          user_metadata: { stripe_customer_id: customerId },
        });
      } catch (err) {
        console.error("[PagePulse] Failed to attach Stripe customer to Supabase user", err);
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    console.log(`[PagePulse] Subscription cancelled: customer=${subscription.customer}`);
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    console.log(`[PagePulse] Subscription updated: customer=${subscription.customer}, status=${subscription.status}`);
  }

  return NextResponse.json({ received: true });
}
