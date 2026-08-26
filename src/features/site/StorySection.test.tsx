import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StorySection } from "./StorySection";

const DEFAULT_INNER_WIDTH = window.innerWidth;

describe("StorySection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    act(() => {
      window.innerWidth = DEFAULT_INNER_WIDTH;
      window.dispatchEvent(new Event("resize"));
    });
  });

  it("shows the sourdough narrative and all three trust claims", () => {
    render(<StorySection />);

    expect(screen.getByText(/the sourdough secret/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /our passion for the perfect crust/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /ferment our proprietary sourdough mother starter for 48 hours/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/100% imported san marzano tomatoes/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/fior di latte & fresh mozzarella/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/900°f stone hearth wood oven/i),
    ).toBeInTheDocument();
  });

  it("uses 80px side padding and a fluid two-column grid at a 1280px desktop viewport", () => {
    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));

    render(<StorySection />);

    const section = screen.getByTestId("story-section");
    expect(section).toHaveStyle({
      paddingLeft: "80px",
      paddingRight: "80px",
    });
    expect(screen.getByTestId("story-section-grid")).toHaveStyle({
      gridTemplateColumns: "1fr 1fr",
      gap: "80px",
    });
  });

  it("stacks into a single column with 20px side padding at a 320px mobile viewport", () => {
    window.innerWidth = 320;
    window.dispatchEvent(new Event("resize"));

    render(<StorySection />);

    const section = screen.getByTestId("story-section");
    expect(section).toHaveStyle({
      paddingLeft: "20px",
      paddingRight: "20px",
    });
    expect(screen.getByTestId("story-section-grid")).toHaveStyle({
      gridTemplateColumns: "1fr",
    });
  });
});
