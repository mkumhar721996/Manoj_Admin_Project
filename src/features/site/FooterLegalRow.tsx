import { FooterLegalLink } from "./FooterLegalLink";

export function FooterLegalRow() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span
        style={{
          fontFamily: "Geist, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          color: "rgba(255,255,255,0.60)",
        }}
      >
        © 2026 Forno Rosso Pizzeria. All rights reserved.
      </span>
      <div style={{ display: "flex", gap: 24 }}>
        <FooterLegalLink to="/privacy-policy" label="Privacy Policy" />
        <FooterLegalLink to="/delivery-terms" label="Delivery Terms" />
      </div>
    </div>
  );
}
