import type { ForexRate } from "./provider";

// Real, live implementation for forex mid rates via Frankfurter
// (https://frankfurter.dev) — free, keyless, backed by ECB reference
// rates. ECB rates update once per business day (~16:00 CET), so this
// is genuinely "DELAYED" relative to live dealing rates, and is
// labelled that way rather than as "LIVE".
//
// Frankfurter only exposes a mid rate, not bid/ask/spread — so this
// provider only ever returns `mid`, leaving bid/ask/high/low
// undefined rather than inventing a spread. See ForexRate in
// provider.ts.
//
// Fails closed: any network error, bad status, or unexpected shape
// returns null. Callers already render "Not verified" / "—" for a
// null result.

function splitPair(pair: string): { base: string; quote: string } | null {
  const clean = pair.toUpperCase().replace("/", "");
  if (clean.length !== 6) return null;
  return { base: clean.slice(0, 3), quote: clean.slice(3) };
}

function isoDateDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

async function fetchRateOn(date: "latest" | string, base: string, quote: string): Promise<number | null> {
  const url = new URL(`https://api.frankfurter.dev/v1/${date}`);
  url.searchParams.set("base", base);
  url.searchParams.set("symbols", quote);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const data = (await res.json()) as { rates?: Record<string, number> };
  return data.rates?.[quote] ?? null;
}

export async function fetchFrankfurterRate(pair: string): Promise<ForexRate | null> {
  const split = splitPair(pair);
  if (!split) return null;
  const { base, quote } = split;

  try {
    const latest = await fetchRateOn("latest", base, quote);
    if (latest === null) return null;

    // Best-effort change calc vs ~3 days prior (covers weekends);
    // if it fails we still return the live mid rate with change
    // omitted rather than failing the whole request.
    let change: number | undefined;
    let changePct: number | undefined;
    try {
      const prior = await fetchRateOn(isoDateDaysAgo(3), base, quote);
      if (prior !== null && prior !== 0) {
        change = latest - prior;
        changePct = (change / prior) * 100;
      }
    } catch {
      // change stays undefined — not fatal
    }

    return {
      value: latest,
      mid: latest,
      change: change ?? 0,
      changePct,
      timestamp: new Date().toISOString(),
      source: "Frankfurter (ECB reference rates)",
      market: "FOREX",
      asset: `${base}${quote}`,
      status: "DELAYED",
    };
  } catch (err) {
    console.error(`[frankfurter] fetch failed for ${pair}`, err);
    return null;
  }
}

const FRANKFURTER_SUPPORTED_CURRENCIES = new Set([
  "AUD", "USD", "JPY", "NZD", "EUR", "GBP", "CAD", "CHF", "CNY", "HKD", "SGD",
]);

export function isFrankfurterSupported(pair: string): boolean {
  const split = splitPair(pair);
  if (!split) return false;
  return (
    FRANKFURTER_SUPPORTED_CURRENCIES.has(split.base) &&
    FRANKFURTER_SUPPORTED_CURRENCIES.has(split.quote)
  );
}