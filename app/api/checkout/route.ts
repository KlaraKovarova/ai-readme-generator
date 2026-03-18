import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICE_ID } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string };
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      customer_email: body.email,
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}`,
      metadata: { source: "readme-gen" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
