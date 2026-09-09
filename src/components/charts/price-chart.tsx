"use client";

import { useMemo, useState, useTransition } from "react";
import { HISTORICAL_RANGES } from "@/lib/market-data/ranges";
import type { HistoricalRange } from "@/lib/market-data/provider";

export interface PricePoint {
  t: string;
  v: number;
}

interface PriceChartProps {
  symbol: string;
  market: "STOCK" | "FOREX" | "CRYPTO";
  initialRange: HistoricalRange;
  initialPoints: PricePoint[];
  /** How many decimal places to show in the hover tooltip / axis labels. */
  decimals?: number;
  /** Optional prefix for values, e.g. "$". */
  valuePrefix?: string;
}

const WIDTH = 700;
const HEIGHT = 260;
const PADDING = { top: 16, right: 16, bottom: 28, left: 56 };

// Plain SVG, no chart library — keeps this dependency-free regardless
// of whatever's actually installed in package.json (which wasn't part
// of what was shared), and free/delayed-data charts don't need
// anything fancier than a line + range selector.
export function PriceChart({
  symbol,
  market,
  initialRange,
  initialPoints,
  decimals = 2,
  valuePrefix = "",
}: PriceChartProps) {
  const [range, setRange] = useState<HistoricalRange>(initialRange);
  const [points, setPoints] = useState<PricePoint[]>(initialPoints);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  function handleRangeChange(next: HistoricalRange) {
    if (next === range) return;
    setRange(next);
    setError(false);
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/market-data/history?symbol=${encodeURIComponent(symbol)}&range=${next}&market=${market}`
        );
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as { points: PricePoint[] };
        setPoints(data.points ?? []);
      } catch {
        setPoints([]);
        setError(true);
      }
    });
  }

  const { pathD, areaD, minV, maxV, xForIndex, yForValue } = useMemo(() => {
    const innerW = WIDTH - PADDING.left - PADDING.right;
    const innerH = HEIGHT - PADDING.top - PADDING.bottom;

    if (points.length === 0) {
      return { pathD: "", areaD: "", minV: 0, maxV: 0, xForIndex: () => 0, yForValue: () => 0 };
    }

    const values = points.map((p) => p.v);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    // Pad the domain slightly so the line doesn't hug the top/bottom edge.
    const pad = (rawMax - rawMin) * 0.08 || rawMax * 0.01 || 1;
    const minV = rawMin - pad;
    const maxV = rawMax + pad;

    const xForIndex = (i: number) =>
      PADDING.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const yForValue = (v: number) =>
      PADDING.top + innerH - ((v - minV) / (maxV - minV || 1)) * innerH;

    const linePoints = points.map((p, i) => `${xForIndex(i)},${yForValue(p.v)}`);
    const pathD = `M${linePoints.join(" L")}`;
    const areaD = `${pathD} L${xForIndex(points.length - 1)},${PADDING.top + innerH} L${xForIndex(0)},${
      PADDING.top + innerH
    } Z`;

    return { pathD, areaD, minV, maxV, xForIndex, yForValue };
  }, [points]);

  const first = points[0];
  const last = points[points.length - 1];
  const isUp = first && last ? last.v >= first.v : true;
  const lineColor = isUp ? "var(--chart-up, #16a34a)" : "var(--chart-down, #dc2626)";
  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-slate-500">
          {hovered ? (
            <>
              <span className="font-medium text-navy-900">
                {valuePrefix}
                {hovered.v.toFixed(decimals)}
              </span>{" "}
              · {new Date(hovered.t).toLocaleString()}
            </>
          ) : points.length > 0 ? (
            <>Showing {points.length} data points</>
          ) : (
            <>No historical data available for this range yet</>
          )}
        </div>
        <div className="flex gap-1" role="tablist" aria-label="Chart range">
          {HISTORICAL_RANGES.map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={r === range}
              onClick={() => handleRangeChange(r)}
              className={
                "rounded px-2 py-1 text-xs font-medium transition-colors " +
                (r === range
                  ? "bg-navy-900 text-white"
                  : "text-slate-500 hover:bg-slate-100")
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-3">
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-xs text-slate-400">
            Loading…
          </div>
        )}
        {points.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-400">
            {error
              ? "Couldn't load chart data — the live source may be unavailable right now."
              : "Historical data isn't available for this asset/range combination."}
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-64 w-full"
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id={`fade-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.18" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal gridlines + axis labels (min/mid/max) */}
            {[minV, (minV + maxV) / 2, maxV].map((v, i) => (
              <g key={i}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={yForValue(v)}
                  y2={yForValue(v)}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                />
                <text x={4} y={yForValue(v) + 3} fontSize={9} fill="#94a3b8">
                  {valuePrefix}
                  {v.toFixed(decimals)}
                </text>
              </g>
            ))}

            <path d={areaD} fill={`url(#fade-${symbol})`} stroke="none" />
            <path d={pathD} fill="none" stroke={lineColor} strokeWidth={1.75} />

            {/* Invisible hover targets, one per point */}
            {points.map((p, i) => (
              <rect
                key={i}
                x={xForIndex(i) - (WIDTH / points.length) / 2}
                y={PADDING.top}
                width={WIDTH / points.length}
                height={HEIGHT - PADDING.top - PADDING.bottom}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
              />
            ))}

            {hoverIndex !== null && points[hoverIndex] && (
              <>
                <line
                  x1={xForIndex(hoverIndex)}
                  x2={xForIndex(hoverIndex)}
                  y1={PADDING.top}
                  y2={HEIGHT - PADDING.bottom}
                  stroke="#94a3b8"
                  strokeDasharray="3,3"
                />
                <circle cx={xForIndex(hoverIndex)} cy={yForValue(points[hoverIndex]!.v)} r={3.5} fill={lineColor} />
              </>
            )}
          </svg>
        )}
      </div>
    </div>
  );
}
