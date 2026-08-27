import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addItem,
  getItemCount,
  removeItem,
  resetCart,
  subscribeToCart,
} from "./cartStore";

describe("cartStore", () => {
  afterEach(() => {
    resetCart();
  });

  it("starts with an item count of 0", () => {
    expect(getItemCount()).toBe(0);
  });

  it("increments the item count when items are added", () => {
    addItem("diavola");
    addItem("diavola");

    expect(getItemCount()).toBe(2);
  });

  it("decrements the item count when an item is removed", () => {
    addItem("diavola");
    removeItem("diavola");

    expect(getItemCount()).toBe(0);
  });

  it("notifies subscribers when an item is added or removed", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToCart(listener);

    addItem("diavola");
    expect(listener).toHaveBeenCalledTimes(1);

    removeItem("diavola");
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    addItem("diavola");
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
