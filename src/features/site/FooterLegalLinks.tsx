import { Link } from "react-router-dom";

const LINK_STYLE = {
  fontFamily: "Geist, sans-serif",
  fontSize: 12,
  color: "rgba(255, 255, 255, 0.6)",
  textDecoration: "none",
};

export function FooterLegalLinks() {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <Link to="/privacy-policy" style={LINK_STYLE}>
        Privacy Policy
      </Link>
      <Link to="/delivery-terms" style={LINK_STYLE}>
        Delivery Terms
      </Link>
    </div>
  );
}
