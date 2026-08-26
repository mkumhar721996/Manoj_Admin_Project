import { FooterAddressBlock } from "./FooterAddressBlock";
import { FooterBottomBar } from "./FooterBottomBar";
import { FooterBrandColumn } from "./FooterBrandColumn";
import { FooterContactLines } from "./FooterContactLines";
import { FooterInfoColumn } from "./FooterInfoColumn";
import { FooterScheduleRow } from "./FooterScheduleRow";
import { useIsMobileViewport } from "./useIsMobileViewport";
import { useSiteConfig } from "./siteConfig";

export function SiteFooter() {
  const config = useSiteConfig();
  const isMobile = useIsMobileViewport();

  return (
    <footer
      data-testid="site-footer"
      style={{
        backgroundColor: "#151212",
        paddingTop: 80,
        paddingBottom: 48,
        paddingLeft: isMobile ? 20 : 80,
        paddingRight: isMobile ? 20 : 80,
        display: "flex",
        flexDirection: "column",
        gap: 64,
      }}
    >
      <div
        data-testid="footer-cols"
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          gap: isMobile ? 40 : 24,
        }}
      >
        <FooterBrandColumn
          description={config.footerDescription}
          socialLinks={config.socialLinks}
        />
        <FooterInfoColumn title="Kitchen Hours">
          {config.kitchenHours.map((entry) => (
            <FooterScheduleRow
              key={entry.day}
              day={entry.day}
              hours={entry.hours}
            />
          ))}
        </FooterInfoColumn>
        <FooterInfoColumn title="Pizzeria Location">
          <FooterAddressBlock address={config.pizzeriaAddress} />
          <FooterContactLines
            delivery={config.deliveryPhone}
            email={config.contactEmail}
          />
        </FooterInfoColumn>
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          paddingTop: 32,
        }}
      >
        <FooterBottomBar
          copyright="© 2026 Forno Rosso Pizzeria. All rights reserved."
          isMobile={isMobile}
        />
      </div>
    </footer>
  );
}
