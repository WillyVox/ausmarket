/*
  Warnings:

  - You are about to drop the column `partnerId` on the `AffiliateClick` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[affiliateSlug]` on the table `Broker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `partnerSlug` to the `AffiliateClick` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partnerType` to the `AffiliateClick` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feesSummary` to the `Broker` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AffiliateClick" DROP CONSTRAINT "AffiliateClick_partnerId_fkey";

-- AlterTable
ALTER TABLE "AffiliateClick" DROP COLUMN "partnerId",
ADD COLUMN     "partnerSlug" TEXT NOT NULL,
ADD COLUMN     "partnerType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Broker" ADD COLUMN     "affiliateSlug" TEXT,
ADD COLUMN     "category" TEXT[],
ADD COLUMN     "considerations" TEXT[],
ADD COLUMN     "feesSummary" TEXT NOT NULL,
ADD COLUMN     "pros" TEXT[],
ADD COLUMN     "sources" JSONB NOT NULL DEFAULT '[]',
ALTER COLUMN "fees" DROP NOT NULL,
ALTER COLUMN "brokerage" DROP NOT NULL,
ALTER COLUMN "lastVerifiedAt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Exchange" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Australia',
    "productsSupported" TEXT[],
    "feesSummary" TEXT NOT NULL,
    "fees" JSONB,
    "regulatoryInformation" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "affiliateUrl" TEXT,
    "affiliateSlug" TEXT,
    "affiliateStatus" TEXT NOT NULL DEFAULT 'none',
    "affiliateDisclosure" TEXT,
    "sources" JSONB NOT NULL DEFAULT '[]',
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_slug_key" ON "Exchange"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_affiliateSlug_key" ON "Exchange"("affiliateSlug");

-- CreateIndex
CREATE INDEX "AffiliateClick_partnerType_partnerSlug_idx" ON "AffiliateClick"("partnerType", "partnerSlug");

-- CreateIndex
CREATE INDEX "AffiliateClick_timestamp_idx" ON "AffiliateClick"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Broker_affiliateSlug_key" ON "Broker"("affiliateSlug");
