import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { FooterLegalLink } from "./FooterLegalLink";

describe("FooterLegalLink", () => {
  it("renders a navigable link styled as static footer text", () => {
    render(
      <MemoryRouter>
        <FooterLegalLink to="/privacy-policy" label="Privacy Policy" />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: "Privacy Policy" });
    expect(link).toHaveAttribute("href", "/privacy-policy");
    expect(link).toHaveStyle({
      fontFamily: "Geist, sans-serif",
      fontWeight: 400,
      fontSize: "12px",
      color: "rgba(255,255,255,0.60)",
    });
  });
});
