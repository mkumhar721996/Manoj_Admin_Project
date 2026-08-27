import { FooterLegalLinks } from "./FooterLegalLinks";

type FooterBottomBarProps = {
  copyright: string;
  isMobile: boolean;
};

export function FooterBottomBar({ copyright, isMobile }: FooterBottomBarProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "center" : "center",
        justifyContent: "space-between",
        gap: isMobile ? 16 : 0,
        textAlign: isMobile ? "center" : "left",
      }}
    >
      <span
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.6)",
        }}
      >
        {copyright}
      </span>
      <FooterLegalLinks />
    </div>
  );
}
