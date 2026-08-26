import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DeliveryTermsPage } from "./DeliveryTermsPage";

describe("DeliveryTermsPage", () => {
  it("renders the Delivery Terms title and readable body copy", () => {
    render(<DeliveryTermsPage />);

    const main = screen.getByTestId("delivery-terms-page");
    expect(main).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Delivery Terms" }),
    ).toBeInTheDocument();
    expect(main.textContent?.trim().length).toBeGreaterThan(
      "Delivery Terms".length,
    );
  });

  it("requires no accept/acknowledge interaction from the visitor", () => {
    render(<DeliveryTermsPage />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
