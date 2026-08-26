import { BrandLogo } from "./BrandLogo";
import { PrimaryNav } from "./PrimaryNav";
import { DeliveryIndicator } from "./DeliveryIndicator";
import { useSiteConfig } from "./siteConfig";
import { useIsMobileViewport } from "./useIsMobileViewport";

export function SiteHeader() {
  const config = useSiteConfig();
  const isMobile = useIsMobileViewport();

  return (
    <header
      style={{
        backgroundColor: "#151212",
        minHeight: 88,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: isMobile ? 20 : 80,
        paddingRight: isMobile ? 20 : 80,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: isMobile ? 12 : 16,
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
