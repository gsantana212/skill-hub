// Lemon Squeezy minimal wrapper.
// Docs: https://docs.lemonsqueezy.com/api
// We hit the API with a tiny fetch helper so we don't pull in a heavy SDK.

export const LS_API_BASE = 'https://api.lemonsqueezy.com/v1';

export type LSCheckout = {
  id: string;          // checkout id
  url: string;         // hosted checkout URL — redirect user here
  expiresAt?: string;
};

export function isLSConfigured(): boolean {
  const k = process.env.LEMONSQUEEZY_API_KEY;
  return !!(k && k.length > 20 && !k.includes('PLACEHOLDER'));
}

export function getLSSecret(): string | null {
  return isLSConfigured() ? process.env.LEMONSQUEEZY_API_KEY! : null;
}

export async function lsCreateCheckout(opts: {
  storeId: string;
  variantId: string;
  productName: string;
  amountCents: number;
  successUrl: string;
  metadata?: Record<string, string>;
}): Promise<LSCheckout> {
  const key = getLSSecret();
  if (!key) throw new Error('LEMONSQUEEZY_API_KEY not configured');

  const res = await fetch(`${LS_API_BASE}/checkouts`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_options: {
            embed: false,
            media: false,
            logo: true,
          },
          checkout_data: {
            email: '',
            custom: opts.metadata ?? {},
          },
          product_options: {
            redirect_url: opts.successUrl,
            receipt_button_text: 'Download your guide',
            receipt_thank_you_note: 'Your Agent OS Install Guide is on its way.',
          },
        },
        relationships: {
          store: { data: { type: 'stores', id: opts.storeId } },
          variant: { data: { type: 'variants', id: opts.variantId } },
        },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Lemon Squeezy error ${res.status}: ${text}`);
  }

  const json: any = await res.json();
  const attrs = json?.data?.attributes;
  return {
    id: json?.data?.id ?? '',
    url: attrs?.url ?? '',
    expiresAt: attrs?.expires_at,
  };
}

/**
 * Verify Lemon Squeezy webhook signature.
 * HMAC-SHA256 over the raw body using the signing secret.
 * Header: X-Signature (hex).
 * Docs: https://docs.lemonsqueezy.com/api/webhooks#signing-requests
 */
export function verifyLSSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  // Node crypto, computed here as a small inline helper
  // (imported lazily so client bundles don't pull node:crypto)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('node:crypto') as typeof import('node:crypto');
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(signature, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}