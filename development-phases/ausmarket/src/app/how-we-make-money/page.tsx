export const metadata = { title: "How We Make Money" };

export default function HowWeMakeMoneyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl font-semibold text-navy-900">How We Make Money</h1>
      <ul className="mt-4 list-disc space-y-2 pl-5">
        <li>
          <strong>Affiliate partnerships</strong> — commission from
          trading platforms and exchanges when you sign up via our
          comparison pages. See our{" "}
          <a href="/affiliate-disclosure" className="underline">affiliate disclosure</a>.
        </li>
        <li><strong>Display advertising</strong> — clearly labelled, never affecting content.</li>
        <li><strong>Sponsored content</strong> — always labelled "Sponsored".</li>
        <li>
          <strong>Future: premium tools, data products, newsletter
          sponsorship</strong> — not yet live.
        </li>
      </ul>
      <p className="mt-6">
        All market data, news, and educational content is free and not
        gated behind any commercial relationship.
      </p>
    </div>
  );
}
