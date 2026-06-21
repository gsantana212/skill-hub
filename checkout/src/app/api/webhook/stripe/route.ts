// /api/webhook/stripe — receives Stripe events, verifies signature,
// generates a download token for the product in the session metadata,
// and (in real prod) would email the customer. Here we log it and
// return the token so the operator can verify the pipeline.
//
// We accept `checkout.session.completed` events. The session has metadata.productId.

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, getStripeWebhookSecret } from '@/lib/stripe';
import { getProduct } from '@/lib/products';
import { buildDownloadUrl } from '@/lib/downloads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function appUrl(req: NextRequest): string {
  return process.env.APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const whSecret = getStripeWebhookSecret();

  // Dev/unsigned verification mode: if STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET
  // are both placeholders, accept events without signature check. Useful for
  // curl-based smoke tests. NEVER enable this in production.
  const devMode = !stripe && !whSecret;
  if (!stripe && !devMode) {
    return NextResponse.json(
      { error: 'Stripe not configured and not in dev mode.' },
      { status: 503 }
    );
  }

  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  let event: any;
  if (stripe && whSecret) {
    if (!sig) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, whSecret);
    } catch (err: any) {
      return NextResponse.json(
        { error: `Invalid signature: ${err?.message ?? 'unknown'}` },
        { status: 400 }
      );
    }
  } else if (devMode) {
    // dev mode — parse JSON ourselves, do NOT trust signature
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Body is not valid JSON' }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: 'Webhook misconfiguration' }, { status: 500 });
  }

  // Handle the event
  if (event?.type === 'checkout.session.completed') {
    const session = event.data?.object ?? {};
    const productId = String(session.metadata?.productId ?? '');
    const orderId = String(session.id ?? `evt_${event.id ?? Date.now()}`);
    const product = getProduct(productId);

    if (!product) {
      return NextResponse.json(
        { error: `Unknown product in metadata: ${productId}` },
        { status: 400 }
      );
    }

    const downloadUrl = buildDownloadUrl(appUrl(req), {
      orderId,
      productId: product.id,
    });

    // In real prod: send email with the URL. Here: log + return to caller.
    // eslint-disable-next-line no-console
    console.log('[stripe-webhook] checkout.session.completed', {
      orderId,
      productId,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email,
      downloadUrl,
    });

    return NextResponse.json({
      received: true,
      provider: 'stripe',
      orderId,
      productId,
      downloadUrl,
      // Operator can copy/paste this into the customer's success page
      // OR redirect customers via the success_url param (already set).
    });
  }

  // Acknowledge other events so Stripe stops retrying
  return NextResponse.json({ received: true, ignored: event?.type });
}