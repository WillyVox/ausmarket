import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <p>
        By using this website you agree the content is general
        information only, not personal financial advice, and that
        market data may be delayed or unavailable.
      </p>
      <p className="font-medium text-amber-700">
        LEGAL REVIEW REQUIRED — placeholder terms, needs a proper legal
        drafting pass before launch.
      </p>
    </LegalPage>
  );
}
