import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureListItem } from "./FeatureListItem";

describe("FeatureListItem", () => {
  it("renders the icon badge, title and description", () => {
    render(
      <FeatureListItem
        icon="star"
        title="100% Imported San Marzano Tomatoes"
        description="Sourced directly from fertile Campania volcano soils for a sweet, low-acid base."
      />,
    );

    expect(
      screen.getByText(/100% imported san marzano tomatoes/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /sourced directly from fertile campania volcano soils/i,
      ),
    ).toBeInTheDocument();
  });
});
