import Stripe from "stripe";

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

export const FREE_LIMIT = 3;
export const PRICE_ID = process.env.STRIPE_PRICE_ID!;
