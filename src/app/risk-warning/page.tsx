import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Risk Warning" };

export default function RiskWarningPage() {
  return (
    <LegalPage title="Risk Warning">
      <p>
        Trading shares, ETFs, forex, CFDs, and crypto assets carries
        risk, including the risk of losing your entire investment.
        Leveraged products (like CFDs and margin forex) can amplify
        losses beyond your initial deposit. Cryptocurrency markets are
        highly volatile and largely unregulated compared to traditional
        securities.
      </p>
      <p>
        Past performance is not a reliable indicator of future results.
        Nothing on this site is a recommendation to buy or sell any
        specific product.
      </p>
    </LegalPage>
  );
}
