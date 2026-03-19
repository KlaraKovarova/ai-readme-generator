import { NextResponse } from "next/server";

// LemonSqueezy overlay checkout is fully client-side via Lemon.js.
// This endpoint is kept for compatibility; the real checkout is triggered
// from the browser using the lemonsqueezy-button class + Lemon.js overlay.
export async function POST() {
  const checkoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL;
  if (!checkoutUrl) {
    return NextResponse.json({ error: "Checkout not configured" }, { status: 503 });
  }
  return NextResponse.json({ url: checkoutUrl });
}
