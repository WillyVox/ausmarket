import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <LegalPage title="About AusMarket">
      <p>
        AusMarket is an Australian market intelligence platform — free
        market data, news, education, and calculators, plus transparent
        comparisons of trading platforms and exchanges.
      </p>
      <p>
        We're independent of any single broker or exchange. Some
        comparison pages contain affiliate links — see our{" "}
        <a href="/how-we-make-money" className="underline">how we make money</a>{" "}
        page for details.
      </p>
    </LegalPage>
  );
}
