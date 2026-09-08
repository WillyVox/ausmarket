import { getMarketDataProvider } from "@/lib/market-data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { symbol: string };
}): Promise<Metadata> {
  const symbol = params.symbol.toUpperCase();
  return {
    title: `${symbol} Price in AUD Today`,
    description: `Live-tracked ${symbol} price in AUD and USD, chart, and market cap.`,
  };
}

export default async function CryptoAssetPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();
  const provider = getMarketDataProvider();
  const quote = await provider.getCryptoPrice(symbol);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">{symbol}</h1>
      <p className="text-sm text-slate-500">
        {quote?.status ?? "unavailable"} · source: {quote?.source ?? "—"}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Price (AUD)" value={quote?.priceAud} prefix="$" />
        <Stat label="Price (USD)" value={quote?.priceUsd} prefix="$" />
        <Stat label="24h Change" value={quote?.change24h} suffix="%" />
        <Stat label="Volume (24h)" value={quote?.volume24h} prefix="$" />
      </div>

      <div className="mt-6 h-64 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-sm text-slate-400">
        Historical chart — Phase 2 (TradingView Lightweight Charts)
      </div>

      <p className="mt-6 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
        Crypto assets are highly volatile and not covered by the same
        regulatory protections as ASX-listed securities. See our{" "}
        <a href="/risk-warning" className="underline">risk warning</a>.
      </p>

      <section className="mt-6 rounded-lg border border-slate-200 p-5">
        <p className="text-sm text-slate-700">Want to buy or trade {symbol}?</p>
        <a
          href="/compare/crypto-exchanges"
          className="mt-2 inline-block rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white"
        >
          Compare Crypto Exchanges
        </a>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-navy-900">
        {value !== undefined ? `${prefix}${value.toLocaleString()}${suffix}` : "Not verified"}
      </p>
    </div>
  );
}
