import { Link } from "react-router-dom";

type BrandLogoProps = {
  size?: "default" | "compact";
};

export function BrandLogo({ size = "default" }: BrandLogoProps) {
  const isCompact = size === "compact";
  const badgeSize = isCompact ? 36 : 40;

  return (
    <Link
      to="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: badgeSize,
          height: badgeSize,
          borderRadius: "50%",
          backgroundColor: "#C82D25",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: isCompact ? 18 : 22,
            color: "#FFFFFF",
          }}
        >
          F
        </span>
      </span>
      <span
        style={{
          fontFamily: "Fraunces, serif",
          fontWeight: 600,
          fontSize: isCompact ? 22 : 24,
          color: "#FFFFFF",
          whiteSpace: "nowrap",
        }}
      >
        Forno Rosso
      </span>
    </Link>
  );
}
