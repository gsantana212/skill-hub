---
name: competitor-site-research
description: Given a niche/product, find the top 10 profitable competitor sites, extract their pricing, copy, and UX patterns. Use before building any client e-commerce site.
---

# Competitor Site Research (Web-Fetch Pattern)

Quick pattern for "research first, then build" client work. Used for Pretty Stoned / SMILE GEMS, 2026-06-27.

## When to use
Boss asks: "find examples of profitable [niche] sites and use them as templates"
Or: "research what good [niche] sites look like"

## Method (5 steps, ~30 min)

### 1. Identify the niche + 3 sub-categories
Example (Pretty Stoned):
- Primary: tooth gem kits
- Adjacent: tooth gem artists, dental jewelry, cosmetic dentistry

### 2. Build a target list of 10+ candidate sites
Sources:
- Juliana Lupul-style vendor list videos (YouTube)
- Amazon best-sellers in the category
- Etsy top sellers
- Instagram hashtags (#toothgem, #smilejewelry)
- TikTok creators in the niche
- Google "best [niche] shop" + "buy [niche] online"

### 3. Fetch each site, extract key data
For each candidate, run:
```python
import urllib.request, re
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0..."})
html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', 'ignore')
# Extract: title, meta description, h1, prices, CTAs
```

What to capture per site:
- Headline + sub-headline (positioning)
- Pricing (number of SKUs, tiers, price points)
- Trust signals (reviews, guarantees, certifications)
- Vendor mentions (where do they source from)
- CTA copy ("Buy now", "Reserve", "Get yours")
- Visual style (colors, typography, layout — screenshot to local file)

### 4. Synthesize patterns
Look for:
- **Common pricing tiers** (do most have 3 SKUs? what price points?)
- **Common copy patterns** (phrases used by >50% of sites)
- **Common trust signals** (reviews, guarantees, certifications)
- **Vendor overlap** (where do the pros source?)

### 5. Apply to client
- Pick 2-3 sites as templates
- Copy the proven patterns (pricing, layout, trust strip)
- Modify positioning for client's brand voice
- Credit the source sites if appropriate (vendor table pattern)

## Tools
- `urllib.request` — fetch sites (no API key, rate-limited)
- DuckDuckGo HTML — search without API key
- Regex — extract titles, prices, CTAs
- Playwright/Selenium — only if sites block urllib (last resort)

## Output format
Save to `/home/adaops/SkillHub/research/{client}-competitors-{date}.md`:

```markdown
# Competitor Research: {Client} ({Niche}) — {Date}

## Top 10 sites analyzed
| Site | URL | Pricing | SKUs | Trust | Notable |
|---|---|---|---|---|---|

## Patterns to apply
- Pricing: ...
- Copy: ...
- Trust strip: ...
- Vendors: ...

## Source attribution
- Video: Juliana Lupul "Materials you need for Tooth Gems"
- ...

## Implementation plan
- [ ] Copy {site} pricing structure
- [ ] Adopt {site} trust strip copy
- [ ] Credit {vendor} in client page
```

## Pitfalls learned
- **Don't fetch too fast** — many sites block after 5 rapid hits, add `time.sleep(1)`
- **JS-rendered sites** (React/Vue) return empty body via urllib — use Playwright
- **Region-locked sites** (e.g. EU stores) — set Accept-Language header
- **Don't copy verbatim** — synthesize, never clone. Plagiarism risk + Google penalty
- **Always check that the source still exists** before crediting in published copy

## Time budget
- Site list building: 10 min
- Fetch + extract: 10 min
- Synthesize: 5 min
- Total: ~30 min for a solid competitor map
