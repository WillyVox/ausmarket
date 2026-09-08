# Australian Market Intelligence + Trading Platform Comparison

Phase 4 (Commercial Engine) slice, building on Phases 1–3. See
`docs/roadmap.md` for the full phase plan and
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

## What's in this slice (Phase 4 — Commercial Engine)

Building on Phase 3 (SEO engine + static comparison data), this pass
moves the comparison content into the database and wires up real
click tracking:

- **Schema**: extended `Broker` with the fields the app actually
  renders (`category`, `pros`, `considerations`, `sources`,
  `feesSummary`, `affiliateSlug`); made `lastVerifiedAt` and
  `minimumDeposit` nullable so "Not verified" is a real null value,
  never a fabricated date/figure; made the unused structured
  `fees`/`brokerage` Json fields optional so seeding doesn't require
  inventing fake structured data. Added a new `Exchange` model —
  there wasn't one before, exchanges only ever lived in the static
  array.
- **Decoupled `AffiliateClick` from `AffiliatePartner`**: real
  partner content now lives in `Broker`/`Exchange`, two separate
  tables with no clean single foreign key between them, so
  `AffiliateClick` stores a plain `partnerType` + `partnerSlug` pair
  instead of a relation. `AffiliatePartner` is left in the schema,
  unused, in case a future phase wants one consolidated partner table
  — see `docs/compliance-flags.md` item 8.
- **`prisma/seed.ts`**: loads the exact static broker/exchange content
  (moved from `src/lib/brokers/data.ts` to
  `src/lib/brokers/static-data.ts`) into the database via upsert — no
  figures changed, just a new home for them. Run with `npm run
  db:seed` (uses `tsx`, added as a dev dependency).
- **`src/lib/brokers/repository.ts`**: the only module allowed to
  query `Broker`/`Exchange`/`AffiliateClick` directly. Every page that
  used to import the static arrays now calls this instead — same
  fail-open-to-a-labelled-fallback pattern as `src/lib/market-data`:
  queries Prisma first, falls back to the bundled static content if
  the database is unreachable or not yet seeded. A reachable, seeded
  database that genuinely has no row for a slug still returns a real
  404 — the fallback only covers "can't reach the DB" or "table is
  empty," never masks a genuine missing record.
- **`/go/[partner]`** now resolves partners via the repository and
  writes a real `AffiliateClick` row on every redirect
  (fire-and-forget — a failed write never blocks or breaks the
  redirect to the provider).
- **`/methodology`** now renders a live "Transparency Snapshot"
  (platform counts, verified-entry counts, active affiliate link
  counts, affiliate clicks in the last 30 days), computed from the
  repository on every request rather than written as static prose. It
  also honestly reports when it's showing fallback data instead of
  the live database.

**Not yet built in Phase 4**: real, legally-reviewed fee/feature data
(every `lastVerifiedAt` is still `null` on purpose), expanding the
broker/exchange list, an actual scoring algorithm (today's
methodology page is descriptive + transparency counts, not a computed
score), and an admin UI for editing rows without touching the seed
file. See `docs/roadmap.md`.

## What's deliberately NOT in this slice

Real historical charts, top gainers/losers/movers data, news
ingestion, the full programmatic stock/forex/crypto template set
beyond the current popular-stocks list, FAQ schema on tool pages, and
everything in Phase 5 onward: auth/watchlists, admin CMS, analytics
wiring, ad placements. See `docs/roadmap.md`.

## Running it

This scaffold isn't `npm install`-able as-is in this environment (no
network access here to pull dependencies) — it's meant to be dropped
into a repo, then:

```
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Without a running `DATABASE_URL`, the app still works — every broker/
exchange page falls back to the bundled static content automatically
and logs a warning explaining why (see `src/lib/brokers/repository.ts`).

Because of the lack of network access in this environment, this
session's changes were reviewed manually (brace/paren balance across
every new/edited file, every internal `href` traced against an actual
route, every import path checked for the old `@/lib/brokers/data`
path) rather than machine-verified — run `npm run typecheck && npm
run lint` yourself before trusting it fully, and specifically test:
`/go/[an affiliate slug from static-data.ts]` redirects correctly,
`/methodology` renders without a database configured, and `npm run
db:seed` completes against a real Postgres instance.

# Step by step to run the app locally

1. Set up local DB (with Docker)

2. npm i

3. npx prisma migrate dev --name init

4. npm run dev