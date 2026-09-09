# Compliance / Legal Review Flags

These are areas the spec correctly identifies as needing care, plus a
few worth calling out explicitly. **None of this is legal advice** —
flagging so a qualified Australian financial-services lawyer reviews
before launch.

1. **General advice vs. personal advice.** Comparison tables, "scores",
   and phrases like "things to consider" can drift into implied
   recommendation if not carefully worded and disclaimed. Under
   Australian law, providing financial product advice may require an
   Australian Financial Services Licence (AFSL) or authorisation under
   one. A general-advice warning alone does not resolve this — the
   substance of the content matters, not just the label.

2. **ASX market data licensing.** ASX (and most other exchange/price
   data) is licensed, not freely redistributable, even for data that
   is publicly viewable elsewhere. The scaffold treats this as
   `ASX_DATA_PROVIDER` / `ASX_DATA_API_KEY` config — actually going
   live requires a commercial data agreement.

   **Interim state (added this session):** `/stocks/[symbol]` can
   optionally pull live-ish quotes from Twelve Data's free tier
   (`TWELVE_DATA_API_KEY` in `.env`) for local development and low
   traffic. This is explicitly a stopgap, not the licensed feed the
   spec calls for — Twelve Data's own redistribution terms need to be
   checked against actual traffic before this is relied on beyond
   development/testing. Leaving the key unset falls back to mock data
   automatically, so nothing breaks either way.

3. **Affiliate disclosure adequacy.** ASIC and ACCC both have views on
   what counts as adequate disclosure of commercial relationships,
   especially where ranking or "best of" language is used. Disclosure
   needs to be prominent and specific, not just present.

4. **"Comparison" claims and comparator-site style regulation.**
   Sites that compare financial products can attract additional
   scrutiny (there's a history of ASIC action against comparison
   sites for undisclosed commercial bias). The methodology
   commitment ("commission must not determine ranking") needs to be
   independently auditable, not just stated.

5. **Crypto content.** Spot crypto is not currently ASX-regulated the
   same way as securities, but exchange comparisons and any implied
   endorsement still carry consumer-protection risk. Keep risk
   warnings prominent, as the spec requires.

6. **Data privacy.** Standard Australian Privacy Act obligations apply
   once accounts/watchlists collect personal information — a Privacy
   Policy that matches actual data practices (not a template) will be
   needed before Phase 5.

7. **Placeholder comparison data.** The broker and exchange records in
   `src/lib/brokers/static-data.ts` (seeded into the `Broker`/
   `Exchange` tables by `prisma/seed.ts`) — including fee summaries,
   features, pros/considerations, and regulatory descriptions — are
   illustrative placeholders written to establish the page structure,
   not verified current facts. Every `lastVerifiedAt` is deliberately
   `null` (renders as "Not verified") for this reason, in both the
   database and the fallback copy. Before any `/brokers/[slug]`,
   `/exchanges/[slug]`, or `/compare/*` page goes live, each factual
   claim needs to be checked against the provider's current published
   terms, dated, and sourced — not just carried over from this
   scaffold. Moving this content into Prisma (Phase 4) did not change
   its verification status; don't treat "now in the database" as
   "now verified."

8. **AffiliatePartner model is unused.** `AffiliatePartner` was
   scaffolded in Phase 1 before `Broker`/`Exchange` existed. It's left
   in the schema in case a future phase wants one consolidated partner
   table across categories, but nothing currently reads or writes it
   — real partner content and the `/go/[partner]` redirect both use
   `Broker`/`Exchange` via `src/lib/brokers/repository.ts`. If a future
   phase decides to actually use `AffiliatePartner`, reconcile it with
   `Broker`/`Exchange` rather than running three partner tables at
   once.

9. **`/methodology`'s "Transparency Snapshot" is descriptive, not a
   score.** The live counts on that page (platforms tracked, verified
   entries, active affiliate links, clicks) are accurate at the moment
   they're rendered, but they are not a scoring algorithm — the page
   still says so explicitly ("LEGAL REVIEW REQUIRED... the actual
   scoring process needs to be built"). Don't let the presence of real
   numbers be read as "the methodology is now implemented."

10. **Seeded sponsored content is a placeholder.** `prisma/seed.ts`
    creates one sponsored `Article` row
    (`example-sponsored-post-placeholder`) purely to prove the
    `/sponsored` rendering path end-to-end. Its title and sponsor name
    say "placeholder" explicitly, but it is still live/published by
    default once seeded. **Unpublish or delete it via
    `/admin/sponsored` before any real launch** — leaving fictional
    sponsor content published, even clearly labelled as a placeholder,
    is not something a production site should ship with.

11. **House ads are self-promotion only — no ad network is connected.**
    `AdPlacement.provider: "house"` is the only value
    `src/components/ads/ad-slot.tsx` currently renders, and it always
    points at AusMarket's own pages (e.g. `/compare/brokers`), never a
    third-party creative. There is no AdSense/GAM/other network
    account, script, or consent-management wiring in this codebase.
    Adding a real ad network is a distinct piece of work requiring its
    own privacy-policy and cookie-consent updates (see item 6) before
    it ships, not just a new `provider` string.

12. **Admin bootstrap has no audit trail yet.** `scripts/set-admin.ts`
    grants `ADMIN` directly against the database with no logging,
    approval step, or notification. `AuditLog` exists in the schema
    but nothing writes to it yet, including admin actions taken via
    `/admin/ads` and `/admin/sponsored` (toggling an ad, publishing a
    sponsored post). Before this app has more than one trusted
    operator, admin actions should be written to `AuditLog` — this is
    flagged as an operational/security gap, not just a legal one.

13. **No revenue, conversion, or CTR data exists anywhere in the app.**
    `/admin/affiliate` reports these as "Unavailable" rather than
    computing them from click counts alone, and that is a deliberate,
    permanent stance until real data sources exist — not a placeholder
    to remove later without first connecting: (a) a payout/postback
    integration per affiliate partner for revenue/conversions, and (b)
    page-view tracking for CTR. Fabricating any of these three from
    click data alone would materially misrepresent business
    performance — the same category of risk as fabricating market
    prices or verification dates elsewhere in this app.