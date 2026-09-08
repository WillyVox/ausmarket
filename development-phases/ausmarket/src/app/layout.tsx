import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Australian Market Intelligence & Trading Platform Comparison",
    template: "%s | AusMarket",
  },
  description:
    "Free Australian market data, ASX news, and transparent trading platform comparisons.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body className="bg-white text-charcoal antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <span className="text-lg font-semibold text-navy-900">AusMarket</span>
        <nav className="hidden gap-6 text-sm font-medium text-slate-700 md:flex">
          <a href="/markets">Markets</a>
          <a href="/stocks">Stocks</a>
          <a href="/forex">Forex</a>
          <a href="/crypto">Crypto</a>
          <a href="/news">News</a>
          <a href="/calendar">Calendar</a>
          <a href="/compare" className="text-brand-blue">Compare</a>
          <a href="/learn">Learn</a>
          <a href="/tools">Tools</a>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <a href="/watchlist" className="text-slate-600">Watchlist</a>
          <a
            href="/compare/brokers"
            className="rounded-md bg-navy-900 px-3 py-1.5 font-medium text-white"
          >
            Compare Platforms
          </a>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 py-10 text-sm text-slate-600">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
        <div>
          <p className="mb-2 font-semibold text-slate-900">Company</p>
          <a href="/about" className="block">About</a>
          <a href="/contact" className="block">Contact</a>
        </div>
        <div>
          <p className="mb-2 font-semibold text-slate-900">Trust</p>
          <a href="/editorial-policy" className="block">Editorial Policy</a>
          <a href="/methodology" className="block">Methodology</a>
          <a href="/how-we-make-money" className="block">How We Make Money</a>
          <a href="/affiliate-disclosure" className="block">Affiliate Disclosure</a>
        </div>
        <div>
          <p className="mb-2 font-semibold text-slate-900">Legal</p>
          <a href="/privacy" className="block">Privacy</a>
          <a href="/terms" className="block">Terms</a>
          <a href="/cookie-policy" className="block">Cookie Policy</a>
          <a href="/risk-warning" className="block">Risk Warning</a>
          <a href="/disclaimer" className="block">Disclaimer</a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl px-4 text-xs text-slate-500">
        General information only — not personal financial advice. Market
        data may be delayed. See our{" "}
        <a href="/affiliate-disclosure" className="underline">
          affiliate disclosure
        </a>{" "}
        for how we make money.
      </p>
    </footer>
  );
}
