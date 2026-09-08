import { getMarketDataProvider } from "@/lib/market-data";

export const metadata = {
  title: "ASX 200 Today | Australian Stock Market",
  description: "ASX 200 current level, daily change, and historical performance.",
};

export default async function Asx200Page() {
  const provider = getMarketDataProvider();
  const index = await provider.getIndex("XJO");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">ASX 200</h1>
      <p className="text-sm text-slate-500">
        {index?.status ?? "unavailable"} · source: {index?.source ?? "—"}
      </p>

      <div className="mt-4 flex items-baseline gap-4">
        <p className="text-3xl font-semibold text-navy-900">{index?.value.toLocaleString() ?? "—"}</p>
        <p className={index && index.changePct >= 0 ? "text-brand-green" : "text-brand-red"}>
          {index?.change.toFixed(2)} ({index?.changePct.toFixed(2)}%)
        </p>
      </div>

      <div className="mt-6 h-72 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-sm text-slate-400">
        Historical chart — Phase 2
      </div>

      <section className="mt-10 rounded-lg border border-slate-200 p-5">
        <p className="text-sm text-slate-700">Want to trade ASX 200 shares or ETFs?</p>
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
