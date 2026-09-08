import { NextRequest, NextResponse } from "next/server";
import { isAllowlistedAffiliateUrl } from "@/lib/affiliate/config";
import { BROKERS, EXCHANGES } from "@/lib/brokers/data";

// Flow: /go/[partner-slug]?placement=stock_page&campaign=xyz
// 1. Look up partner by slug — currently the shared BROKERS/EXCHANGES
//    data module; Phase 4 swaps this for a Prisma query against
//    AffiliatePartner without changing the route's contract.
// 2. Validate the partner's websiteUrl is on the domain allowlist.
// 3. Record the click (fire-and-forget, never blocks the redirect).
// 4. 302 redirect to the provider.
//
// This route deliberately does NOT accept an arbitrary destination
// URL as a query param — that would be an open redirect. The only
// input trusted is the partner slug, which is resolved server-side.

interface PartnerRecord {
  slug: string;
  affiliateUrl: string;
  isActive: boolean;
}

function lookupPartner(slug: string): PartnerRecord | null {
  const broker = BROKERS.find((b) => b.affiliateSlug === slug);
  if (broker) {
    return { slug: broker.slug, affiliateUrl: broker.websiteUrl, isActive: true };
  }
  const exchange = EXCHANGES.find((e) => e.affiliateSlug === slug);
  if (exchange) {
    return { slug: exchange.slug, affiliateUrl: exchange.websiteUrl, isActive: true };
  }
  return null;
}

async function recordClick(params: {
  partnerSlug: string;
  landingPage: string;
  placement: string | null;
  campaign: string | null;
  referrer: string | null;
}) {
  // Replace with: prisma.affiliateClick.create({ data: { ... } })
  console.log("[affiliate_click]", params);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { partner: string } }
) {
  const { partner: partnerVal } = await params;

  const partner = lookupPartner(partnerVal);

  if (!partner || !partner.isActive) {
    return NextResponse.redirect(new URL("/compare/brokers", req.url));
  }

  if (!isAllowlistedAffiliateUrl(partner.affiliateUrl)) {
    // Fail closed: never redirect to an unapproved destination, even
    // if it's sitting in the data source.
    console.error(
      `[affiliate_redirect_blocked] ${partner.slug} -> ${partner.affiliateUrl} not on allowlist`
    );
    return NextResponse.redirect(new URL("/compare/brokers", req.url));
  }

  const { searchParams } = new URL(req.url);
  await recordClick({
    partnerSlug: partner.slug,
    landingPage: req.headers.get("referer") ?? "unknown",
    placement: searchParams.get("placement"),
    campaign: searchParams.get("campaign"),
    referrer: req.headers.get("referer"),
  });

  return NextResponse.redirect(partner.affiliateUrl, { status: 302 });
}
