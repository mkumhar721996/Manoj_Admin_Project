import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FeaturedGrid } from "./FeaturedGrid";
import { FEATURED_MENU_ITEMS } from "./menuData";

const DEFAULT_INNER_WIDTH = window.innerWidth;

describe("FeaturedGrid", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    act(() => {
      window.innerWidth = DEFAULT_INNER_WIDTH;
      window.dispatchEvent(new Event("resize"));
    });
  });

  it("displays every featured pizza card", () => {
    render(
      <MemoryRouter>
        <FeaturedGrid />
      </MemoryRouter>,
    );

    for (const item of FEATURED_MENU_ITEMS) {
      expect(
        screen.getByRole("heading", { name: item.name }),
      ).toBeInTheDocument();
    }
  });

  it("lays cards out in a 4-column grid at a 1280px desktop viewport", () => {
    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter>
        <FeaturedGrid />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("featured-grid")).toHaveStyle({
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "24px",
    });
  });

  it("collapses to a 2-column grid at an 800px tablet viewport", () => {
    window.innerWidth = 800;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter>
        <FeaturedGrid />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("featured-grid")).toHaveStyle({
      gridTemplateColumns: "repeat(2, 1fr)",
    });
  });

  it("stacks cards into a single column at a 375px mobile viewport without hiding any card", () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter>
        <FeaturedGrid />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("featured-grid")).toHaveStyle({
      gridTemplateColumns: "repeat(1, 1fr)",
    });
    expect(
      screen.getAllByRole("link", { name: /add to order/i }),
    ).toHaveLength(FEATURED_MENU_ITEMS.length);
  });
});
