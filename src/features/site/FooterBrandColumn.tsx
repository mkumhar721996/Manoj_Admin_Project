import { BrandLogo } from "./BrandLogo";
import { SocialIconButton } from "./SocialIconButton";
import type { SiteConfig } from "./siteConfig";

type FooterBrandColumnProps = {
  description: string;
  socialLinks: SiteConfig["socialLinks"];
};

export function FooterBrandColumn({
  description,
  socialLinks,
}: FooterBrandColumnProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 320,
      }}
    >
      <BrandLogo size="compact" />
      <p
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: 14,
          color: "rgba(255, 255, 255, 0.6)",
          margin: 0,
        }}
      >
        {description}
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <SocialIconButton
          icon="instagram"
          href={socialLinks.instagram}
          label="Instagram"
        />
        <SocialIconButton
          icon="facebook"
          href={socialLinks.facebook}
          label="Facebook"
        />
        <SocialIconButton
          icon="twitter"
          href={socialLinks.twitter}
          label="Twitter"
        />
      </div>
    </div>
  );
}
