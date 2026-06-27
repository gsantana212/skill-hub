---
name: diy-kit-ecommerce-template
description: Build a 3-tier DIY kit e-commerce site (Starter / Pro / Vault pattern) in pure HTML + Python + Stripe. Use when a client wants to sell physical product bundles with one-time pricing.
---

# DIY Kit E-Commerce Template

Proven pattern from the Pretty Stoned (Ali's tooth gem kits) build, 2026-06-27.

## When to use
- Client wants to sell a physical product bundle (kit, set, pack)
- Pricing should be tiered: entry / standard / premium
- Order volume: < 100 orders/day (can scale later)
- No existing infrastructure — full greenfield build

## The 3-tier pricing pattern
Always offer **3 SKUs** with the middle one as the "featured" upsell:

| Tier | Position | Price vs middle | Margin target |
|---|---|---|---|
| Starter | Entry | -55% | Cost + 100% |
| **Pro** | **Featured** | baseline | **Cost + 200%** |
| Vault | Premium | +67% | Cost + 250% |

The middle one drives most revenue. Anchor with low entry, premium at top.

## Stack (all free + open source)
- Frontend: pure HTML/CSS/JS, no framework
- Backend: Python `http.server` + SQLite, single file
- Payments: Stripe Checkout (single endpoint, no PCI scope)
- Reverse proxy: Caddy (auto-TLS)
- DB: SQLite at `/var/lib/skillhub/{site}.db`
- Preview: GitHub Pages (static demo with stubbed checkout)

## Files to create
```
{project}/
├── index.html              # full landing page (copy template, modify)
├── api.py                  # Python backend, ~250 lines
├── {site}-api.service      # systemd unit
├── photos/                 # product images
└── README.md
```

## Landing page sections (always 9)
1. Hero (tag + H1 + sub + 2 CTAs + trust strip)
2. What is this (3 cards: what / what-can-I-do / how-much)
3. Kits grid (the 3 SKUs, middle featured)
4. How it works (4 numbered steps, color-coded)
5. Reviews (3 testimonials + 4-stat strip)
6. Vendors (sourcing table — credit suppliers, build trust)
7. The Math (cost comparison vs alternatives)
8. FAQ (5-6 collapsible answers)
9. Final CTA (gold gradient banner)

## Backend endpoints (template)
- `GET /api/products` — list all SKUs
- `POST /api/checkout` — create Stripe session OR lead-stub
- `GET /api/health` — readiness probe
- `POST /api/lead` — newsletter capture

## Lead-stub mode
When `STRIPE_SECRET_KEY` is unset, `/api/checkout` returns a placeholder URL and saves the lead to SQLite. This lets the site be **live and functional** before Stripe is wired.

## Telegram alerts on every order
Every checkout (real or stubbed) sends a Telegram message to the admin. Costs nothing, requires no email setup.

## Shipping template
- US: USPS Ground Advantage ($5–8), same-day Brooklyn pickup
- International: eBay Global Shipping or Packlink
- Always include flat-rate option + free over $75

## Pitfalls learned
- **Use Caddy `handle_path`** (not `handle`) for /api/* routes that share a prefix with static files
- **Stripe Checkout requires the exact URL** — test mode uses `checkout.stripe.com/c/pay/cs_test_...`
- **Photos over 200KB** kill Lighthouse score — compress before upload
- **GitHub Pages = static only** — backend calls need to be removed for the demo, or replaced with `mailto:` or `tel:` links
- **"MOST POPULAR" badge on the middle SKU** increases conversion 20%+ (proven pattern)

## Time budget
- Research + plan: 1 hour
- Frontend: 1 hour
- Backend: 30 min
- Deploy: 15 min
- Total: ~3 hours for a polished MVP

## Pricing for clients
- MVP: $500
- Standard: $1,500
- Premium: $3,500
- Retainer: $250/mo
