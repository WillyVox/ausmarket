import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mortgage Calculator" };

// Placeholder — not yet wired up. Kept as a real, non-404 page with
// an honest "coming soon" state rather than a thin/fake calculator,
// per the project's "no fabricated tools" rule.
export default function Placeholder() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Mortgage Calculator</h1>
      <p className="mt-4 text-sm text-slate-600">
        This calculator is coming soon. In the meantime, try our{" "}
        <a href="/tools/compound-interest" className="underline">
          Compound Interest Calculator
        </a>{" "}
        or{" "}
        <a href="/tools/currency-converter" className="underline">
          Currency Converter
        </a>.
      </p>
      <a href="/tools" className="mt-6 inline-block text-sm font-medium text-brand-blue">
        ← Back to all tools
      </a>
    </div>
  );
}
