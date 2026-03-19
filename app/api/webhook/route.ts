import { NextRequest, NextResponse } from "next/server";
import { validateWebhookSignature } from "@/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-signature");

  if (!validateWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { meta: { event_name: string }; data?: unknown };
  try {
    event = JSON.parse(body) as { meta: { event_name: string }; data?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = event.meta?.event_name;
  console.log(`LemonSqueezy event: ${eventName}`);

  if (eventName === "order_created") {
    console.log("New order:", JSON.stringify(event.data));
    // TODO: persist subscription status to DB
  }

  if (eventName === "subscription_created") {
    console.log("New subscription:", JSON.stringify(event.data));
  }

  if (eventName === "subscription_cancelled") {
    console.log("Subscription cancelled:", JSON.stringify(event.data));
  }

  return NextResponse.json({ received: true });
}
