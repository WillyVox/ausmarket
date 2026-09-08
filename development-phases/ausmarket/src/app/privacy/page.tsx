import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        We collect only what's needed to run the site: basic analytics
        (page views, not personally identifying where avoidable),
        account details if you register (email, saved watchlists), and
        affiliate click metadata (partner, page, placement — never
        financial account or trading credentials).
      </p>
      <p>
        We do not collect bank details, trading account credentials, or
        other sensitive financial information through this site.
      </p>
      <p className="font-medium text-amber-700">
        LEGAL REVIEW REQUIRED — this placeholder must be replaced with a
        Privacy Act 1988 (Cth)–compliant policy matching actual data
        practices before launch. See docs/compliance-flags.md.
      </p>
    </LegalPage>
  );
}
