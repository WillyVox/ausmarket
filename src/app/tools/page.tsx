export const metadata = { title: "Free Trading & Investing Tools" };

const TOOLS = [
  { slug: "compound-interest", title: "Compound Interest Calculator" },
  { slug: "investment-return", title: "Investment Return Calculator" },
  { slug: "profit-loss", title: "Profit/Loss Calculator" },
  { slug: "position-size", title: "Position Size Calculator" },
  { slug: "currency-converter", title: "Currency Converter" },
  { slug: "dividend-calculator", title: "Dividend Calculator" },
  { slug: "inflation-calculator", title: "Inflation Calculator" },
  { slug: "mortgage-calculator", title: "Mortgage Calculator" },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Free Tools</h1>
      <p className="mt-1 text-sm text-slate-500">
        Currency converter, compound interest and inflation calculators
        are live — the rest are placeholders for a later phase.
      </p>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {TOOLS.map((t) => (
          <li key={t.slug}>
            <a
              href={`/tools/${t.slug}`}
              className="block rounded-lg border border-slate-200 p-4 text-sm font-medium text-navy-900 hover:border-slate-300"
            >
              {t.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
