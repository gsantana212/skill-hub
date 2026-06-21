'use client';

import { useState, useTransition } from 'react';
import { PRODUCTS } from '@/lib/products';

const PRODUCT = PRODUCTS['agent-os-install-guide'];

type CheckoutResponse = {
  provider: 'stripe' | 'lemon';
  url: string;
  sessionId: string;
  mock?: boolean;
  message?: string;
  error?: string;
  hint?: string;
};

export default function HomePage() {
  const [provider, setProvider] = useState<'stripe' | 'lemon'>('stripe');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, start] = useTransition();

  async function startCheckout() {
    setError(null);
    setInfo(null);
    try {
      const res = await fetch(`/api/checkout?mock=1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: PRODUCT.id,
          provider,
          mock: true, // also include in body for safety; ignored without ?mock=1 unless keys present
        }),
      });
      const json: CheckoutResponse = await res.json();
      if (!res.ok || json.error) {
        setError(json.error ?? `Checkout failed (${res.status})`);
        if (json.hint) setInfo(json.hint);
        return;
      }
      if (json.mock) {
        setInfo(json.message ?? 'Mock mode — redirecting to simulated success.');
      }
      window.location.href = json.url;
    } catch (e: any) {
      setError(e?.message ?? 'Network error');
    }
  }

  return (
    <main className="wrap">
      <span className="tag">Skill Hub · v1.0 · MRR Sprint</span>
      <h1>{PRODUCT.name}</h1>
      <p className="lede">{PRODUCT.description}</p>

      <div className="card">
        <div>
          <div className="price">
            <span className="amount">${(PRODUCT.priceCents / 100).toFixed(0)}</span>
            <span className="period">one-time · lifetime updates</span>
          </div>
          <ul className="features">
            {PRODUCT.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: 16, fontSize: 13.5 }}>
            PDF · {PRODUCT.fileName}. MIT-style license: commercial use OK, no reselling the raw PDF.
          </p>
        </div>

        <div className="cta">
          <div className="row" style={{ justifyContent: 'space-between', fontSize: 13 }}>
            <label className="row" style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="provider"
                value="stripe"
                checked={provider === 'stripe'}
                onChange={() => setProvider('stripe')}
              />
              Stripe
            </label>
            <label className="row" style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="provider"
                value="lemon"
                checked={provider === 'lemon'}
                onChange={() => setProvider('lemon')}
              />
              Lemon Squeezy
            </label>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => start(startCheckout)}
            disabled={pending}
            data-testid="buy-button"
          >
            {pending ? 'Opening checkout…' : `Buy $${(PRODUCT.priceCents / 100).toFixed(0)} →`}
          </button>

          <p className="note">
            Test mode · Card <span className="kbd">4242 4242 4242 4242</span> works once Stripe keys are set.
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      <p className="footer">
        Built by Ada + Gio ·{' '}
        <a href="https://github.com/gsantana212/skill-hub" target="_blank" rel="noreferrer">
          repo
        </a>{' '}
        ·{' '}
        <a href="/api/checkout" target="_blank" rel="noreferrer">
          /api/checkout health
        </a>
      </p>
    </main>
  );
}