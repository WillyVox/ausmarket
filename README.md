# Australian Market Intelligence + Trading Platform Comparison

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

## Phases

- Phase 1 - Foundation
- Phase 2 - Live crypto/forex/stock data
- Phase 3 — SEO Engine + Comparison Data Layer
- Phase 4 — Commercial Engine
- Phase 5 — Retention

## Phase 1 (Foundation) scaffold. 

This is the first slice of a much larger build — see docs/roadmap.md 
for the full phase plan and docs/compliance-flags.md for items that 
need legal sign-off before launch.

What's in this slice

Project scaffold (package.json, tsconfig.json, Tailwind config)
Full Prisma schema for every model in the spec (stocks, forex, 
crypto, news, brokers, affiliate partners/clicks, ads, articles, 
users/watchlists, audit log)
Homepage with a market snapshot section wired to the provider 
abstraction (crypto card is now live data)
One programmatic stock page template (/stocks/[symbol])
Compare landing page skeleton (/compare/brokers)
Affiliate redirect route (/go/[partner]) with a domain allowlist, 
click logging stub, and open-redirect protection
Trust/compliance pages: /disclaimer, /affiliate-disclosure, /how-we-get-paid
Affiliate + market-data config abstractions (no hardcoded 
links in components — everything reads from AffiliatePartner records)

## Phase 2 — Market Intelligence ✅ (stocks flagged as stopgap)

Real crypto (CoinGecko), forex (Frankfurter/ECB) and stock (Twelve
Data, free-tier stopgap) quotes wired through the
`MarketDataProvider` abstraction, each honestly labelled LIVE /
DELAYED / UNAVAILABLE — never fabricated. Charts, full historical
data and news ingestion are still open (see "Not yet built" below).


## Phase 3 — SEO Engine ✅ (this slice)

Metadata + OpenGraph + JSON-LD templates, sitemap.xml/robots.txt, 
internal linking system, programmatic page templates for stocks/
forex/crypto with real content guardrails (no thin pages), 
first batch of tools (compound interest, currency converter, etc).

# Phase 4 — Commercial Engine (next)

Broker + exchange database population, comparison engine (2–4 way compare), 
scoring methodology page, affiliate partner records, /go/[partner] 
redirect + click tracking, contextual CTAs.

Move BROKERS/EXCHANGES from the static data module into Prisma-backed 
Broker/AffiliatePartner tables, populate real (legally reviewed) 
fee/feature data with genuine lastVerifiedAt dates, wire /go/[partner] 
and recordClick to the real AffiliateClick table, build the public /methodology 
scoring system referenced from every comparison page, and expand 
the broker list beyond the current six/four.

# Phase 5 — Retention

Auth.js integration, watchlists, alerts, newsletter signup, saved articles.

## Phase 6 (Monetization) slice, building on Phases 1–5. See
`docs/roadmap.md` for the full phase plan and
`docs/compliance-flags.md` for items that need legal sign-off before
launch.

## What's in this slice (Phase 6 — Monetization)

Building on Phase 5 (auth, watchlists, alerts, saved articles,
newsletter), this pass adds an admin area and the three monetization
surfaces from the roadmap:

- **Admin access**: `User.role` (`USER`/`ADMIN`), checked by
  `requireAdmin()` (`src/lib/auth/admin.ts`) on every `/admin/*`
  route. There's no in-app way to grant the first admin — run
  `npm run make:admin -- you@example.com` against an already-registered
  account.
- **`/admin/affiliate`**: click analytics by partner/placement/device
  over 7/30/90/365-day windows. Revenue, conversions and CTR are
  always shown as "Unavailable" — there is no payout/postback
  integration or page-view tracking, and estimating them from click
  counts alone would be exactly the kind of fabricated number this
  project avoids everywhere else.
- **`/admin/ads`** + **`<AdSlot />`**: `AdPlacement` (unused since
  Phase 1) now has real creative fields. Only `provider: "house"`
  (self-promotion, e.g. linking to `/compare/brokers`) renders
  anything — no third-party ad network is connected. Wired into the
  homepage, `/learn/[slug]`, `/stocks/[symbol]`, and a mobile-only
  sticky slot.
- **`/admin/sponsored`** + **`/sponsored`**: a genuine sponsored-content
  workflow on top of the `Article` model (scaffolded in Phase 1,
  unused until now). Every `/sponsored/[slug]` page carries a
  disclosure banner that's hardcoded into the template, not a
  per-post toggle. Seeded with one clearly-labelled placeholder post
  — **unpublish or delete it before launch** (see
  `docs/compliance-flags.md` item 10).

Also fixed in this pass: a stray debug `console.log` left in
`getBrokerBySlug` from earlier work.

**Not yet built in Phase 6**: a real ad network integration, a
payout/postback pipeline, page-view tracking, `AuditLog` writes for
admin actions, and an in-app edit form for ad creative (currently via
`prisma/seed.ts` or the database directly). See `docs/roadmap.md`.

## Admin setup

```
npm run db:seed              # also seeds AdPlacement rows + one placeholder sponsored post
# register a normal account at /register, then:
npm run make:admin -- you@example.com
# sign out and back in — role is baked into the JWT at sign-in
```

## What's in Phase 4 (Commercial Engine) — still current, unchanged this slice

Building on Phase 3 (SEO engine + static comparison data), Phase 4
moved the comparison content into the database and wired up real
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
beyond the current popular-stocks list, FAQ schema on tool pages, a
real ad network integration, payout/conversion tracking, and
everything in Phase 7 (caching, CDN, additional data providers,
security hardening, monitoring, load testing). See `docs/roadmap.md`.

## Running it

This scaffold isn't `npm install`-able as-is in this environment (no
network access here to pull dependencies) — it's meant to be dropped
into a repo, then:

```
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Without a running `DATABASE_URL`, the app still works for
brokers/exchanges/methodology — they fall back to bundled static
content automatically and log a warning explaining why. Auth, ads,
sponsored content and analytics genuinely need a database, though —
there's no static fallback for those (fabricating an ad, a sponsored
post, or a user session would be a very different kind of problem
than falling back to labelled sample market data).

The Phase 6 migration (`prisma/migrations/20260909061500_phase6_monetization`)
was hand-authored in this sandbox with no `DATABASE_URL`/network
access, same as the Phase 4 migration before it — run
`npx prisma migrate dev` locally and let Prisma reconcile/regenerate
it against your actual schema drift before trusting it against a real
database.

Because of that same lack of network access, this session's changes
were reviewed manually (brace/paren balance, every new import path
checked, every internal `href` traced against an actual route) rather
than machine-verified — run `npm run typecheck && npm run lint`
yourself before trusting it fully. Specifically test:
`/admin` (redirects to `/login` signed out, 404s for a signed-in
non-admin, works after `make:admin`), `/admin/ads` toggle actually
flips what `/` and `/learn/[slug]` render, `/admin/sponsored` publish
flow round-trips to `/sponsored/[slug]`, and
`npm run db:seed` completes against a real Postgres instance.

# Step by step to run the app locally
- Set up local DB (with Docker)
- `npm i`
- `npx prisma migrate dev`
- `npm run db:seed`
- `npm run dev`
- Register an account at `/register`, then in another terminal:
   `npm run make:admin -- you@example.com`, then sign out/in on the
   site to pick up the new role and visit `/admin`.