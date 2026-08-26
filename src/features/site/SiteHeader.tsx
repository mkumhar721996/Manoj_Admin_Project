import { BrandLogo } from "./BrandLogo";
import { PrimaryNav } from "./PrimaryNav";
import { DeliveryIndicator } from "./DeliveryIndicator";
import { useSiteConfig } from "./siteConfig";

export function SiteHeader() {
  const config = useSiteConfig();

  return (
    <header
      style={{
        backgroundColor: "#151212",
        minHeight: 88,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 80,
        paddingRight: 80,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}
    >
      <BrandLogo />
      <PrimaryNav />
      <DeliveryIndicator
        prefix={config.deliveryEtaPrefix}
        value={config.deliveryEtaValue}
      />
    </header>
  );
}
