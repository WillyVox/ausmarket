import { getMarketDataProvider } from "@/lib/market-data/mock-provider";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { pair: string };
}): Promise<Metadata> {
  const pair = params.pair.toUpperCase();
  return {
    title: `${pair.slice(0, 3)}/${pair.slice(3)} Exchange Rate Today`,
    description: `Live-tracked ${pair} exchange rate, chart, and market information.`,
  };
}

export default async function ForexPairPage({ params }: { params: { pair: string } }) {
  const pair = params.pair.toUpperCase();
  const provider = getMarketDataProvider();
  const rate = await provider.getForexRate(pair);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">
        {pair.slice(0, 3)}/{pair.slice(3)}
      </h1>
      <p className="text-sm text-slate-500">
        {rate?.status ?? "unavailable"} · source: {rate?.source ?? "—"}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Bid" value={rate?.bid} />
        <Stat label="Ask" value={rate?.ask} />
        <Stat label="High" value={rate?.high} />
        <Stat label="Low" value={rate?.low} />
      </div>

      <div className="mt-6 h-64 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-sm text-slate-400">
        Historical chart — Phase 2 (TradingView Lightweight Charts)
      </div>

      <section className="mt-10 rounded-lg border border-slate-200 p-5">
        <p className="text-sm text-slate-700">Want to trade forex?</p>
        <a
          href="/compare/forex-platforms"
          className="mt-2 inline-block rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white"
        >
          Compare Forex Platforms
        </a>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-navy-900">{value?.toFixed(4) ?? "Not verified"}</p>
    </div>
  );
}
