import { getMarketDataProvider } from "@/lib/market-data/mock-provider";

export const metadata = { title: "Australian Markets" };

export default async function MarketsPage() {
  const provider = getMarketDataProvider();
  const [asx200, allOrds] = await Promise.all([
    provider.getIndex("XJO"),
    provider.getIndex("XAO"),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Australian Markets</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <IndexCard name="ASX 200" href="/markets/asx-200" value={asx200?.value} change={asx200?.changePct} status={asx200?.status} />
        <IndexCard name="All Ordinaries" href="/markets/all-ordinaries" value={allOrds?.value} change={allOrds?.changePct} status={allOrds?.status} />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Placeholder title="Top Gainers" />
        <Placeholder title="Top Losers" />
        <Placeholder title="Most Active" />
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Movers, sector performance and breadth data land in Phase 2 once
        a real market data feed is connected.
      </p>
    </div>
  );
}

function IndexCard({
  name,
  href,
  value,
  change,
  status,
}: {
  name: string;
  href: string;
  value?: number;
  change?: number;
  status?: string;
}) {
  const positive = (change ?? 0) >= 0;
  return (
    <a href={href} className="rounded-lg border border-slate-200 p-5 hover:border-slate-300">
      <p className="text-sm font-medium text-slate-500">{name}</p>
      <p className="mt-1 text-2xl font-semibold text-navy-900">{value?.toLocaleString() ?? "—"}</p>
      {change !== undefined && (
        <p className={positive ? "text-sm text-brand-green" : "text-sm text-brand-red"}>
          {positive ? "+" : ""}
          {change.toFixed(2)}%
        </p>
      )}
      <p className="mt-1 text-[11px] uppercase text-slate-400">{status ?? "unavailable"}</p>
    </a>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-400">
      {title} — Phase 2
    </div>
  );
}
