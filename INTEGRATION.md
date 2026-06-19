# Skill Hub — Payment Integration Guide

**Status:** Site is live and viewable. Payment buttons show a "checkout not wired" toast until you wire a real provider. Pick one of the paths below.

**Live site:** https://gsantana212.github.io/skill-hub/
**Repo:** https://github.com/gsantana212/skill-hub
**Owner:** Ada + Gio

---

## Path A — Lemonsqueezy (recommended, fastest)

**Time to live:** ~20 minutes
**Fees:** 5% + 50¢ per transaction
**Tax handling:** They are the Merchant of Record — they collect VAT, GST, sales tax for 30+ countries. Zero filings for you.

### Steps
1. Create a Lemonsqueezy account at https://www.lemonsqueezy.com (5 min)
2. Verify your identity + payout bank (5 min)
3. Create 4 products, one per bundle:
   - `hermes-operator` — $19 — Agent Operator Starter Pack
   - `hermes-mrr` — $29 — MRR & Income Toolkit
   - `hermes-comms` — $15 — Comms & Debugging Pro
   - `hermes-vault` — $49 — The Full Vault
4. For each product: enable "Generate a unique URL", copy the checkout URL
5. In `index.html`, find/replace `YOUR-LEMONSQUEEZY-STORE` with your real store slug (4 occurrences, one per buy button)
6. Optionally set up a webhook → Discord #sales channel so you see revenue in real time
7. Push the update; Pages redeploys in ~60s

### Customising the buy buttons
Each button looks like:
```html
<button class="btn btn-primary buy-btn"
        data-bundle="operator"
        data-sku="hermes-operator"
        data-price="19"
        data-url="https://YOUR-STORE.lemonsqueezy.com/buy/hermes-operator">
  Buy $19 →
</button>
```
Change `data-url` to your real Lemonsqueezy checkout link. The JS already detects a real URL and calls `LemonSqueezy.Url.Open()` for the overlay.

---

## Path B — Stripe Payment Links (no backend, lower fee)

**Time to live:** ~30 minutes
**Fees:** 2.9% + 30¢ per transaction
**Tax handling:** You handle it. Stripe Tax is an optional add-on.

### Steps
1. Create a Stripe account at https://dashboard.stripe.com/register (5 min)
2. Verify your identity + bank (5 min)
3. In Stripe Dashboard → Payment Links → New → for each bundle, create a link with name + price + optional digital-download delivery
4. Copy the link URL (e.g. `https://buy.stripe.com/xxxxx`)
5. In `index.html`, find the URL stubs and replace them. The script auto-detects `buy.stripe.com` URLs and opens them in a new tab.
6. To enable the actual overlay via Stripe Checkout instead of redirect, swap the JS handler for `stripe-buy-button` web component (1 line change)

### Code change for Stripe redirect
In the buy-button click handler in `index.html`, the URL detection already handles non-Lemonsqueezy URLs by falling back to a toast. Add this for Stripe redirect:
```js
if (url && url.includes('buy.stripe.com')) {
  window.open(url, '_blank');
  return;
}
```

---

## Path C — Stripe Connect (when you go multi-seller)

**Time to live:** ~2 days of dev work
**Fees:** 2.9% + 30¢ + 5% platform fee
**Tax handling:** Stripe Tax add-on
**When:** Month 3+, when MRR justifies it and you have ≥2 skill authors

You'd need a backend (Cloudflare Workers or a tiny FastAPI) to:
- Create Connect accounts for authors
- Route payments + splits via `transfer_data[destination]`
- Issue license keys after payment

Don't start here. Stick with Lemonsqueezy until you're past $500/mo.

---

## Quick swap reference (after you have your checkout URLs)

| Bundle | data-sku | Old URL stub | Replace with |
|---|---|---|---|
| Agent Operator Starter Pack | `hermes-operator` | `YOUR-LEMONSQUEEZY-STORE.lemonsqueezy.com/buy/hermes-operator` | `yourstore.lemonsqueezy.com/buy/xxxxxx` |
| MRR & Income Toolkit | `hermes-mrr` | `.../buy/hermes-mrr` | `.../buy/xxxxxx` |
| Comms & Debugging Pro | `hermes-comms` | `.../buy/hermes-comms` | `.../buy/xxxxxx` |
| The Full Vault | `hermes-vault` | `.../buy/hermes-vault` | `.../buy/xxxxxx` |

Total of **4 replacements** in `index.html` (lines around the bundle cards).

---

## Going live checklist

- [ ] Payment provider account created + verified
- [ ] 4 product listings created with correct prices ($15/$19/$29/$49)
- [ ] Checkout URLs pasted into `index.html`
- [ ] Test buy at $1 (set price, buy, refund, verify download works)
- [ ] Reset price to real number
- [ ] Set up payout bank
- [ ] Add refund policy link to FAQ
- [ ] Push to GitHub Pages
- [ ] Share link on Telegram/Discord

**Time from "create account" to "first dollar":** ~30 min if you've got the bank details ready.
