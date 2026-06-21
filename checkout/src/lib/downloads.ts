// Download tokens: HMAC-signed, time-limited.
// Format: base64url(payloadJson) + "." + base64url(hmacSig)
// payload = { orderId, productId, exp }
// We use Node crypto so it works in API routes (Node runtime).

import crypto from 'node:crypto';
import { getProduct, type Product } from './products';

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const s = process.env.DOWNLOAD_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      'DOWNLOAD_SECRET missing or too short (need >=16 chars). Set it in .env.local'
    );
  }
  return s;
}

export type DownloadPayload = {
  orderId: string;       // provider's id (Stripe session id or LS order id)
  productId: string;
  exp: number;           // unix seconds
};

export function signDownloadToken(
  payload: Omit<DownloadPayload, 'exp'>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): string {
  const full: DownloadPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const body = Buffer.from(JSON.stringify(full), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSecret())
    .update(body)
    .digest('base64url');
  return `${body}.${sig}`;
}

export function verifyDownloadToken(token: string): DownloadPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', getSecret())
    .update(body)
    .digest('base64url');
  // constant-time compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload: DownloadPayload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  return payload;
}

export function buildDownloadUrl(
  appUrl: string,
  payload: Omit<DownloadPayload, 'exp'>,
  ttlSeconds?: number
): string {
  const token = signDownloadToken(payload, ttlSeconds);
  return `${appUrl.replace(/\/$/, '')}/api/download/${encodeURIComponent(token)}`;
}

export function resolveProductForToken(payload: DownloadPayload): Product | undefined {
  return getProduct(payload.productId);
}