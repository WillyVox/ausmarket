import { getMarketDataProvider } from "@/lib/market-data";

export const metadata = {
  title: "Forex Rates | AUD Exchange Rates",
  description: "AUD/USD, AUD/JPY and other major forex reference rates.",
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
      <p className="mt-1 max-w-xl text-sm text-slate-500">
        Reference mid rates, not live dealing rates — actual broker
        pricing will include a spread. See source per row.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Pair</th>
              <th className="py-2">Mid rate</th>
              <th className="py-2">Change</th>
              <th className="py-2">Spread</th>
              <th className="py-2">Status</th>
              <th className="py-2">Source</th>
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
                <td className="py-3">{rate?.mid.toFixed(4) ?? "—"}</td>
                <td className={rate && rate.change >= 0 ? "py-3 text-brand-green" : "py-3 text-brand-red"}>
                  {rate ? `${rate.change >= 0 ? "+" : ""}${rate.change.toFixed(4)}` : "—"}
                  {rate?.changePct !== undefined && (
                    <span className="ml-1 text-xs text-slate-400">
                      ({rate.changePct >= 0 ? "+" : ""}
                      {rate.changePct.toFixed(2)}%)
                    </span>
                  )}
                </td>
                <td className="py-3 text-slate-400">
                  {rate?.bid !== undefined && rate?.ask !== undefined
                    ? (rate.ask - rate.bid).toFixed(4)
                    : "Not verified"}
                </td>
                <td className="py-3 text-[11px] uppercase text-slate-400">{rate?.status ?? "unavailable"}</td>
                <td className="py-3 text-xs text-slate-400">{rate?.source ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
