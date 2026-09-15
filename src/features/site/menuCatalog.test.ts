import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_MENU_CATALOG, loadMenuCatalog } from "./menuCatalog";

describe("loadMenuCatalog", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves to the fetched menu-catalog.json payload when the request succeeds", async () => {
    const customCatalog = [
      {
        id: "test-item",
        name: "Test Pizza",
        description: "A distinctive test description",
        price: "$99.99",
        category: "Pizza",
        imageSrc: "/images/menu/test-item.png",
        imageAlt: "Test Pizza",
      },
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(customCatalog),
      }),
    );

    const catalog = await loadMenuCatalog();

    expect(catalog).toEqual(customCatalog);
  });

  it("falls back to the default catalog when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));

    const catalog = await loadMenuCatalog();

    expect(catalog).toEqual(DEFAULT_MENU_CATALOG);
  });

  it("falls back to the default catalog when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve([]),
      }),
    );

    const catalog = await loadMenuCatalog();

    expect(catalog).toEqual(DEFAULT_MENU_CATALOG);
  });
});
