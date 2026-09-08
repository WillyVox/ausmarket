import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <LegalPage title="Contact">
      <p>
        Editorial corrections, data accuracy reports, and partnership
        enquiries: <a href="mailto:hello@example.com" className="underline">hello@example.com</a>
      </p>
      <p className="text-xs text-amber-700">
        Placeholder address — replace before launch.
      </p>
    </LegalPage>
  );
}
