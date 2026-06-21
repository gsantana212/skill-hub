// /success — landing after checkout. We don't trust the session_id from the URL
// alone (anyone can hit /success?session_id=fake). In real prod, the webhook fires,
// creates a download token, and emails it. For this MVP we also accept
// ?token=... in the URL (set by Stripe redirect via the success_url, or set
// manually during dev). If neither is present we render a friendly message.

import { Suspense } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';

function SuccessInner({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const provider = String(searchParams.provider ?? 'stripe');
  const sessionId = String(searchParams.session_id ?? '');
  const token = String(searchParams.token ?? '');
  const mock = searchParams.mock === '1' || searchParams.mock === 'true';
  const canceled = searchParams.canceled === '1';

  const product = PRODUCTS['agent-os-install-guide'];

  if (canceled) {
    return (
      <main className="wrap">
        <span className="tag">Checkout canceled</span>
        <h1>No charge.</h1>
        <p className="lede">You canceled at the payment step. The bundle is still here when you're ready.</p>
        <Link href="/" className="btn btn-primary" style={{ display: 'inline-block', textAlign: 'center', maxWidth: 280 }}>
          Back to the guide
        </Link>
      </main>
    );
  }

  // Build a download URL if a token was supplied. Otherwise, render the
  // "we're emailing it" state. Operators can also visit the webhook endpoint
  // to mint a token manually (see README).
  const downloadHref = token
    ? `/api/download/${encodeURIComponent(token)}`
    : null;

  return (
    <main className="wrap">
      <span className="tag">Order received</span>
      <h1>Thanks. Here's your guide.</h1>
      <p className="lede">
        Payment via {provider === 'lemon' ? 'Lemon Squeezy' : 'Stripe'} · order{' '}
        <code className="kbd">{sessionId || '(pending)'}</code>
        {mock && ' · MOCK (no real payment processed)'}
      </p>

      <div className="card">
        <div>
          <div className="price">
            <span className="amount">${(product.priceCents / 100).toFixed(0)}</span>
            <span className="period">{product.name}</span>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            {product.tagline}
          </p>
        </div>

        <div className="cta">
          {downloadHref ? (
            <a className="btn btn-primary" href={downloadHref} data-testid="download-link">
              Download PDF →
            </a>
          ) : (
            <button className="btn btn-primary" disabled>
              Sending your download link…
            </button>
          )}
          <Link href="/" className="btn btn-secondary" style={{ textAlign: 'center' }}>
            Back to store
          </Link>
        </div>
      </div>

      {!downloadHref && (
        <div className="alert alert-success" style={{ marginTop: 24 }}>
          We mint your download link in the webhook. In production this happens
          within ~2 seconds of payment; in this MVP, hit{' '}
          <code className="kbd">/api/webhook/stripe</code> with a Stripe-signed
          event to fire it. The dev <code className="kbd">?mock=1</code> flow
          returns one automatically.
        </div>
      )}

      <p className="footer">
        Questions? Email{' '}
        <a href="mailto:gsantana212@gmail.com">gsantana212@gmail.com</a>.
      </p>
    </main>
  );
}

export default function SuccessPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <Suspense fallback={<main className="wrap"><p>Loading…</p></main>}>
      <SuccessInner searchParams={searchParams} />
    </Suspense>
  );
}