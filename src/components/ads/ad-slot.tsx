import { getActiveAdPlacement } from "@/lib/ads/repository";

// Renders a clearly-labelled ad slot, or nothing at all if there's no
// active placement configured for this slot — never a placeholder
// box pretending to be an ad, and never unlabelled content that could
// be mistaken for editorial. Currently the only `provider` this
// actually renders is "house" (internal self-promotion, e.g.
// pointing at /compare/brokers) — no third-party ad network script
// is wired up yet (see docs/compliance-flags.md).
export async function AdSlot({ placement }: { placement: string }) {
  const ad = await getActiveAdPlacement(placement);
  if (!ad) return null;

  if (ad.provider !== "house") {
    // A row exists for a provider we don't have rendering support
    // for yet — fail closed to nothing rather than guess at a shape.
    console.warn(`[AdSlot] Placement "${placement}" has provider "${ad.provider}" with no renderer — showing nothing.`);
    return null;
  }

  return (
    <div className="my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <span className="mb-2 inline-block rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        Advertisement
      </span>
      {ad.headline && <p className="text-sm font-semibold text-navy-900">{ad.headline}</p>}
      {ad.body && <p className="mt-1 text-sm text-slate-600">{ad.body}</p>}
      {ad.ctaLabel && ad.ctaHref && (
        <a
          href={ad.ctaHref}
          className="mt-2 inline-block text-sm font-medium text-brand-blue underline"
        >
          {ad.ctaLabel}
        </a>
      )}
    </div>
  );
}