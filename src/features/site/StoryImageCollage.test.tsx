import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StoryImageCollage } from "./StoryImageCollage";

const DEFAULT_INNER_WIDTH = window.innerWidth;

describe("StoryImageCollage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    act(() => {
      window.innerWidth = DEFAULT_INNER_WIDTH;
      window.dispatchEvent(new Event("resize"));
    });
  });

  it("renders both story photos with descriptive alt text", () => {
    render(<StoryImageCollage />);

    expect(
      screen.getByRole("img", {
        name: "A chef hand-stretching sourdough pizza dough over a floured countertop",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "A wood-fired pizza baking inside a lit stone hearth oven",
      }),
    ).toBeInTheDocument();
  });

  it("lays the two photos side by side at a 1280px desktop viewport", () => {
    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));

    render(<StoryImageCollage />);

    expect(screen.getByTestId("story-image-collage")).toHaveStyle({
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    });
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("stacks the two photos into a single column at a 320px mobile viewport without hiding either photo", () => {
    window.innerWidth = 320;
    window.dispatchEvent(new Event("resize"));

    render(<StoryImageCollage />);

    expect(screen.getByTestId("story-image-collage")).toHaveStyle({
      gridTemplateColumns: "1fr",
    });
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });
});
