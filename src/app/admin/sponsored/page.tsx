import { requireAdmin } from "@/lib/auth/admin";
import {
  listSponsoredArticlesForAdmin,
  upsertSponsoredArticle,
  unpublishSponsoredArticle,
} from "@/lib/content/repository";
import { revalidatePath } from "next/cache";

export const metadata = { title: "Sponsored Content" };
export const dynamic = "force-dynamic";

export default async function AdminSponsoredPage() {
  await requireAdmin();
  const articles = await listSponsoredArticlesForAdmin();

  async function createOrUpdate(formData: FormData) {
    "use server";
    await requireAdmin();
    const slug = String(formData.get("slug") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const author = String(formData.get("author") ?? "").trim() || null;
    const publish = formData.get("publish") === "on";
    if (!slug || !title || !body) return;

    await upsertSponsoredArticle({ slug, title, body, author, publish });
    revalidatePath("/admin/sponsored");
    revalidatePath("/sponsored");
    revalidatePath(`/sponsored/${slug}`);
  }

  async function unpublish(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = formData.get("id");
    if (typeof id !== "string") return;
    await unpublishSponsoredArticle(id);
    revalidatePath("/admin/sponsored");
    revalidatePath("/sponsored");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Sponsored Content</h1>
      <p className="mt-2 text-sm text-slate-600">
        Published pieces appear at <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">/sponsored/[slug]</code>{" "}
        with a mandatory, non-removable disclosure banner (see{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">src/app/sponsored/[slug]/page.tsx</code>)
        — the label can't be turned off per-post, since disclosure adequacy is a compliance
        requirement, not a style choice (see docs/compliance-flags.md).
      </p>

      <section className="mt-8 rounded-lg border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-navy-900">New / update post</h2>
        <form action={createOrUpdate} className="mt-4 space-y-3">
          <Field label="Slug (url-safe, used as the identifier)">
            <input name="slug" required className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" placeholder="e.g. understanding-cfd-risk" />
          </Field>
          <Field label="Title">
            <input name="title" required className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </Field>
          <Field label="Sponsor / author name">
            <input name="author" className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" placeholder="e.g. Example Partner Pty Ltd" />
          </Field>
          <Field label="Body">
            <textarea name="body" required rows={6} className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="publish" />
            Publish immediately
          </label>
          <button type="submit" className="rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white">
            Save
          </button>
        </form>
      </section>

      <ul className="mt-8 divide-y divide-slate-100 rounded-lg border border-slate-200">
        {articles.length === 0 && (
          <li className="px-4 py-4 text-sm text-slate-400">No sponsored content yet.</li>
        )}
        {articles.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="font-medium text-navy-900">{a.title}</p>
              <p className="text-xs text-slate-500">/sponsored/{a.slug} — {a.author ?? "no sponsor name set"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  a.isPublished ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {a.isPublished ? "Published" : "Draft"}
              </span>
              {a.isPublished && (
                <form action={unpublish}>
                  <input type="hidden" name="id" value={a.id} />
                  <button type="submit" className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-navy-900">
                    Unpublish
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  );
}