import type { HistoricalRange } from "./provider";

// Single source of truth for the range selector so the chart
// component, the API route, and each provider's range-mapping logic
// never drift out of sync with each other.
export const HISTORICAL_RANGES: HistoricalRange[] = [
  "1D",
  "5D",
  "1M",
  "3M",
  "6M",
  "YTD",
  "1Y",
  "5Y",
  "MAX",
];

export function isHistoricalRange(value: string): value is HistoricalRange {
  return (HISTORICAL_RANGES as string[]).includes(value);
}