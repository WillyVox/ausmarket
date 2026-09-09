# Complete Product Verification & Testing Guide

| Feature Area | Target URL(s) | Expected Behavior & Verification Steps | Key Verification Check |
| --- | --- | --- | --- |
| **1. Market Data** | `/`<br>

<br>`/crypto`<br>

<br>`/forex`<br>

<br>`/forex/audusd`<br>

<br>`/stocks/bhp` | * **Crypto:** BTC/ETH show **LIVE** status using CoinGecko (prices update on refresh).<br>

<br>* **Forex:** Shows **DELAYED** status via Frankfurter (mid-rate real; bid/ask marked "Not verified").<br>

<br>* **Stocks:** Shows **LIVE** if `TWELVE_DATA_API_KEY` is set in `.env`; otherwise shows **UNAVAILABLE / mock**. | Live status indicators match data provider availability and API keys. |
| **2. Comparison Engine** | `/compare/brokers`<br>

<br>`/compare/crypto-exchanges`<br>

<br>`/brokers/cmc-markets`<br>

<br>`/exchanges/binance` | * Tables display **"Not verified"** in the *Last Verified* column (seeded as `null`).<br>

<br>* Detail pages display sources, pros, and considerations.<br>

<br>* **Fail-Open Test:** Stop Postgres container and reload `/compare/brokers`. Page should fall back to static data (`static-data.ts`) with a terminal warning log. Restart Postgres to resume DB delivery.<br>

<br>* **Click Tracking:** Click *Visit Provider*. Confirm redirect to vendor website, then verify a new row in `AffiliateClick` via Prisma Studio. | Data falls back gracefully without breaking UI; click events persist to database. |
| **3. Methodology** | `/methodology` | * Displays dynamic **"Transparency Snapshot"** metrics (total platforms tracked, verified entries, click counts over the past 30 days). | Metrics dynamically increment on page refresh after recording partner clicks. |
| **4. Auth & Retention** | `/register`<br>

<br>`/login`<br>

<br>`/watchlist`<br>

<br>`/learn/[slug]` | * Header switches from **"Sign in"** to **"Sign out"** post-authentication.<br>

<br>* Watchlist additions persist via `Watchlist` and `WatchlistItem` tables upon refresh.<br>

<br>* Saving articles creates a record in `SavedArticle`.<br>

<br>* Newsletter submissions persist to `NewsletterSubscriber`. | Session state and user interactions persist correctly across DB tables. |
| **5. Admin & Ad Ops** | `/admin`<br>

<br>`/admin/ads`<br>

<br>`/admin/sponsored`<br>

<br>`/admin/affiliate` | * **Access Control:** Unauthenticated users redirect to `/login`. Non-admin users receive a **404 page**.<br>

<br>* **Ad System:** Homepage displays labeled advertisement boxes; learn pages remain hidden (seeded inactive). Deactivating `homepage_middle` via `/admin/ads` immediately hides the homepage banner.<br>

<br>* **Sponsored Posts:** Displays seeded placeholder; detail views include a fixed amber disclosure banner.<br>

<br>* **Analytics:** `/admin/affiliate` tracks clicks by partner, placement, and device. Revenue, conversions, and CTR state **"Unavailable"** by design. | Dynamic layout toggles update without rebuilding; strict non-admin 404 boundaries. |
| **6. SEO Plumbing** | `/sitemap.xml`<br>

<br>`/robots.txt`<br>

<br>`/` | * `/sitemap.xml` indexes all brokers, exchanges, stocks, and sponsored posts.<br>

<br>* `/robots.txt` points to the active `/sitemap.xml` location.<br>

<br>* Page source on `/` includes structured `Organization` and `WebSite` JSON-LD tags. | Search engine crawlers can index dynamic entities and read valid JSON-LD schemas. |

---

### Database Inspection Command

To inspect tables directly without running SQL queries, open Prisma Studio:

```bash
npx prisma studio

```

> **Note:** Prisma Studio will open a Web UI at `http://localhost:5555`. You can directly examine rows inside `Broker`, `Exchange`, `AffiliateClick`, `AdPlacement`, `Article`, and `User` (to verify user role flags).

---

### Admin Setup Command

Promote an existing account to the administrator role before testing section 5:

```bash
npm run make:admin -- you@example.com

```

*Sign out and sign back in after running the command to apply updated JWT/session privileges.*