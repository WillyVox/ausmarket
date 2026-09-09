import { requireAdmin } from "@/lib/auth/admin";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Admin</h1>
      <p className="mt-2 text-sm text-slate-600">
        Internal tools. Nothing here is public — see{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
          src/lib/auth/admin.ts
        </code>
        .
      </p>

      <ul className="mt-8 divide-y divide-slate-100 rounded-lg border border-slate-200">
        <AdminLink
          href="/admin/affiliate"
          title="Affiliate analytics"
          description="Click counts by partner, placement and device. Revenue and CTR are honestly reported as unavailable — no payout or page-view data source is connected."
        />
        <AdminLink
          href="/admin/ads"
          title="Ad placements"
          description="Toggle house-ad slots on and off across the site."
        />
        <AdminLink
          href="/admin/sponsored"
          title="Sponsored content"
          description="Create, edit and publish sponsored articles (shown at /sponsored, always with a disclosure banner)."
        />
      </ul>
    </div>
  );
}

function AdminLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <li>
      <a href={href} className="block px-4 py-4 hover:bg-slate-50">
        <p className="font-medium text-navy-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </a>
    </li>
  );
}