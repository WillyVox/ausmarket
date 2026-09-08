-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT;

-- CreateTable
CREATE TABLE "SavedArticle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleSlug" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedArticle_userId_articleSlug_key" ON "SavedArticle"("userId", "articleSlug");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- AddForeignKey
ALTER TABLE "SavedArticle" ADD CONSTRAINT "SavedArticle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
