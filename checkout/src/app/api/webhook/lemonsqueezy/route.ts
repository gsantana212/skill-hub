// /api/webhook/lemonsqueezy — receives LS events, verifies signature,
// generates a download token. Symmetric to the Stripe webhook.

import { NextRequest, NextResponse } from 'next/server';
import { verifyLSSignature } from '@/lib/lemonsqueezy';
import { getProduct } from '@/lib/products';
import { buildDownloadUrl } from '@/lib/downloads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function appUrl(req: NextRequest): string {
  return process.env.APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
}

export async function POST(req: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const devMode = !secret || secret.includes('PLACEHOLDER');

  const sig = req.headers.get('x-signature');
  const rawBody = await req.text();

  if (!devMode) {
    if (!verifyLSSignature(rawBody, sig, secret!)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Body is not valid JSON' }, { status: 400 });
  }

  // Lemon Squeezy event name: order_created
  if (event?.meta?.event_name === 'order_created') {
    const orderId = String(event?.data?.id ?? `ls_${Date.now()}`);
    const productId = String(
      event?.meta?.custom_data?.productId ??
        event?.data?.attributes?.first_order_item?.product_id ??
        ''
    );
    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${productId}` },
        { status: 400 }
      );
    }
    const downloadUrl = buildDownloadUrl(appUrl(req), {
      orderId,
      productId: product.id,
    });
    // eslint-disable-next-line no-console
    console.log('[lemon-webhook] order_created', {
      orderId,
      productId,
      email: event?.data?.attributes?.user_email,
      amount: event?.data?.attributes?.total,
      downloadUrl,
    });
    return NextResponse.json({
      received: true,
      provider: 'lemon',
      orderId,
      productId,
      downloadUrl,
    });
  }

  return NextResponse.json({ received: true, ignored: event?.meta?.event_name });
}