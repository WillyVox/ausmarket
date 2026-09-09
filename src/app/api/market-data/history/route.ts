import { NextResponse } from "next/server";
import { z } from "zod";
import { getMarketDataProvider } from "@/lib/market-data";
import { isHistoricalRange } from "@/lib/market-data/ranges";

// Read-only, public, cacheable — this only ever proxies to
// MarketDataProvider.getHistoricalPrices, never a direct vendor call,
// so it inherits the same fail-closed/never-fabricate behaviour. Used
// by <PriceChart> to refetch when the visitor picks a different range
// without re-rendering the whole page.

const QuerySchema = z.object({
  symbol: z.string().min(1).max(20),
  range: z.string().refine(isHistoricalRange, "Unsupported range"),
  market: z.enum(["STOCK", "FOREX", "CRYPTO"]),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    symbol: url.searchParams.get("symbol") ?? "",
    range: url.searchParams.get("range") ?? "",
    market: url.searchParams.get("market") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", details: parsed.error.flatten() }, { status: 400 });
  }

  const { symbol, range, market } = parsed.data;
  const provider = getMarketDataProvider();
  const points = await provider.getHistoricalPrices(symbol, range, market);

  return NextResponse.json(
    { points },
    {
      headers: {
        // Same 60s-ish freshness window the underlying quote fetches use.
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    }
  );
}