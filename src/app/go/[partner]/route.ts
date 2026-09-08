import { NextRequest, NextResponse } from "next/server";
import { isAllowlistedAffiliateUrl } from "@/lib/affiliate/config";
import { resolveAffiliateTarget, recordAffiliateClick } from "@/lib/brokers/repository";

// Flow: /go/[affiliate-slug]?placement=stock_page&campaign=xyz
// 1. Resolve the slug to a broker or exchange via the repository
//    layer (database first, static fallback if the DB is down —
//    see src/lib/brokers/repository.ts).
// 2. Validate the resolved websiteUrl is on the domain allowlist.
// 3. Record the click in AffiliateClick (fire-and-forget — never
//    blocks or fails the redirect).
// 4. 302 redirect to the provider.
//
// This route deliberately does NOT accept an arbitrary destination
// URL as a query param — that would be an open redirect. The only
// input trusted is the slug, which is resolved server-side against
// known partner records.

export async function GET(
  req: NextRequest,
  { params }: { params: { partner: string } }
) {
  const target = await resolveAffiliateTarget(params.partner);

  if (!target) {
    return NextResponse.redirect(new URL("/compare/brokers", req.url));
  }

  if (!isAllowlistedAffiliateUrl(target.websiteUrl)) {
    // Fail closed: never redirect to an unapproved destination, even
    // if it's sitting in the database.
    console.error(
      `[affiliate_redirect_blocked] ${target.partnerSlug} -> ${target.websiteUrl} not on allowlist`
    );
    return NextResponse.redirect(new URL("/compare/brokers", req.url));
  }

  const { searchParams } = new URL(req.url);

  // Fire-and-forget: click tracking must never delay or break the
  // user's redirect to the provider.
  void recordAffiliateClick({
    partnerType: target.partnerType,
    partnerSlug: target.partnerSlug,
    landingPage: req.headers.get("referer") ?? "unknown",
    placement: searchParams.get("placement"),
    campaign: searchParams.get("campaign"),
    referrer: req.headers.get("referer"),
    deviceType: req.headers.get("sec-ch-ua-mobile") === "?1" ? "mobile" : "desktop",
  });

  return NextResponse.redirect(target.websiteUrl, { status: 302 });
}
