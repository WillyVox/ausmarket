"use client";

import { useMemo, useState } from "react";

// Pure client-side calculation — no market-data dependency, so this
// is fully "real" (not a placeholder) unlike the currency converter.
export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [annualRatePct, setAnnualRatePct] = useState(7);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    const monthlyRate = annualRatePct / 100 / 12;
    const months = years * 12;
    let balance = principal;
    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    const totalContributions = principal + monthlyContribution * months;
    return {
      finalBalance: balance,
      totalContributions,
      totalGrowth: balance - totalContributions,
    };
  }, [principal, monthlyContribution, annualRatePct, years]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Compound Interest Calculator</h1>
      <p className="mt-1 text-sm text-slate-500">
        Estimate how an initial amount and regular contributions could
        grow over time at a given annual rate.
      </p>

      <div className="mt-6 grid gap-4 rounded-lg border border-slate-200 p-5 sm:grid-cols-2">
        <Field label="Starting amount ($)" value={principal} onChange={setPrincipal} />
        <Field label="Monthly contribution ($)" value={monthlyContribution} onChange={setMonthlyContribution} />
        <Field label="Annual rate (%)" value={annualRatePct} onChange={setAnnualRatePct} step={0.1} />
        <Field label="Years" value={years} onChange={setYears} />
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 p-5">
        <p className="text-sm text-slate-500">Estimated final balance</p>
        <p className="text-2xl font-semibold text-navy-900">
          ${result.finalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Total contributed: $
          {result.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
        <p className="text-sm text-slate-600">
          Estimated growth: $
          {result.totalGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900">FAQ</h2>
        <div className="mt-2 space-y-3 text-sm text-slate-700">
          <p>
            <strong>Is this financial advice?</strong> No — this is a
            general-purpose calculator for illustration only. Actual
            investment returns vary and are not guaranteed. See our{" "}
            <a href="/disclaimer" className="underline">disclaimer</a>.
          </p>
          <p>
            <strong>How is this calculated?</strong> Monthly compounding:
            each month's contribution is added after that month's
            interest is applied, over the number of years you enter.
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
