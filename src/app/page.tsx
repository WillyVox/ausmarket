import { getMarketDataProvider } from "@/lib/market-data/mock-provider";
import type { Quote } from "@/lib/market-data/provider";

export default async function HomePage() {
  const provider = getMarketDataProvider();
  const [asx200, allOrds, audUsd, btc] = await Promise.all([
    provider.getIndex("XJO"),
    provider.getIndex("XAO"),
    provider.getForexRate("AUDUSD"),
    provider.getCryptoPrice("BTC"),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section>
        <h1 className="text-2xl font-semibold text-navy-900">Market Snapshot</h1>
        <p className="mt-1 text-sm text-slate-500">
          Free, transparent Australian market data.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <SnapshotCard label="ASX 200" value={asx200?.value} change={asx200?.changePct} status={asx200?.status} />
          <SnapshotCard label="All Ordinaries" value={allOrds?.value} change={allOrds?.changePct} status={allOrds?.status} />
          <SnapshotCard label="AUD/USD" value={audUsd?.bid} status={audUsd?.status} />
          <SnapshotCard label="Bitcoin (AUD)" value={btc?.priceAud} change={btc?.change24h} status={btc?.status} />
        </div>
      </section>

      <section className="mt-14 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-navy-900">Australian Market</h2>
          <p className="mt-2 text-sm text-slate-600">
            ASX 200 overview, top gainers/losers, sector performance —
            wired to the market-data provider abstraction once a real
            feed is configured.
          </p>
          <a href="/markets/asx-200" className="mt-3 inline-block text-sm font-medium text-brand-blue">
            View ASX 200 →
          </a>
        </div>
        <div className="rounded-lg border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-navy-900">
            Compare Australian Trading Platforms
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Compare platforms by products, pricing, features and market
            access — with sourced, dated claims and a public methodology.
          </p>
          <a
            href="/compare/brokers"
            className="mt-3 inline-block rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white"
          >
            Compare Platforms
          </a>
        </div>
      </section>
    </div>
  );
}

function SnapshotCard({
  label,
  value,
  change,
  status,
}: {
  label: string;
  value?: number;
  change?: number;
  status?: Quote["status"];
}) {
  const positive = (change ?? 0) >= 0;
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-navy-900">
        {value !== undefined ? value.toLocaleString() : "—"}
      </p>
      {change !== undefined && (
        <p className={positive ? "text-sm text-brand-green" : "text-sm text-brand-red"}>
          {positive ? "+" : ""}
          {change.toFixed(2)}%
        </p>
      )}
      <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
        {status ?? "unavailable"}
      </p>
    </div>
  );
}
