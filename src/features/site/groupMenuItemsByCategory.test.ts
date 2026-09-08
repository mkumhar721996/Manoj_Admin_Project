import { describe, expect, it } from "vitest";
import { groupMenuItemsByCategory } from "./groupMenuItemsByCategory";
import type { MenuCatalogItem } from "./menuCatalog";

function makeItem(overrides: Partial<MenuCatalogItem>): MenuCatalogItem {
  return {
    id: "item-id",
    name: "Item Name",
    description: "Item description",
    price: "$10.00",
    category: "Pizza",
    imageSrc: "/images/menu/item.png",
    imageAlt: "Item Name",
    ...overrides,
  };
}

describe("groupMenuItemsByCategory", () => {
  it("groups items by category, preserving first-seen category order and item order within each group", () => {
    const pizzaOne = makeItem({ id: "pizza-one", category: "Pizza" });
    const pizzaTwo = makeItem({ id: "pizza-two", category: "Pizza" });
    const salad = makeItem({ id: "salad-one", category: "Salads" });

    const groups = groupMenuItemsByCategory([pizzaOne, pizzaTwo, salad]);

    expect(groups).toEqual([
      { category: "Pizza", items: [pizzaOne, pizzaTwo] },
      { category: "Salads", items: [salad] },
    ]);
  });

  it("returns an empty array when there are no items", () => {
    expect(groupMenuItemsByCategory([])).toEqual([]);
  });
});
