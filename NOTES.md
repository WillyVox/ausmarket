Still deliberately stubbed (flagged in-page where relevant): historical charts, real news/economic-calendar data, the other 7 calculators, auth/watchlists, and the actual broker/comparison scoring engine — that's Phase 3–4 territory.

One thing worth deciding before going further: do you want me to keep building breadth (more tool calculators, the full comparison engine with real broker data) or depth (wire up one real data source — e.g. CoinGecko for crypto, since it's free and keyless — end-to-end so at least one vertical isn't mock data)? I'd lean toward the latter since it de-risks the biggest unknown (data provider integration) early, but it's your call.


Next: wire up a real, free forex source the same way — Frankfurter (ECB reference rates, free, keyless, no rate-limit surprises). One honesty wrinkle to handle properly first: Frankfurter only gives a mid rate, not real bid/ask/spread — so rather than fabricating a spread, I'll adjust the data model to show "Not verified" for fields we genuinely don't have, per the spec's own rule.

