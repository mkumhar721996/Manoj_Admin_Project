import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OurMenuPage } from "./OurMenuPage";

function stubFetchWithCatalog(catalog: unknown[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(catalog),
    }),
  );
}

describe("OurMenuPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("displays every item defined in the catalog data file", async () => {
    const catalogItems = [
      {
        id: "diavola",
        name: "Diavola",
        description: "Spicy salami pizza.",
        price: "$16.50",
        category: "Pizza",
        imageSrc: "/images/menu/diavola.png",
        imageAlt: "Diavola",
      },
      {
        id: "classic-margherita",
        name: "Classic Margherita",
        description: "Classic tomato and mozzarella pizza.",
        price: "$14.50",
        category: "Pizza",
        imageSrc: "/images/menu/classic-margherita.png",
        imageAlt: "Classic Margherita",
      },
      {
        id: "caesar-salad",
        name: "Caesar Salad",
        description: "Crisp romaine with caesar dressing.",
        price: "$9.00",
        category: "Salads",
        imageSrc: "/images/menu/caesar-salad.png",
        imageAlt: "Caesar Salad",
      },
    ];
    stubFetchWithCatalog(catalogItems);

    render(
      <MemoryRouter>
        <OurMenuPage />
      </MemoryRouter>,
    );

    for (const item of catalogItems) {
      expect(
        await screen.findByRole("heading", { name: item.name }),
      ).toBeInTheDocument();
    }
  });

  it("groups a new item under its assigned category heading, separate from other categories", async () => {
    stubFetchWithCatalog([
      {
        id: "diavola",
        name: "Diavola",
        description: "Spicy salami pizza.",
        price: "$16.50",
        category: "Pizza",
        imageSrc: "/images/menu/diavola.png",
        imageAlt: "Diavola",
      },
      {
        id: "classic-margherita",
        name: "Classic Margherita",
        description: "Classic tomato and mozzarella pizza.",
        price: "$14.50",
        category: "Pizza",
        imageSrc: "/images/menu/classic-margherita.png",
        imageAlt: "Classic Margherita",
      },
      {
        id: "caesar-salad",
        name: "Caesar Salad",
        description: "Crisp romaine with caesar dressing.",
        price: "$9.00",
        category: "Salads",
        imageSrc: "/images/menu/caesar-salad.png",
        imageAlt: "Caesar Salad",
      },
    ]);

    render(
      <MemoryRouter>
        <OurMenuPage />
      </MemoryRouter>,
    );

    const saladsHeading = await screen.findByRole("heading", {
      name: "Salads",
    });
    const saladsSection = saladsHeading.closest("section");
    expect(saladsSection).not.toBeNull();

    expect(
      within(saladsSection as HTMLElement).getByRole("heading", {
        name: "Caesar Salad",
      }),
    ).toBeInTheDocument();
    expect(
      within(saladsSection as HTMLElement).queryByRole("heading", {
        name: "Diavola",
      }),
    ).not.toBeInTheDocument();
  });

  it("displays the item's price, description, and image exactly as defined in the catalog data file", async () => {
    stubFetchWithCatalog([
      {
        id: "test-item",
        name: "Test Pizza",
        description: "A distinctive test description",
        price: "$99.99",
        category: "Pizza",
        imageSrc: "/images/menu/test-item.png",
        imageAlt: "Test Pizza",
      },
    ]);

    render(
      <MemoryRouter>
        <OurMenuPage />
      </MemoryRouter>,
    );

    await screen.findByRole("heading", { name: "Test Pizza" });

    expect(
      screen.getByText("A distinctive test description"),
    ).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Test Pizza" }),
    ).toHaveAttribute("src", "/images/menu/test-item.png");
  });

  it("renders the menu page with no items in the grid when the catalog data file has zero items", async () => {
    stubFetchWithCatalog([]);

    render(
      <MemoryRouter>
        <OurMenuPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("our-menu-page")).toBeInTheDocument();
    await Promise.resolve();

    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.queryAllByTestId("menu-grid")).toHaveLength(0);
  });
});
