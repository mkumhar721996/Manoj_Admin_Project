import { Link } from "react-router-dom";

export function BrandLogo() {
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
          width: 40,
          height: 40,
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
            fontSize: 22,
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
          fontSize: 24,
          color: "#FFFFFF",
          whiteSpace: "nowrap",
        }}
      >
        Forno Rosso
      </span>
    </Link>
  );
}
