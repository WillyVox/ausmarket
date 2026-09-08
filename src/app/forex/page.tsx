import { getMarketDataProvider } from "@/lib/market-data/mock-provider";

export const metadata = {
  title: "Forex Rates | AUD Exchange Rates",
  description: "Live-tracked AUD/USD, AUD/JPY and other major forex pairs.",
};

const PAIRS = ["AUDUSD", "AUDJPY", "AUDNZD", "EURAUD", "GBPAUD", "USDJPY", "EURUSD", "GBPUSD"];

export default async function ForexIndexPage() {
  const provider = getMarketDataProvider();
  const rates = await Promise.all(
    PAIRS.map(async (pair) => ({ pair, rate: await provider.getForexRate(pair) }))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Forex Rates</h1>
      <p className="mt-1 text-sm text-slate-500">AUD and major currency pairs.</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Pair</th>
              <th className="py-2">Bid</th>
              <th className="py-2">Ask</th>
              <th className="py-2">Change</th>
              <th className="py-2">High</th>
              <th className="py-2">Low</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rates.map(({ pair, rate }) => (
              <tr key={pair} className="border-b border-slate-100">
                <td className="py-3 font-medium text-navy-900">
                  <a href={`/forex/${pair.toLowerCase()}`}>
                    {pair.slice(0, 3)}/{pair.slice(3)}
                  </a>
                </td>
                <td className="py-3">{rate?.bid.toFixed(4) ?? "—"}</td>
                <td className="py-3">{rate?.ask.toFixed(4) ?? "—"}</td>
                <td className={rate && rate.change >= 0 ? "py-3 text-brand-green" : "py-3 text-brand-red"}>
                  {rate?.change.toFixed(4) ?? "—"}
                </td>
                <td className="py-3">{rate?.high.toFixed(4) ?? "—"}</td>
                <td className="py-3">{rate?.low.toFixed(4) ?? "—"}</td>
                <td className="py-3 text-[11px] uppercase text-slate-400">{rate?.status ?? "unavailable"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
