import { requireAdmin } from "@/lib/auth/admin";
import { listAdPlacementsForAdmin, setAdPlacementStatus } from "@/lib/ads/repository";
import { revalidatePath } from "next/cache";

export const metadata = { title: "Ad Placements" };
export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  await requireAdmin();
  const placements = await listAdPlacementsForAdmin();

  async function toggleStatus(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = formData.get("id");
    const nextStatus = formData.get("nextStatus");
    if (typeof id !== "string" || (nextStatus !== "active" && nextStatus !== "inactive")) return;
    await setAdPlacementStatus(id, nextStatus);
    revalidatePath("/admin/ads");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Ad Placements</h1>
      <p className="mt-2 text-sm text-slate-600">
        Only <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">provider: &quot;house&quot;</code> rows
        currently render anything (an internal, clearly-labelled self-promotion box) — no
        third-party ad network is wired up. See <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
        src/components/ads/ad-slot.tsx</code>.
      </p>

      <ul className="mt-8 divide-y divide-slate-100 rounded-lg border border-slate-200">
        {placements.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="font-medium text-navy-900">{p.placement}</p>
              <p className="text-xs text-slate-500">
                {p.provider} / {p.type} — {p.headline ?? "no headline set"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  p.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {p.status}
              </span>
              <form action={toggleStatus}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="nextStatus" value={p.status === "active" ? "inactive" : "active"} />
                <button
                  type="submit"
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-navy-900"
                >
                  {p.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs text-slate-400">
        Headline/body/CTA text is edited via <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
        prisma/seed.ts</code> or directly in the database for now — a full edit form is a
        reasonable next addition once there's more than one house creative to manage.
      </p>
    </div>
  );
}