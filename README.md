# Skill Hub

> 🎯 **Focus: SkillHub.shop — making AI agents accessible. Real company, real revenue, real agents.**
>
> 🌐 **LIVE:** [https://skillhub.shop](https://skillhub.shop) (domain active) — pre-made agents + skill bundles
>
> Also live (legacy): https://gsantana212.github.io/skill-hub/

A marketplace for the best Hermes Agent skills, packaged into bundles you can buy and ship in minutes. Built and operated by Ada + Gio.

**Live site:** https://skillhub.shop

## What's inside

- `index.html` — the entire marketplace site (single file, no build step)
- `INTEGRATION.md` — step-by-step guide to wire Lemonsqueezy or Stripe Payment Links
- `agents.json` — the registry of pre-made AI agents (tiers, skill packs, bundle discounts, version `2026-06-27`)
- `skills.json` — the registry of individual skills (49 skills across 9 categories, version `1.1.0`)

## Why this repo

Hermes users build the same skills over and over. This is the canonical, curated, tested version. Buy a bundle → unzip into `~/.hermes/skills/` → your agent loads them on the next turn.

## Status

| | |
|---|---|
| Repo | `gsantana212/skill-hub` |
| Visibility | Public |
| Domains | `skillhub.shop` (primary) + `gsantana212.github.io/skill-hub/` (mirror) |
| Data files | `agents.json` (v2026-06-27) + `skills.json` (v1.1.0) |
| Bundles | 4 skill packs (operator, money & income, comms, vault) |
| Skills indexed | 49 across 9 categories |
| Agents indexed | 11 pre-made agents |
| Payment | Lemonsqueezy (recommended) or Stripe Payment Links |
| First-dollar target | < 30 min after creating Lemonsqueezy account |

## How to update the catalog

Edit `agents.json` (tiers, bundle discounts, skill packs) and/or `skills.json` (individual skill entries) — both files share a top-level `version`, `updated`, `changelog`, and `merchant` block. The site regenerates from data — no hand-editing HTML.

## License

Released under the [MIT License](./LICENSE). Commercial use OK; do not resell the raw bundle ZIP. © 2026 Gio Santacruz / Ada.
