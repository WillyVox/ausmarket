export const metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl font-semibold text-navy-900">Disclaimer</h1>
      <p className="mt-4">
        The information on this website is general in nature and does
        not take into account your personal objectives, financial
        situation, or needs. It is not personal financial advice and
        should not be relied on as such. Consider seeking independent
        professional advice before making any financial decision.
      </p>
      <p className="mt-4">
        Market data may be delayed and is provided for informational
        purposes only. Past performance is not a reliable indicator of
        future performance. Trading and investing carry risk, including
        the risk of loss of capital.
      </p>
      <p className="mt-4 font-medium text-amber-700">
        LEGAL REVIEW REQUIRED before this page is used in production —
        see docs/compliance-flags.md.
      </p>
    </div>
  );
}
