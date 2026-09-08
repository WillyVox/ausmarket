# Australian Market Intelligence + Trading Platform Comparison

Phase 1 (Foundation) scaffold. This is the first slice of a much larger
build — see `docs/roadmap.md` for the full phase plan and
`docs/compliance-flags.md` for items that need legal sign-off before
launch.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL
- Zod for validation
- Market data behind a provider abstraction (`src/lib/market-data`) —
  no real feed is wired up yet; `MockMarketDataProvider` returns
  clearly-labelled sample data with `status: "UNAVAILABLE"` semantics
  so nothing masquerades as live.

## Live data status

- **Crypto (BTC, ETH, SOL, XRP, BNB): LIVE**, via CoinGecko's free
  keyless API (`src/lib/market-data/coingecko-provider.ts`), fetched
  through `CompositeMarketDataProvider` (`src/lib/market-data/index.ts`).
  Revalidated every 60s. Falls back to the labelled mock if CoinGecko
  errors or rate-limits — never fabricates a price.
- **Forex (major pairs among AUD/USD/JPY/NZD/EUR/GBP/CAD/CHF/CNY/HKD/SGD):
  LIVE mid rate**, via Frankfurter's free keyless API
  (`src/lib/market-data/frankfurter-provider.ts`), backed by ECB
  reference rates — updated once per business day, so it's genuinely
  `DELAYED`, not `LIVE`, and labelled that way. Only the mid rate is
  real; bid/ask/high/low are shown as "Not verified" rather than
  invented, since Frankfurter doesn't expose a dealing spread.
- **ASX stocks (`/stocks/[symbol]`): LIVE if configured, mock
  otherwise.** Set `TWELVE_DATA_API_KEY` in `.env` (free tier at
  twelvedata.com) to enable — see `src/lib/market-data/twelvedata-provider.ts`.
  **This is a development stopgap, not the licensed ASX feed the
  original spec calls for** — see docs/compliance-flags.md item 2
  before relying on it beyond local testing. Indices (ASX 200, All
  Ordinaries) are still mock regardless.

## What's in this slice (Phase 3 — SEO Engine + Comparison Data Layer)

Building on Phase 1 (foundation) and Phase 2 (live crypto/forex/stock
data), this pass:

- Fixed two route gaps found during Phase 2 testing:
  - `/stocks` was 404ing (no index page) — added a search + popular-
    stocks index at `src/app/stocks/page.tsx`, backed by
    `src/lib/stocks/data.ts`, and a matching search box on the homepage.
  - `/compare`, `/compare/share-trading-platforms`,
    `/compare/forex-platforms` and `/compare/crypto-exchanges` were
    linked from CTAs across the site but didn't exist — all four now
    exist, alongside a refactored `/compare/brokers`.
- Added a shared comparison data layer, `src/lib/brokers/data.ts`
  (`BROKERS`, `EXCHANGES`) — every `/compare/*`, `/brokers/[slug]`,
  `/exchanges/[slug]` page and the `/go/[partner]` redirect now read
  from this one module instead of duplicated hardcoded rows.
  **All figures in it are placeholders pending legal/editorial
  review** — see `docs/compliance-flags.md` item 7.
- Added `/brokers/[slug]` and `/exchanges/[slug]` detail pages:
  overview, fees, platform features, pros/considerations, regulatory
  info, sources, and alternatives — not thin affiliate landers.
- Found the same "linked but not built" pattern in two more places
  and fixed both: `/learn/[slug]` was missing 3 of the 5 articles the
  `/learn` index links to (all 5 now have real, neutral,
  Australia-specific content), and `/tools` linked to 5 calculators
  that didn't exist (added real compound-interest and
  inflation calculators; the rest now show an honest "coming soon"
  page instead of a dead link).
- SEO technical layer: `sitemap.ts`, `robots.ts`, `metadataBase` +
  OpenGraph/Twitter defaults on the root layout, Organization +
  WebSite JSON-LD site-wide, Article JSON-LD on learn pages.
- Cross-linking between learn articles, tools, and comparison pages.

## What's deliberately NOT in this slice

Real historical charts, top gainers/losers/movers data, news
ingestion, the full programmatic stock/forex/crypto template set
beyond the current popular-stocks list, FAQ schema on tool pages, and
everything in Phase 4 onward: moving broker/exchange data into
Prisma, real affiliate click storage, the public `/methodology`
scoring writeup, auth/watchlists, admin CMS, analytics wiring, ad
placements. See `docs/roadmap.md`.

## Running it

This scaffold isn't `npm install`-able as-is in this environment (no
network access here to pull dependencies) — it's meant to be dropped
into a repo, then `npm install && npx prisma migrate dev && npm run dev`.
Because of that, this session's changes were reviewed manually
(brace/paren balance across every new file, every internal `href`
traced against an actual route) rather than machine-verified — run
`npm run typecheck && npm run lint` yourself before trusting it fully.


# Step by step to run the app locally

1. Set up local DB (with Docker)

2. npm i

3. npx prisma migrate dev --name init

4. npm run dev