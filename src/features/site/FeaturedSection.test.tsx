import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FeaturedSection } from "./FeaturedSection";

const DEFAULT_INNER_WIDTH = window.innerWidth;

describe("FeaturedSection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    act(() => {
      window.innerWidth = DEFAULT_INNER_WIDTH;
      window.dispatchEvent(new Event("resize"));
    });
  });

  it("renders the eyebrow and heading copy", () => {
    render(
      <MemoryRouter>
        <FeaturedSection />
      </MemoryRouter>,
    );

    expect(screen.getByText(/chef recommendations/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /popular sourdough pizzas/i }),
    ).toBeInTheDocument();
  });

  it("uses 80px side padding at a 1280px desktop viewport", () => {
    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter>
        <FeaturedSection />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("featured-section")).toHaveStyle({
      paddingLeft: "80px",
      paddingRight: "80px",
    });
  });

  it("reduces side padding to 20px at a 375px mobile viewport to avoid content overflow", () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter>
        <FeaturedSection />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("featured-section")).toHaveStyle({
      paddingLeft: "20px",
      paddingRight: "20px",
    });
  });
});
