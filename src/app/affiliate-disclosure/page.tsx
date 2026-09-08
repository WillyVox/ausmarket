export const metadata = { title: "Affiliate Disclosure" };

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl font-semibold text-navy-900">Affiliate Disclosure</h1>
      <p className="mt-4">
        We may receive a commission if you sign up to a trading platform,
        broker, or exchange through certain links on this website. This
        does not affect the price you pay, and it does not affect our
        editorial rankings — commission arrangements are never a factor
        in how platforms are scored or ordered. See our{" "}
        <a href="/methodology" className="underline">methodology</a>{" "}
        for how comparisons are produced.
      </p>
      <p className="mt-4">
        Not every platform mentioned on this site pays us a commission,
        and we do not exclude platforms simply because they don't.
      </p>
    </div>
  );
}
