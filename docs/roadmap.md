# Implementation Roadmap

## Phase 1 — Foundation ✅
Project architecture, design system baseline, database schema,
homepage, ASX/stocks/forex/crypto route skeletons, responsive layout.

## Phase 2 — Market Intelligence ✅ (stocks flagged as stopgap)
Real crypto (CoinGecko), forex (Frankfurter/ECB) and stock (Twelve
Data, free-tier stopgap) quotes wired through the
`MarketDataProvider` abstraction, each honestly labelled LIVE /
DELAYED / UNAVAILABLE — never fabricated. Charts, full historical
data and news ingestion are still open (see "Not yet built" below).

## Phase 3 — SEO Engine ✅ (this slice)
- Fixed two route gaps found in Phase 2 testing: `/stocks` (index +
  search) and the missing `/compare/*` sub-pages
  (`/compare`, `/compare/share-trading-platforms`,
  `/compare/forex-platforms`, `/compare/crypto-exchanges`).
- Added a shared comparison data layer
  (`src/lib/brokers/data.ts` — `BROKERS` + `EXCHANGES`) so every
  `/compare/*` page and the `/go/[partner]` redirect read from one
  place instead of duplicated/hardcoded rows. All figures in it are
  explicitly placeholders pending legal/editorial verification — see
  `docs/compliance-flags.md`.
- Added `/brokers/[slug]` and `/exchanges/[slug]` detail pages
  (overview, fees, platform, pros/considerations, regulatory info,
  sources, alternatives) — not thin affiliate landers.
- Added `sitemap.xml`, `robots.txt`, `metadataBase` + OpenGraph/Twitter
  defaults, and Organization/WebSite JSON-LD site-wide; Article
  JSON-LD on `/learn/[slug]`.
- Filled the two content gaps that were causing 404s: `/learn/[slug]`
  now has all 5 articles the index page links to, and `/tools` now
  has real compound-interest and inflation calculators (plus honest
  "coming soon" pages for the rest, instead of dead links).
- Internal linking: learn articles now cross-link to related
  articles, tools and comparison pages; stock/forex/crypto pages
  already linked to comparisons from Phase 1–2.

**Not yet built in Phase 3** (left for Phase 4+ rather than rushed):
real historical charts, top gainers/losers/movers data, news
ingestion, full programmatic stock/forex/crypto page templates beyond
the popular-stocks list, FAQ schema on tool pages.

## Phase 4 — Commercial Engine (next)
Move `BROKERS`/`EXCHANGES` from the static data module into
Prisma-backed `Broker`/`AffiliatePartner` tables, populate real
(legally reviewed) fee/feature data with genuine `lastVerifiedAt`
dates, wire `/go/[partner]` and `recordClick` to the real
`AffiliateClick` table, build the public `/methodology` scoring
system referenced from every comparison page, and expand the broker
list beyond the current six/four.

## Phase 5 — Retention
Auth.js integration, watchlists, alerts, newsletter signup, saved
articles.

## Phase 6 — Monetization
Affiliate analytics dashboard, ad placements (clearly labelled),
sponsored content workflow, partner performance reporting (revenue
numbers only ever shown when a real data source backs them —
otherwise "Revenue data unavailable").

## Phase 7 — Scale
Caching (Redis), CDN tuning, additional data providers, security
hardening, monitoring, load testing toward 100k → 1M+ monthly
visitors.

Each phase should close with: typecheck, lint, tests, desktop +
mobile pass, SEO check, security check — before starting the next.
