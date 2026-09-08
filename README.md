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

## What's in this slice

- Project scaffold (`package.json`, `tsconfig.json`, Tailwind config)
- Full Prisma schema for every model in the spec (stocks, forex,
  crypto, news, brokers, affiliate partners/clicks, ads, articles,
  users/watchlists, audit log)
- Homepage with a market snapshot section wired to the provider
  abstraction (mock data, clearly labelled)
- One programmatic stock page template (`/stocks/[symbol]`)
- Compare landing page skeleton (`/compare/brokers`)
- Affiliate redirect route (`/go/[partner]`) with a domain allowlist,
  click logging stub, and open-redirect protection
- Trust/compliance pages: `/disclaimer`, `/affiliate-disclosure`,
  `/how-we-make-money`
- Affiliate + market-data config abstractions (no hardcoded links in
  components — everything reads from `AffiliatePartner` records)

## What's deliberately NOT in this slice

Everything in Phases 2–7 of the roadmap: real data provider
integration, charts, economic calendar, search, education content,
the full comparison engine and scoring methodology, auth/watchlists,
admin CMS, analytics wiring, ad placements. Building all of that in
one pass would produce shallow, unreviewed code across a dozen
subsystems — better to harden each phase before moving to the next,
per the spec's own "development workflow" section.

## Running it

This scaffold isn't `npm install`-able as-is in this environment (no
network access here to pull dependencies) — it's meant to be dropped
into a repo, then `npm install && npx prisma migrate dev && npm run dev`.

# Step by step to run the app locally

1. Set up local DB (with Docker)

2. npm i

3. npx prisma migrate dev --name init

4. npm run dev