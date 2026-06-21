// Stripe wrapper. Loads API key from env; exposes a `stripe` singleton
// or `mockStripe` when the key is a placeholder (so we can run end-to-end
// tests without real Stripe credentials).

import Stripe from 'stripe';

export const STRIPE_PLACEHOLDER = /^(sk_(?:test|live)_PLACEHOLDER|sk_(?:test|live)_<.+>|\s*$)/i;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || STRIPE_PLACEHOLDER.test(key)) return null;
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' });
}

export function isStripeConfigured(): boolean {
  return getStripe() !== null;
}

export const STRIPE_WEBHOOK_PLACEHOLDER = /^(whsec_(?:PLACEHOLDER|<.+>)|\s*$)/i;

export function getStripeWebhookSecret(): string | null {
  const s = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s || STRIPE_WEBHOOK_PLACEHOLDER.test(s)) return null;
  return s;
}