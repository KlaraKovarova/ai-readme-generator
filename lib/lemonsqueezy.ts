import { createHmac } from "crypto";

export const FREE_DAILY_LIMIT = 5;

/** Validate LemonSqueezy webhook signature */
export function validateWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  return digest === signature;
}
