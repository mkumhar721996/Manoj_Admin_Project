import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { FooterLegalRow } from "./FooterLegalRow";

describe("FooterLegalRow", () => {
  it("renders the copyright text and the two legal links", () => {
    render(
      <MemoryRouter>
        <FooterLegalRow />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("© 2026 Forno Rosso Pizzeria. All rights reserved."),
    ).toBeInTheDocument();

    const privacyLink = screen.getByRole("link", { name: "Privacy Policy" });
    expect(privacyLink).toHaveAttribute("href", "/privacy-policy");

    const deliveryLink = screen.getByRole("link", { name: "Delivery Terms" });
    expect(deliveryLink).toHaveAttribute("href", "/delivery-terms");
  });
});
