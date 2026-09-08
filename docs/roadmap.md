# Implementation Roadmap

## Phase 1 — Foundation (this slice)
Project architecture, design system baseline, database schema,
homepage, ASX/stocks/forex/crypto route skeletons, responsive layout.

## Phase 2 — Market Intelligence
Real stock/forex/crypto pages wired to a live provider, charts
(TradingView Lightweight Charts), historical data, news ingestion,
economic calendar, global search, first education articles.

## Phase 3 — SEO Engine
Metadata + OpenGraph + JSON-LD templates, sitemap.xml/robots.txt,
internal linking system, programmatic page templates for
stocks/forex/crypto with real content guardrails (no thin pages),
first batch of tools (compound interest, currency converter, etc).

## Phase 4 — Commercial Engine
Broker + exchange database population, comparison engine (2–4 way
compare), scoring methodology page, affiliate partner records,
`/go/[partner]` redirect + click tracking, contextual CTAs.

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
