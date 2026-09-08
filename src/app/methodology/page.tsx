import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Comparison Methodology" };

const CRITERIA = [
  "Fees & brokerage",
  "Products & markets available",
  "Platform & mobile app quality",
  "Research & charting tools",
  "Education & demo accounts",
  "Customer support",
  "Regulatory standing",
];

export default function MethodologyPage() {
  return (
    <LegalPage title="How We Compare Platforms">
      <p>
        Every platform on our comparison pages is assessed against the
        same fixed set of criteria:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        {CRITERIA.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p>
        Each factual claim (fees, minimum deposit, supported markets,
        etc.) is sourced directly from the provider's own disclosure
        documents or website, with a "last verified" date shown on the
        comparison and broker pages. Where we can't verify a claim, we
        show <em>"Not verified"</em> rather than guessing.
      </p>
      <p className="font-medium">
        Commission does not determine ranking. A partner paying a
        higher commission is not scored or positioned more favourably
        because of it.
      </p>
      <p className="font-medium text-amber-700">
        LEGAL REVIEW REQUIRED — before this methodology is published as
        a factual claim, the actual scoring process needs to be built
        and independently auditable, not just described.
      </p>
    </LegalPage>
  );
}
