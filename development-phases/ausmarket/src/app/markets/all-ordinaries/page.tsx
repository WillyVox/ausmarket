import { getMarketDataProvider } from "@/lib/market-data";

export const metadata = {
  title: "All Ordinaries Today",
  description: "All Ordinaries (XAO) current level, daily change, and performance.",
};

export default async function AllOrdinariesPage() {
  const provider = getMarketDataProvider();
  const index = await provider.getIndex("XAO");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">All Ordinaries</h1>
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
    </div>
  );
}
