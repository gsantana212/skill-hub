// /api/checkout — creates a checkout session for a product.
//   POST { productId, provider?: 'stripe' | 'lemon' }
//   -> { url, provider, sessionId, mock?: true }
//
// Stripe is primary; Lemon Squeezy is the backup if `provider=lemon` OR
// if Stripe is not configured AND the user didn't specify a provider.
//
// In dev (no real Stripe key), if `?mock=1` is passed or STRIPE_SECRET_KEY is
// a placeholder AND provider=stripe, we return a mock checkout URL that
// simulates success — useful for end-to-end smoke tests without provisioning
// Stripe test keys.

import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { lsCreateCheckout, isLSConfigured } from '@/lib/lemonsqueezy';
import { buildDownloadUrl } from '@/lib/downloads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function appUrl(req: NextRequest): string {
  return process.env.APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const productId = String(body?.productId ?? '');
  const product = getProduct(productId);
  if (!product) {
    return NextResponse.json(
      { error: `Unknown product: ${productId}` },
      { status: 400 }
    );
  }

  const provider = (body?.provider as 'stripe' | 'lemon' | undefined) ?? 'stripe';
  if (provider !== 'stripe' && provider !== 'lemon') {
    return NextResponse.json({ error: 'provider must be stripe or lemon' }, { status: 400 });
  }

  const allowMock = req.nextUrl.searchParams.get('mock') === '1' || body?.mock === true;
  const url = appUrl(req);
  const successUrl = `${url}/success?provider=${provider}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${url}/?canceled=1`;

  // ---- Stripe path ----
  if (provider === 'stripe') {
    const stripe = getStripe();
    if (!stripe) {
      if (allowMock) {
        const mockId = `cs_test_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        // mock checkout URL — points at our /success with mock flag set
        const mockSuccess = `${url}/success?provider=stripe&session_id=${mockId}&mock=1`;
        return NextResponse.json({
          provider: 'stripe',
          mock: true,
          sessionId: mockId,
          url: mockSuccess,
          message: 'Stripe key not configured — returning mock checkout URL. Set STRIPE_SECRET_KEY to use real Stripe.',
        });
      }
      return NextResponse.json(
        {
          error: 'Stripe is not configured.',
          hint: 'Set STRIPE_SECRET_KEY in .env.local, or pass provider=lemon, or pass mock=1.',
        },
        { status: 503 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: product.currency,
            unit_amount: product.priceCents,
            product_data: {
              name: product.name,
              description: product.tagline,
              metadata: { productId: product.id, slug: product.slug },
            },
          },
          quantity: 1,
        },
      ],
      metadata: { productId: product.id },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({
      provider: 'stripe',
      sessionId: session.id,
      url: session.url,
    });
  }

  // ---- Lemon Squeezy path ----
  if (provider === 'lemon') {
    if (!isLSConfigured()) {
      if (allowMock) {
        const mockId = `ls_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const mockSuccess = `${url}/success?provider=lemon&session_id=${mockId}&mock=1`;
        return NextResponse.json({
          provider: 'lemon',
          mock: true,
          sessionId: mockId,
          url: mockSuccess,
          message: 'Lemon Squeezy key not configured — returning mock checkout URL. Set LEMONSQUEEZY_API_KEY + storeId + variantId.',
        });
      }
      return NextResponse.json(
        {
          error: 'Lemon Squeezy is not configured.',
          hint: 'Set LEMONSQUEEZY_API_KEY + LEMONSQUEEZY_STORE_ID + LEMONSQUEEZY_VARIANT_ID in .env.local, or pass mock=1.',
        },
        { status: 503 }
      );
    }

    const storeId = process.env.LEMONSQUEEZY_STORE_ID ?? '';
    const variantId = product.lemonsqueezyVariantId ?? process.env.LEMONSQUEEZY_VARIANT_ID ?? '';
    if (!storeId || !variantId) {
      return NextResponse.json(
        {
          error: 'Lemon Squeezy variant missing.',
          hint: 'Set LEMONSQUEEZY_STORE_ID and product.lemonsqueezyVariantId (or LEMONSQUEEZY_VARIANT_ID).',
        },
        { status: 503 }
      );
    }

    const checkout = await lsCreateCheckout({
      storeId,
      variantId,
      productName: product.name,
      amountCents: product.priceCents,
      successUrl,
      metadata: { productId: product.id },
    });

    return NextResponse.json({
      provider: 'lemon',
      sessionId: checkout.id,
      url: checkout.url,
    });
  }

  return NextResponse.json({ error: 'unreachable' }, { status: 500 });
}

export async function GET(req: NextRequest) {
  // health probe
  return NextResponse.json({
    ok: true,
    stripe: isStripeConfigured(),
    lemon: isLSConfigured(),
    products: Object.keys(require('@/lib/products').PRODUCTS),
    appUrl: appUrl(req),
  });
}

// re-export helper so tests can import if needed
export { buildDownloadUrl };