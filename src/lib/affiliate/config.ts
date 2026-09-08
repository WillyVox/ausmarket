// Affiliate URLs must never be hardcoded in components. Everything
// resolves through this module, which in production reads from the
// AffiliatePartner table (see prisma/schema.prisma). The allowlist
// below is a defence-in-depth check on TOP of the database lookup —
// even a compromised/misconfigured DB row can't redirect off-list.

export const AFFILIATE_DOMAIN_ALLOWLIST: readonly string[] = [
  "cmcmarkets.com",
  "commsec.com.au",
  "hellostake.com",
  "selfwealth.com.au",
  "pearler.com",
  "interactivebrokers.com",
  "webull.com.au",
  "binance.com",
  "coinspot.com.au",
  "independentreserve.com",
  "swyftx.com",
];

export function isAllowlistedAffiliateUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") return false;
    return AFFILIATE_DOMAIN_ALLOWLIST.some(
      (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}
