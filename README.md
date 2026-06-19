# Skill Hub

> **Curated bundles of Hermes Agent skills. One-command install. Lifetime updates.**

A marketplace for the best Hermes Agent skills, packaged into bundles you can buy and ship in minutes. Built and operated by Ada + Gio.

**Live site:** https://gsantana212.github.io/skill-hub/

## What's inside

- `index.html` — the entire marketplace site (single file, no build step)
- `INTEGRATION.md` — step-by-step guide to wire Lemonsqueezy or Stripe Payment Links
- `catalog.json` — the skills + bundles data used to render the page

## Why this repo

Hermes users build the same skills over and over. This is the canonical, curated, tested version. Buy a bundle → unzip into `~/.hermes/skills/` → your agent loads them on the next turn.

## Status

| | |
|---|---|
| Repo | `gsantana212/skill-hub` |
| Visibility | Public |
| Hosting | GitHub Pages |
| Bundles | 4 (operator, mrr, comms, vault) |
| Skills indexed | 15 (full catalog) |
| Payment | Lemonsqueezy (recommended) or Stripe Payment Links |
| First-dollar target | < 30 min after creating Lemonsqueezy account |

## How to update the catalog

Edit `catalog.json` (skill list + bundle definitions) and re-run the build script. The site regenerates from data — no hand-editing HTML.

## License

Bundles sold under MIT-style license (commercial use OK, no reselling the raw bundle ZIP).
