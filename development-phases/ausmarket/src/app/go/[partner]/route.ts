import { NextRequest, NextResponse } from "next/server";
import { isAllowlistedAffiliateUrl } from "@/lib/affiliate/config";

// Flow: /go/[partner-slug]?placement=stock_page&campaign=xyz
// 1. Look up partner by slug (DB) — stubbed here.
// 2. Validate the partner's affiliateUrl is on the domain allowlist.
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

// Stub lookup — replace with a Prisma query against AffiliatePartner.
async function lookupPartner(slug: string): Promise<PartnerRecord | null> {
  const demo: Record<string, PartnerRecord> = {
    "cmc-markets": {
      slug: "cmc-markets",
      affiliateUrl: "https://www.cmcmarkets.com/en-au/",
      isActive: true,
    },
  };
  return demo[slug] ?? null;
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
  const partner = await lookupPartner(params.partner);

  if (!partner || !partner.isActive) {
    return NextResponse.redirect(new URL("/compare/brokers", req.url));
  }

  if (!isAllowlistedAffiliateUrl(partner.affiliateUrl)) {
    // Fail closed: never redirect to an unapproved destination, even
    // if it's sitting in the database.
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
