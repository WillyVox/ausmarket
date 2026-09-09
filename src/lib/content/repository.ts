import { prisma } from "@/lib/db/prisma";

// The only module allowed to query the Article table directly (same
// per-table-repository convention as src/lib/brokers/repository.ts).
// This is the sponsored-content workflow for Phase 6 — NOT the
// /learn education content, which is intentionally still static
// (see src/lib/learn/article.ts) since it isn't produced or edited
// through any CMS-like flow. Article existed in the schema since
// Phase 1 but nothing read or wrote it until now.
//
// There is no `status` column on Article — "published" is derived
// from `publishedAt` being set and in the past, rather than adding a
// redundant flag that could disagree with it.

export interface SponsoredArticleRecord {
  slug: string;
  title: string;
  body: string;
  author: string | null;
  publishedAt: string | null;
  tags: string[];
}

function isPublished(publishedAt: Date | null): boolean {
  return publishedAt !== null && publishedAt.getTime() <= Date.now();
}

export async function getPublishedSponsoredArticles(): Promise<SponsoredArticleRecord[]> {
  try {
    const rows = await prisma.article.findMany({
      where: { label: "SPONSORED" },
      orderBy: { publishedAt: "desc" },
    });
    return rows
      .filter((r) => isPublished(r.publishedAt))
      .map((r) => ({
        slug: r.slug,
        title: r.title,
        body: r.body,
        author: r.author,
        publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
        tags: r.tags,
      }));
  } catch (err) {
    console.error("[content/repository] Could not load sponsored articles:", err);
    return [];
  }
}

export async function getSponsoredArticleBySlug(slug: string): Promise<SponsoredArticleRecord | null> {
  try {
    const row = await prisma.article.findUnique({ where: { slug } });
    if (!row || row.label !== "SPONSORED" || !isPublished(row.publishedAt)) return null;
    return {
      slug: row.slug,
      title: row.title,
      body: row.body,
      author: row.author,
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
      tags: row.tags,
    };
  } catch (err) {
    console.error(`[content/repository] Could not load sponsored article "${slug}":`, err);
    return null;
  }
}

// ---------- admin ----------

export interface ArticleAdminRow {
  id: string;
  slug: string;
  title: string;
  body: string;
  author: string | null;
  publishedAt: string | null; // ISO, or null if unpublished/draft
  isPublished: boolean;
}

export async function listSponsoredArticlesForAdmin(): Promise<ArticleAdminRow[]> {
  const rows = await prisma.article.findMany({
    where: { label: "SPONSORED" },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    body: r.body,
    author: r.author,
    publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
    isPublished: isPublished(r.publishedAt),
  }));
}

export interface UpsertSponsoredArticleInput {
  slug: string;
  title: string;
  body: string;
  author: string | null;
  publish: boolean; // true = set publishedAt to now if not already published
}

export async function upsertSponsoredArticle(input: UpsertSponsoredArticleInput): Promise<void> {
  const existing = await prisma.article.findUnique({ where: { slug: input.slug } });
  const publishedAt = input.publish ? existing?.publishedAt ?? new Date() : null;

  await prisma.article.upsert({
    where: { slug: input.slug },
    update: {
      title: input.title,
      body: input.body,
      author: input.author,
      label: "SPONSORED",
      publishedAt,
    },
    create: {
      slug: input.slug,
      title: input.title,
      body: input.body,
      author: input.author,
      category: "Sponsored",
      tags: [],
      relatedSymbols: [],
      label: "SPONSORED",
      publishedAt,
    },
  });
}

export async function unpublishSponsoredArticle(id: string): Promise<void> {
  await prisma.article.update({ where: { id }, data: { publishedAt: null } });
}