"use client";

import { useMemo, useState } from "react";

// Uses a fixed illustrative average inflation rate — a real
// implementation would source actual historical CPI data from the
// ABS. Labelled clearly as an estimate, not verified historical data.
const ILLUSTRATIVE_AVG_ANNUAL_INFLATION_PCT = 3;

export default function InflationCalculatorPage() {
  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(10);
  const [ratePct, setRatePct] = useState(ILLUSTRATIVE_AVG_ANNUAL_INFLATION_PCT);

  const futureEquivalent = useMemo(() => {
    return amount * Math.pow(1 + ratePct / 100, years);
  }, [amount, years, ratePct]);

  const purchasingPowerLoss = useMemo(() => {
    return amount - amount / Math.pow(1 + ratePct / 100, years);
  }, [amount, years, ratePct]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Inflation Calculator</h1>
      <p className="mt-1 text-sm text-slate-500">
        Estimate how inflation could affect the purchasing power of an
        amount of money over time, using an assumed annual rate.
      </p>

      <div className="mt-6 grid gap-4 rounded-lg border border-slate-200 p-5 sm:grid-cols-3">
        <Field label="Amount today ($)" value={amount} onChange={setAmount} />
        <Field label="Years" value={years} onChange={setYears} />
        <Field label="Assumed inflation (%/yr)" value={ratePct} onChange={setRatePct} step={0.1} />
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 p-5">
        <p className="text-sm text-slate-500">
          Amount needed in {years} years for the same purchasing power
        </p>
        <p className="text-2xl font-semibold text-navy-900">
          ${futureEquivalent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Estimated loss in today's purchasing power: $
          {purchasingPowerLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900">FAQ</h2>
        <div className="mt-2 space-y-3 text-sm text-slate-700">
          <p>
            <strong>Where does the {ILLUSTRATIVE_AVG_ANNUAL_INFLATION_PCT}% default come from?</strong>{" "}
            It's an illustrative long-run assumption, not a live or
            verified figure. For actual historical Australian CPI data,
            see the{" "}
            <a
              href="https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/consumer-price-index-australia"
              className="underline"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Australian Bureau of Statistics
            </a>.
          </p>
        </div>
      </section>

      <p className="mt-8 text-xs text-slate-400">
        General information only, not personal financial advice.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </label>
  );
}
