import { PrismaClient, Prisma } from "@prisma/client";
import { BROKER_SEEDS, EXCHANGE_SEEDS } from "../src/lib/brokers/static-data";

// This is a straight, unmodified load of the content that previously
// lived only in src/lib/brokers/static-data.ts (formerly data.ts) —
// no figures were changed, added, or "improved" in the move to the
// database. Every lastVerifiedAt stays null, every fee/feature line
// stays exactly what it was. See docs/compliance-flags.md item 7:
// this is placeholder content pending legal/editorial review, not
// verified data, regardless of which table it lives in.
//
// Run with: npm run db:seed
// Safe to re-run — upserts by slug, so re-seeding after editing
// static-data.ts updates existing rows rather than duplicating them.

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${BROKER_SEEDS.length} brokers...`);
  for (const seed of BROKER_SEEDS) {
    await prisma.broker.upsert({
      where: { slug: seed.slug },
      update: {
        name: seed.name,
        category: seed.category,
        description: seed.description,
        country: seed.country,
        products: seed.products,
        markets: seed.markets,
        feesSummary: seed.feesSummary,
        minimumDeposit: seed.minimumDepositAmount,
        mobileApp: seed.mobileApp,
        demoAccount: seed.demoAccount,
        platformFeatures: seed.platformFeatures,
        pros: seed.pros,
        considerations: seed.considerations,
        regulatoryInformation: seed.regulatoryInformation,
        websiteUrl: seed.websiteUrl,
        affiliateSlug: seed.affiliateSlug,
        sources: seed.sources as Prisma.InputJsonValue,
        lastVerifiedAt: seed.lastVerifiedAt ? new Date(seed.lastVerifiedAt) : null,
      },
      create: {
        slug: seed.slug,
        name: seed.name,
        category: seed.category,
        description: seed.description,
        country: seed.country,
        products: seed.products,
        markets: seed.markets,
        feesSummary: seed.feesSummary,
        minimumDeposit: seed.minimumDepositAmount,
        mobileApp: seed.mobileApp,
        demoAccount: seed.demoAccount,
        platformFeatures: seed.platformFeatures,
        pros: seed.pros,
        considerations: seed.considerations,
        regulatoryInformation: seed.regulatoryInformation,
        websiteUrl: seed.websiteUrl,
        affiliateSlug: seed.affiliateSlug,
        // affiliateStatus intentionally left at its schema default
        // ("none") — we don't have a real commercial agreement with
        // any of these providers yet. Don't set "active" here.
        sources: seed.sources as Prisma.InputJsonValue,
        lastVerifiedAt: seed.lastVerifiedAt ? new Date(seed.lastVerifiedAt) : null,
      },
    });
    console.log(`  ✓ ${seed.name}`);
  }

  console.log(`Seeding ${EXCHANGE_SEEDS.length} exchanges...`);
  for (const seed of EXCHANGE_SEEDS) {
    await prisma.exchange.upsert({
      where: { slug: seed.slug },
      update: {
        name: seed.name,
        description: seed.description,
        country: seed.country,
        productsSupported: seed.productsSupported,
        feesSummary: seed.feesSummary,
        regulatoryInformation: seed.regulatoryInformation,
        websiteUrl: seed.websiteUrl,
        affiliateSlug: seed.affiliateSlug,
        sources: seed.sources as Prisma.InputJsonValue,
        lastVerifiedAt: seed.lastVerifiedAt ? new Date(seed.lastVerifiedAt) : null,
      },
      create: {
        slug: seed.slug,
        name: seed.name,
        description: seed.description,
        country: seed.country,
        productsSupported: seed.productsSupported,
        feesSummary: seed.feesSummary,
        regulatoryInformation: seed.regulatoryInformation,
        websiteUrl: seed.websiteUrl,
        affiliateSlug: seed.affiliateSlug,
        sources: seed.sources as Prisma.InputJsonValue,
        lastVerifiedAt: seed.lastVerifiedAt ? new Date(seed.lastVerifiedAt) : null,
      },
    });
    console.log(`  ✓ ${seed.name}`);
  }

  // ---------- Phase 6: ad placements ----------
  // Only "homepage_middle" is seeded active, and only as a "house"
  // (internal self-promotion) ad — there is no third-party ad
  // network account configured, so seeding any other provider as
  // "active" would be fabricating ad inventory that doesn't exist.
  // See docs/compliance-flags.md.
  const AD_PLACEMENTS: {
    placement: string;
    type: string;
    provider: string;
    status: "active" | "inactive";
    headline?: string;
    body?: string;
    ctaLabel?: string;
    ctaHref?: string;
  }[] = [
    {
      placement: "homepage_top",
      type: "house_ad",
      provider: "house",
      status: "inactive",
    },
    {
      placement: "homepage_middle",
      type: "house_ad",
      provider: "house",
      status: "active",
      headline: "Comparing trading platforms?",
      body: "See fees, features and regulatory info side by side — sourced and dated.",
      ctaLabel: "Compare Platforms",
      ctaHref: "/compare/brokers",
    },
    { placement: "article_middle", type: "house_ad", provider: "house", status: "inactive" },
    { placement: "article_bottom", type: "house_ad", provider: "house", status: "inactive" },
    { placement: "stock_sidebar", type: "house_ad", provider: "house", status: "inactive" },
    { placement: "mobile_sticky", type: "house_ad", provider: "house", status: "inactive" },
  ];

  console.log(`Seeding ${AD_PLACEMENTS.length} ad placements...`);
  for (const ad of AD_PLACEMENTS) {
    await prisma.adPlacement.upsert({
      where: { placement: ad.placement },
      update: {
        type: ad.type,
        provider: ad.provider,
        status: ad.status,
        headline: ad.headline ?? null,
        body: ad.body ?? null,
        ctaLabel: ad.ctaLabel ?? null,
        ctaHref: ad.ctaHref ?? null,
      },
      create: {
        placement: ad.placement,
        type: ad.type,
        provider: ad.provider,
        status: ad.status,
        headline: ad.headline ?? null,
        body: ad.body ?? null,
        ctaLabel: ad.ctaLabel ?? null,
        ctaHref: ad.ctaHref ?? null,
      },
    });
    console.log(`  ✓ ${ad.placement} (${ad.status})`);
  }

  // ---------- Phase 6: one placeholder sponsored article ----------
  // Demonstrates the /sponsored rendering path end-to-end. This is
  // NOT a real commercial relationship — the sponsor name says so
  // explicitly. Replace or remove before launch (see
  // docs/compliance-flags.md item 10).
  console.log("Seeding 1 placeholder sponsored article...");
  await prisma.article.upsert({
    where: { slug: "example-sponsored-post-placeholder" },
    update: {},
    create: {
      slug: "example-sponsored-post-placeholder",
      title: "Example Sponsored Post (Placeholder — Replace Before Launch)",
      body:
        "This is placeholder sponsored content seeded to demonstrate the /sponsored " +
        "workflow end-to-end. It does not represent a real commercial relationship " +
        "with any named or unnamed company. Remove this row (or unpublish it via " +
        "/admin/sponsored) before this site goes live.",
      author: "Example Sponsor Pty Ltd (placeholder — not a real partner)",
      category: "Sponsored",
      tags: ["placeholder"],
      relatedSymbols: [],
      label: "SPONSORED",
      publishedAt: new Date(),
    },
  });
  console.log("  ✓ example-sponsored-post-placeholder");

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });