import { getMarketDataProvider } from "@/lib/market-data";
import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { PriceChart } from "@/components/charts/price-chart";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol } = await params;
  const symbolUpper = symbol.toUpperCase();
  return {
    title: `${symbolUpper} Share Price Today | ASX`,
    description: `Live-tracked ${symbolUpper} share price, chart, statistics and news on the ASX.`,
  };
}

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const symbolUpper = symbol.toUpperCase();
  const provider = getMarketDataProvider();
  const [quote, fundamentals, history, news] = await Promise.all([
    provider.getQuote(symbolUpper),
    provider.getFundamentals(symbolUpper),
    provider.getHistoricalPrices(symbolUpper, "3M", "STOCK"),
    provider.getNews({ symbol: symbolUpper, limit: 3 }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">{symbolUpper}</h1>
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

      <div className="mt-6">
        <PriceChart
          symbol={symbolUpper}
          market="STOCK"
          initialRange="3M"
          initialPoints={history}
          decimals={2}
          valuePrefix="$"
        />
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

      <AdSlot placement="stock_sidebar" />

      {news.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-navy-900">Related News</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {news.map((item) => (
              <li key={item.slug} className="py-3">
                <a href={item.sourceUrl} className="text-sm font-medium text-navy-900 hover:underline">
                  {item.headline}
                </a>
                <p className="mt-1 text-xs text-slate-400">
                  {item.source} · {new Date(item.publishedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

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