import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureList } from "./FeatureList";
import { STORY_FEATURES } from "./storyData";

describe("FeatureList", () => {
  it("renders every story feature's title and description", () => {
    render(<FeatureList />);

    for (const feature of STORY_FEATURES) {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    }
  });
});
