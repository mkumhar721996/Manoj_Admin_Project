import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DeliveryIndicator } from "./DeliveryIndicator";

describe("DeliveryIndicator", () => {
  it("renders the delivery value in the brand green accent color", () => {
    render(
      <DeliveryIndicator prefix="Estimated delivery:" value="30 mins" />,
    );

    expect(screen.getByText("30 mins")).toHaveStyle({ color: "#2A7043" });
  });
});
