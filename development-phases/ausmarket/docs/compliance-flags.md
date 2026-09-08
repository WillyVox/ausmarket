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
