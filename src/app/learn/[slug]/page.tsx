import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { ARTICLES } from "@/lib/learn/article";
import { isArticleSaved } from "@/lib/saved-articles/repository";
import { SaveArticleButton } from "@/components/account/save-article-button";

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  return {
    title: article ? article.title : "Learn",
    description: article?.body[0]?.slice(0, 150),
  };
}

export default async function LearnArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const article = ARTICLES[slug];
  if (!article) notFound();

  const session = await auth();
  const initiallySaved = session?.user
    ? await isArticleSaved(session.user.id, params.slug)
    : false;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.body[0]?.slice(0, 150),
    articleSection: "Education",
  };

  return (
    <article className="mx-auto max-w-2xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-navy-900">{article.title}</h1>
        <SaveArticleButton
          articleSlug={params.slug}
          initiallySaved={initiallySaved}
          signedIn={Boolean(session?.user)}
        />
      </div>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
        {article.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {article.related.length > 0 && (
        <section className="mt-8 border-t border-slate-100 pt-6">
          <h2 className="text-sm font-semibold text-navy-900">Related</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {article.related.map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-8 text-xs text-slate-400">
        General information only, not personal financial advice.
      </p>
    </article>
  );
}