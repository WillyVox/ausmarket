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