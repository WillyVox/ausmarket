import type { Metadata } from "next";
import "./globals.css";
import { auth, signOut } from "@/auth";
import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import { AdSlot } from "@/components/ads/ad-slot";

// Use || so empty strings "" fall back to the default URL
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ausmarket.example.com";

// Ensure protocol is present to satisfy URL constructor
const SITE_URL = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Australian Market Intelligence & Trading Platform Comparison",
    template: "%s | AusMarket",
  },
  description:
    "Free Australian market data, ASX news, and transparent trading platform comparisons.",
  openGraph: {
    type: "website",
    siteName: "AusMarket",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
};

// Organization + WebSite JSON-LD, present site-wide. Page-level
// schema (Article on /learn, FAQPage on tools) is added per-page —
// this covers only the entity-level facts that don't change per page.
const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AusMarket",
  url: SITE_URL,
  description:
    "Australian market intelligence and transparent trading platform comparisons.",
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AusMarket",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/stocks?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body className="bg-white text-charcoal antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        {/* Fixed to the viewport bottom, mobile only. Renders nothing
            (no reserved space, no layout shift) unless an active
            "mobile_sticky" AdPlacement row exists. */}
        <div className="fixed inset-x-0 bottom-0 z-30 md:hidden">
          <AdSlot placement="mobile_sticky" />
        </div>
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
          <AccountLink />
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

// Reads the session server-side, so no client-side SessionProvider is
// needed just to know whether to show "Sign in" or "Sign out" — see
// the note in src/components/auth/login-form.tsx for why signIn()/
// signOut() themselves also don't need that provider.
async function AccountLink() {
  const session = await auth();

  if (!session?.user) {
    return (
      <a href="/login" className="text-slate-600">
        Sign in
      </a>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button type="submit" className="text-slate-600 hover:text-slate-900">
        Sign out
      </button>
    </form>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 py-10 text-sm text-slate-600">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-sm border-b border-slate-200 pb-8">
          <p className="mb-2 font-semibold text-slate-900">Stay in the loop</p>
          <p className="mb-3 text-xs text-slate-500">
            Occasional Australian market updates. No spam.
          </p>
          <NewsletterSignupForm source="footer" />
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 pt-8 md:grid-cols-4">
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
          <a href="/sponsored" className="block">Sponsored Content</a>
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