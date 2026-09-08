import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Editorial Policy" };

export default function EditorialPolicyPage() {
  return (
    <LegalPage title="Editorial Policy">
      <p>
        Market data, statistics, and factual claims must carry a source
        and a last-verified date. Educational content is written to be
        neutral and accurate, and is reviewed for factual errors on an
        ongoing basis.
      </p>
      <p>
        Commercial relationships (affiliate partnerships, sponsored
        content) never influence factual reporting or comparison
        scoring. Sponsored content is always labelled "Sponsored".
      </p>
      <p>
        <strong>Corrections:</strong> if you spot an error, contact us
        via the <a href="/contact" className="underline">contact page</a>{" "}
        — corrections are made promptly and, where material, noted on
        the page.
      </p>
    </LegalPage>
  );
}
