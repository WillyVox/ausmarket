"use client";

import { useState } from "react";
import type { WatchlistItemRecord, WatchlistSymbolType } from "@/lib/watchlist/repository";

const SYMBOL_TYPE_LABELS: Record<WatchlistSymbolType, string> = {
  stock: "Stock (ASX)",
  forex: "Forex pair",
  crypto: "Crypto",
};

function detailHref(item: WatchlistItemRecord): string {
  switch (item.symbolType) {
    case "stock":
      return `/stocks/${item.symbol.toLowerCase()}`;
    case "forex":
      return `/forex/${item.symbol.toLowerCase()}`;
    case "crypto":
      return `/crypto/${item.symbol.toLowerCase()}`;
  }
}

export function WatchlistPanel({ initialItems }: { initialItems: WatchlistItemRecord[] }) {
  const [items, setItems] = useState(initialItems);
  const [symbolType, setSymbolType] = useState<WatchlistSymbolType>("stock");
  const [symbol, setSymbol] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!symbol.trim()) return;
    setPending(true);
    setError(null);

    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbolType, symbol }),
    });
    const body = await res.json().catch(() => ({}));
    setPending(false);

    if (!res.ok) {
      setError(body.error ?? "Couldn't add that — try again.");
      return;
    }

    setItems((prev) => {
      const withoutDuplicate = prev.filter(
        (i) => !(i.symbolType === body.item.symbolType && i.symbol === body.item.symbol)
      );
      return [body.item, ...withoutDuplicate];
    });
    setSymbol("");
  }

  async function handleRemove(itemId: string) {
    setItems((prev) => prev.filter((i) => i.id !== itemId)); // optimistic
    const res = await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    if (!res.ok) {
      // Revert on failure by re-fetching isn't wired up here to keep
      // this simple — a failed delete just leaves the item removed
      // from view until the next full page load corrects it.
      setError("Couldn't remove that item — refresh to check its status.");
    }
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-2">
        <label className="text-sm">
          <span className="block text-xs font-medium text-slate-500">Type</span>
          <select
            value={symbolType}
            onChange={(e) => setSymbolType(e.target.value as WatchlistSymbolType)}
            className="mt-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            {Object.entries(SYMBOL_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block text-xs font-medium text-slate-500">Symbol</span>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g. BHP"
            className="mt-1 w-32 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
        >
          Add
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-brand-red">{error}</p>}

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">
          Nothing on your watchlist yet — add a stock, forex pair or crypto asset above.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <a href={detailHref(item)} className="font-medium text-navy-900 hover:underline">
                {item.symbol}
              </a>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{SYMBOL_TYPE_LABELS[item.symbolType]}</span>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-xs text-slate-400 hover:text-brand-red"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}