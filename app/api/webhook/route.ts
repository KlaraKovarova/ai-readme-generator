import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`Stripe event: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(`New subscriber session: ${session.id}`);
    // TODO: persist subscription status (DB or Stripe customer metadata)
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    console.log(`Subscription cancelled: ${sub.id}`);
  }

  return NextResponse.json({ received: true });
}
