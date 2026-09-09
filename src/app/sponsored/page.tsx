import { getPublishedSponsoredArticles } from "@/lib/content/repository";

export const metadata = {
  title: "Sponsored Content",
  description: "Sponsored posts on AusMarket, always clearly labelled.",
};
export const dynamic = "force-dynamic";

export default async function SponsoredIndexPage() {
  const articles = await getPublishedSponsoredArticles();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Sponsored Content</h1>
      <p className="mt-2 text-sm text-slate-600">
        Content on this page is paid for by the named sponsor and is separate from our
        independent editorial content. See our{" "}
        <a href="/editorial-policy" className="underline">editorial policy</a> and{" "}
        <a href="/how-we-get-paid" className="underline">how we get paid</a>.
      </p>

      {articles.length === 0 ? (
        <p className="mt-8 text-sm text-slate-400">
          No sponsored content is currently published.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-slate-100">
          {articles.map((a) => (
            <li key={a.slug} className="py-4">
              <a href={`/sponsored/${a.slug}`} className="font-medium text-navy-900 hover:underline">
                {a.title}
              </a>
              {a.author && <p className="mt-1 text-xs text-slate-500">Sponsored by {a.author}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}