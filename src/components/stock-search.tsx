"use client";

import { useMemo, useState } from "react";
import { POPULAR_STOCKS } from "@/lib/stocks/data";

// Client-side filter over a small curated list for now. This is both
// the UX search box and, once /stocks/[symbol] pages are crawled,
// the SEO entry point described in the brief — swap POPULAR_STOCKS
// for a real symbol database/API in a later phase.

export function StockSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR_STOCKS;
    return POPULAR_STOCKS.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search ASX shares, e.g. BHP"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm"
      />
      <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200">
        {results.map((s) => (
          <li key={s.symbol}>
            <a
              href={`/stocks/${s.symbol.toLowerCase()}`}
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50"
            >
              <span className="font-medium text-navy-900">{s.symbol}</span>
              <span className="text-slate-500">{s.name}</span>
            </a>
          </li>
        ))}
        {results.length === 0 && (
          <li className="px-4 py-3 text-sm text-slate-400">No matches — try a ticker symbol.</li>
        )}
      </ul>
    </div>
  );
}
