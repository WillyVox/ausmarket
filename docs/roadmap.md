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

## Phase 4 — Commercial Engine ✅ (this slice)
- Schema: extended `Broker` with the fields the app actually renders
  (`category`, `pros`, `considerations`, `sources`, `feesSummary`,
  `affiliateSlug`), made `lastVerifiedAt` and `minimumDeposit`
  nullable (never fabricate a date or figure — null renders as "Not
  verified"), and made the unused structured `fees`/`brokerage` Json
  fields optional rather than forcing fake data at seed time. Added a
  new `Exchange` model — there wasn't one before; exchanges only ever
  lived in the static array.
- Decoupled `AffiliateClick` from `AffiliatePartner`: real partner
  content lives in `Broker`/`Exchange` now, two separate tables with
  no clean single FK between them, so `AffiliateClick` stores a plain
  `partnerType` + `partnerSlug` pair instead. `AffiliatePartner`
  itself is left in the schema (unused) rather than dropped, in case
  a future phase wants one consolidated partner table.
- `prisma/seed.ts` loads the exact static broker/exchange content
  (renamed to `src/lib/brokers/static-data.ts`) into the database via
  upsert — no figures changed, just a new home for them. Run with
  `npm run db:seed`.
- `src/lib/brokers/repository.ts` is now the only module allowed to
  query `Broker`/`Exchange`/`AffiliateClick` directly. Every page that
  used to import the static arrays now calls this instead. It queries
  Prisma first and falls back to the bundled static content if the
  database is unreachable or not yet seeded — the same
  fail-open-to-a-labelled-fallback pattern as `src/lib/market-data`.
  A reachable, seeded database that genuinely has no row for a slug
  still 404s correctly; the fallback only covers "can't reach the DB
  at all" or "table is empty."
- `/go/[partner]` now resolves partners via the repository and writes
  a real `AffiliateClick` row on every redirect (fire-and-forget,
  never blocks or fails the redirect if the write fails).
- `/methodology` now renders a live "Transparency Snapshot" — platform
  counts, how many have a verified check, active affiliate link
  counts, and affiliate clicks in the last 30 days — computed from the
  repository on every request (`export const dynamic =
  "force-dynamic"`), not hand-written prose. It also honestly reports
  when it's showing fallback data instead of the database.

**Not yet built in Phase 4** (left for later phases): populating real,
legally-reviewed fee/feature data (every `lastVerifiedAt` is still
null on purpose — see `docs/compliance-flags.md` item 7), expanding
the broker/exchange list, an actual scoring algorithm (methodology
today is descriptive + transparency counts, not a computed score),
and an admin UI for editing `Broker`/`Exchange` rows without touching
the seed file directly.

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