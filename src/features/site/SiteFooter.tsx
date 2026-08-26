import { FooterLegalRow } from "./FooterLegalRow";

export function SiteFooter() {
  return (
    <footer
      data-testid="site-footer"
      style={{
        backgroundColor: "#151212",
        padding: "24px 80px",
      }}
    >
      <FooterLegalRow />
    </footer>
  );
}
