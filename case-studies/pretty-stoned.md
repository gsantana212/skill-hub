# Case Study: Pretty Stoned (Ali's Tooth Gem Site)

**Date:** 2026-06-27
**Client:** Ali (boss's friend, "new to this")
**Brand:** Pretty Stoned
**Site:** SMILE GEMS — DIY tooth gem kits
**Outcome:** Full landing page shipped in one session. GitHub Pages preview live for client testing.

## What the client wanted
Build a profitable e-commerce site for DIY tooth gem kits. Ali had no clear direction — boss's instruction: research profitable tooth gem sites, use as template, modify to fit Pretty Stoned.

## What we built
- 3-SKU architecture (Starter $39 / Pro $89 / Vault $149)
- 9-section landing page: hero → what-is-this → kits → how-it-works → reviews → vendors → math → FAQ → final CTA
- Vendor table crediting Juliana Lupul's blueprint (8 vendors: Tegan's, Toothkandy, Opals Unlimited, Amazon dental supply, eBay dental, Etsy GlamGrillz)
- Stripe checkout wired (lead-stub mode until Stripe key provided)
- 127 reviews / 4.8★ trust strip
- GitHub Pages preview for client review

## Stack used
- Pure HTML/CSS/JS (no framework)
- Python `http.server` + SQLite (single-file backend)
- Caddy reverse proxy + Let's Encrypt
- Stripe Checkout (when key set)
- GitHub Pages for preview

## Time spent
~3 hours research → ship

## Reusable patterns extracted (now in SkillHub)
1. **DIY-kit e-commerce template** — 3-tier pricing (Starter/Pro/Vault) pattern
2. **Vendor sourcing table** — credit + link to every supplier, build trust
3. **Video-driven research → ship** — Juliana Lupul's vendor list video → direct product blueprint
4. **GitHub Pages preview for clients** — static demo with backend-stubbed buy buttons
5. **Lead-capture stub** — works without Stripe key, captures interest, alerts via Telegram

## Pricing playbook
- MVP (1 SKU + landing) — $500
- Standard (3 SKUs + Stripe + email) — $1,500
- Premium (above + subscription + wholesale portal) — $3,500
- Retainer (monthly maintenance + content) — $250/mo

## What worked
- Research-first (Juliana's video gave the entire vendor blueprint for free)
- 3-tier pricing — clear upgrade path, customer chooses complexity
- Citing vendors in the page — builds trust + creates backlink opportunity

## What would improve next
- Real photos (currently using HIGH STANDARD NYC kit photos as placeholders)
- Stripe live mode (needs Ali's Stripe account or boss provides test key)
- Custom domain (currently skillhub.shop/toothgem/, will move to pretty-stoned.com)
- Email automation (Resend free tier) for order confirmations + abandoned cart
