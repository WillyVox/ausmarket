import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedSponsoredArticles, getSponsoredArticleBySlug } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getSponsoredArticleBySlug(slug);
  if (!article) return { title: "Sponsored content not found" };
  return {
    title: article.title,
    description: `Sponsored content${article.author ? ` by ${article.author}` : ""}.`,
  };
}

export default async function SponsoredArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getSponsoredArticleBySlug(slug);
  if (!article) notFound();

  const others = (await getPublishedSponsoredArticles()).filter((a) => a.slug !== article.slug);

  return (
    <article className="mx-auto max-w-2xl px-4 py-10">
      {/* This banner is not conditional on anything the sponsor or an
          editor sets per-post — it always renders for every article
          under /sponsored, deliberately, per docs/compliance-flags.md
          on disclosure adequacy. */}
      <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Sponsored content.</strong> {article.author ? `Paid for by ${article.author}. ` : ""}
        This is separate from our independent editorial content — see our{" "}
        <a href="/editorial-policy" className="underline">editorial policy</a>.
      </div>

      <h1 className="text-2xl font-semibold text-navy-900">{article.title}</h1>
      {article.publishedAt && (
        <p className="mt-1 text-xs text-slate-400">
          Published {new Date(article.publishedAt).toLocaleDateString("en-AU")}
        </p>
      )}

      <div className="mt-6 space-y-4 whitespace-pre-line text-sm leading-relaxed text-slate-700">
        {article.body}
      </div>

      {others.length > 0 && (
        <section className="mt-10 border-t border-slate-100 pt-6">
          <h2 className="text-sm font-semibold text-navy-900">More sponsored content</h2>
          <ul className="mt-2 space-y-1">
            {others.map((a) => (
              <li key={a.slug}>
                <a href={`/sponsored/${a.slug}`} className="text-sm text-navy-900 underline">
                  {a.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}