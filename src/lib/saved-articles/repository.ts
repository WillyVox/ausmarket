import { prisma } from "@/lib/db/prisma";

export interface SavedArticleRecord {
  articleSlug: string;
  savedAt: string; // ISO
}

export async function listSavedArticles(userId: string): Promise<SavedArticleRecord[]> {
  const rows = await prisma.savedArticle.findMany({
    where: { userId },
    orderBy: { savedAt: "desc" },
  });
  return rows.map((r: { articleSlug: string; savedAt: Date }) => ({
    articleSlug: r.articleSlug,
    savedAt: r.savedAt.toISOString(),
  }));
}

export async function isArticleSaved(userId: string, articleSlug: string): Promise<boolean> {
  const row = await prisma.savedArticle.findUnique({
    where: { userId_articleSlug: { userId, articleSlug } },
  });
  return row !== null;
}

export async function saveArticle(userId: string, articleSlug: string): Promise<void> {
  await prisma.savedArticle.upsert({
    where: { userId_articleSlug: { userId, articleSlug } },
    update: {},
    create: { userId, articleSlug },
  });
}

export async function unsaveArticle(userId: string, articleSlug: string): Promise<void> {
  await prisma.savedArticle.deleteMany({ where: { userId, articleSlug } });
}