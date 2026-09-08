import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy">
      <p>
        We use cookies for essential site function, analytics, and (in
        future) ad measurement. You can control cookies through your
        browser settings.
      </p>
      <p className="font-medium text-amber-700">
        LEGAL REVIEW REQUIRED — a real cookie policy needs to list actual
        cookies/vendors once analytics and ad tooling are wired up.
      </p>
    </LegalPage>
  );
}
