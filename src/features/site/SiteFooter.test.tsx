import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("renders the footer shell with the legal links inside it", () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    );

    const footer = screen.getByTestId("site-footer");
    expect(footer.tagName).toBe("FOOTER");
    expect(footer).toHaveStyle({ backgroundColor: "#151212" });
    expect(
      screen.getByRole("link", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Delivery Terms" }),
    ).toBeInTheDocument();
  });
});
