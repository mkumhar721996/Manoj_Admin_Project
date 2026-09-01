import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MenuItemCard } from "./MenuItemCard";
import { FEATURED_MENU_ITEMS } from "./menuData";

const diavola = FEATURED_MENU_ITEMS.find((item) => item.id === "diavola")!;
const funghiSelvaticiTartufo = FEATURED_MENU_ITEMS.find(
  (item) => item.id === "funghi-selvatici-tartufo",
)!;

describe("MenuItemCard", () => {
  it("displays the pizza's name, description, price, and image", () => {
    render(
      <MemoryRouter>
        <MenuItemCard item={diavola} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Diavola" }),
    ).toBeInTheDocument();
    expect(screen.getByText(diavola.description)).toBeInTheDocument();
    expect(screen.getByText("$16.50")).toBeInTheDocument();
    expect(screen.getByText("$16.50")).toHaveStyle({ color: "#C82D25" });

    const image = screen.getByRole("img", { name: "Diavola" });
    expect(image).toHaveAttribute("src", "/images/menu/diavola.png");
  });

  it("does not truncate a long title with an ellipsis", () => {
    render(
      <MemoryRouter>
        <MenuItemCard item={funghiSelvaticiTartufo} />
      </MemoryRouter>,
    );

    const title = screen.getByRole("heading", {
      name: "Funghi Selvatici & Tartufo",
    });
    expect(title).not.toHaveStyle({ textOverflow: "ellipsis" });
    expect(title).not.toHaveStyle({ whiteSpace: "nowrap" });
  });

  it("renders an 'Add to Order' link that navigates to the menu page with no cart logic", () => {
    render(
      <MemoryRouter>
        <MenuItemCard item={diavola} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /add to order/i });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/menu");
  });
});
