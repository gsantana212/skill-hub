# AGENTS.md — gsantana212/skill-hub

> Operating contract for any AI agent (Claude Code, Codex, OpenCode, Hermes Agent, etc.)
> that opens this repo. Read this before editing anything.

## What this repo is

The SkillHub marketplace. It packages Hermes Agent skills into sellable bundles and
ships a single-file landing page. **Live at https://skillhub.shop.**

Per `README.md`:

> A marketplace for the best Hermes Agent skills, packaged into bundles you can buy
> and ship in minutes. Built and operated by Ada + Gio.

The repo is a **catalog + landing-page**, not a backend. There is no build step.
Everything is data-driven — edit the JSON, the HTML re-renders.

## Repo layout (verified 2026-08-31)

| File / dir | Role | Notes |
|---|---|---|
| `index.html` | Full marketplace landing page | Single file, no build step |
| `agents.json` | Pre-made agent registry | Current `version: 2026-06-27`, 11 agents, 4 skill packs |
| `skills.json` | Individual skill registry | `version: 1.1.0`, **49 skills across 9 categories** |
| `INTEGRATION.md` | Wire Lemonsqueezy or Stripe Payment Links | Step-by-step |
| `skills/` | Skill-internal docs | `competitor-site-research.md`, `diy-kit-ecommerce-template.md` (live in this repo, not just meta) |
| `case-studies/` | Client case studies | Includes Pretty Stoned / SMILE GEMS |
| `marketing/` | Marketing assets | — |
| `banner.svg`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml` | Static site assets | — |
| `links.md`, `SECURITY.md`, `LICENSE`, `README.md` | Standard repo glue | — |

## What an agent here can do safely

- **Edit `agents.json` / `skills.json`** — both share a top-level `version`, `updated`,
  `changelog`, and `merchant` block. Bump `version` and add a `changelog` entry on every change.
- **Add or update entries in `skills/`** — these are the canonical research docs that
  back the catalog claims.
- **Add a new `case-studies/` entry** when a client goes live.

## What an agent must NOT do here

- **Do not hand-edit `index.html` for catalog data.** The page regenerates from JSON.
- **Do not commit `.env`, API keys, or Lemonsqueezy/Stripe webhook secrets** — these
  belong in `/root/.hermes/secrets/`, never in the repo.
- **Do not push to `main` directly** — open a PR; CI checks the JSON schema.

## Conventions

- Currency: USD; prices are integers (no decimals in the JSON — Stripe handles the cents).
- Slugs: `kebab-case`; must be unique across `agents.json` and `skills.json`.
- Dates: ISO-8601 (`YYYY-MM-DD`).
- Skills index category names must match the 9 registered categories in `skills.json`.

## Build / serve

```bash
# No build step. Serve the directory:
python3 -m http.server 8000
# or deploy via GitHub Pages to gsantana212.github.io/skill-hub/
```

## Status snapshot (2026-08-31)

- 4 skill packs: operator, money & income, comms, vault
- 11 pre-made agents, 49 individual skills, 9 categories
- Payment provider: Lemonsqueezy (recommended) — first dollar target < 30 min after
  Lemonsqueezy account creation
- Mirror: `gsantana212.github.io/skill-hub/` (legacy)
- Canonical mirror: **this repo is the source of truth**; Pages mirrors it

## Provenance

This file was generated on 2026-08-31 by Hermes subagent during Week-1 consolidation
(`/root/.hermes/research/synthesis-2026-08-31.md` §2 action #2). Cited content is from
the on-disk `README.md`, `agents.json`, `skills.json`, and `ls` output at that time.