import { getMarketDataProvider } from "@/lib/market-data/mock-provider";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { symbol: string };
}): Promise<Metadata> {
  const symbol = params.symbol.toUpperCase();
  return {
    title: `${symbol} Share Price Today | ASX`,
    description: `Live-tracked ${symbol} share price, chart, statistics and news on the ASX.`,
  };
}

export default async function StockPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();
  const provider = getMarketDataProvider();
  const [quote, fundamentals] = await Promise.all([
    provider.getQuote(symbol),
    provider.getFundamentals(symbol),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">{symbol}</h1>
          <p className="text-sm text-slate-500">ASX · Australian Securities Exchange</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">{quote?.value.toFixed(2) ?? "—"}</p>
          <p className={quote && quote.change >= 0 ? "text-brand-green" : "text-brand-red"}>
            {quote?.change.toFixed(2)} ({quote?.changePct.toFixed(2)}%)
          </p>
          <p className="text-[11px] uppercase text-slate-400">
            {quote?.status ?? "unavailable"} · source: {quote?.source ?? "—"}
          </p>
        </div>
      </header>

      {/* Chart placeholder — wire up TradingView Lightweight Charts in Phase 2 */}
      <div className="mt-6 h-72 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-sm text-slate-400">
        Historical chart (1D / 5D / 1M / 3M / 6M / YTD / 1Y / 5Y / MAX) — Phase 2
      </div>

      <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Market Cap" value={fundamentals?.marketCap} />
        <Stat label="P/E" value={fundamentals?.peRatio} />
        <Stat label="EPS" value={fundamentals?.eps} />
        <Stat label="Dividend Yield" value={fundamentals?.dividendYield} suffix="%" />
        <Stat label="52W High" value={fundamentals?.week52High} />
        <Stat label="52W Low" value={fundamentals?.week52Low} />
        <Stat label="Avg Volume" value={fundamentals?.avgVolume} />
      </section>

      <section className="mt-10 rounded-lg border border-slate-200 p-5">
        <p className="text-sm text-slate-700">
          Looking for a platform to trade ASX shares?
        </p>
        <a
          href="/compare/share-trading-platforms"
          className="mt-2 inline-block rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white"
        >
          Compare Platforms
        </a>
      </section>
    </div>
  );
}

function Stat({ label, value, suffix = "" }: { label: string; value?: number; suffix?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-navy-900">
        {value !== undefined ? `${value}${suffix}` : "Not verified"}
      </p>
    </div>
  );
}
