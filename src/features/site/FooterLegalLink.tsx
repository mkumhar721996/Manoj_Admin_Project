import { Link } from "react-router-dom";

type FooterLegalLinkProps = {
  to: string;
  label: string;
};

export function FooterLegalLink({ to, label }: FooterLegalLinkProps) {
  return (
    <Link
      to={to}
      style={{
        fontFamily: "Geist, sans-serif",
        fontWeight: 400,
        fontSize: 12,
        color: "rgba(255,255,255,0.60)",
        textDecoration: "none",
      }}
    >
      {label}
    </Link>
  );
}
