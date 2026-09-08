"use client";

import { useState } from "react";

// Uses a fixed illustrative rate for now — Phase 2 wires this to
// MarketDataProvider.getForexRate() for a live rate. The UI/UX and
// SEO shell (title, FAQ, related links) are real; only the rate
// source is a placeholder.
const ILLUSTRATIVE_AUD_USD = 0.652;

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState(100);
  const [direction, setDirection] = useState<"AUD_TO_USD" | "USD_TO_AUD">("AUD_TO_USD");

  const result =
    direction === "AUD_TO_USD" ? amount * ILLUSTRATIVE_AUD_USD : amount / ILLUSTRATIVE_AUD_USD;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">AUD/USD Currency Converter</h1>
      <p className="mt-1 text-sm text-slate-500">
        Illustrative rate for now — not for executing real trades. Live
        rates land in Phase 2.
      </p>

      <div className="mt-6 rounded-lg border border-slate-200 p-5">
        <label className="block text-sm font-medium text-slate-700">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">Direction</label>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as typeof direction)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="AUD_TO_USD">AUD → USD</option>
          <option value="USD_TO_AUD">USD → AUD</option>
        </select>

        <p className="mt-5 text-2xl font-semibold text-navy-900">
          {result.toFixed(2)} {direction === "AUD_TO_USD" ? "USD" : "AUD"}
        </p>
        <p className="text-xs text-slate-400">
          Rate used: {ILLUSTRATIVE_AUD_USD} (illustrative, not live)
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900">FAQ</h2>
        <div className="mt-2 space-y-3 text-sm text-slate-700">
          <p>
            <strong>Is this rate live?</strong> Not yet — this converter
            uses an illustrative fixed rate until a live forex feed is
            connected. Check the{" "}
            <a href="/forex/audusd" className="underline">AUD/USD page</a>{" "}
            for the latest tracked rate.
          </p>
        </div>
      </section>
    </div>
  );
}
