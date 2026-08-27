import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { addItem, removeItem, resetCart } from "../cart/cartStore";
import { CartButton } from "./CartButton";

describe("CartButton", () => {
  afterEach(() => {
    resetCart();
  });

  it("shows a badge with a count of 0 when the cart is empty", () => {
    render(
      <MemoryRouter>
        <CartButton />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("cart-badge")).toHaveTextContent("0");
    expect(
      screen.getByRole("link", { name: /cart, 0 items/i }),
    ).toBeInTheDocument();
  });

  it("updates the badge count when items are added to the cart", () => {
    render(
      <MemoryRouter>
        <CartButton />
      </MemoryRouter>,
    );

    act(() => {
      addItem("diavola");
      addItem("diavola");
      addItem("margherita");
    });

    expect(screen.getByTestId("cart-badge")).toHaveTextContent("3");
    expect(
      screen.getByRole("link", { name: /cart, 3 items/i }),
    ).toBeInTheDocument();
  });

  it("updates the badge count when an item is removed from the cart", () => {
    render(
      <MemoryRouter>
        <CartButton />
      </MemoryRouter>,
    );

    act(() => {
      addItem("diavola");
    });
    expect(screen.getByTestId("cart-badge")).toHaveTextContent("1");

    act(() => {
      removeItem("diavola");
    });
    expect(screen.getByTestId("cart-badge")).toHaveTextContent("0");
    expect(
      screen.getByRole("link", { name: /cart, 0 items/i }),
    ).toBeInTheDocument();
  });

  it("links to the cart page", () => {
    render(
      <MemoryRouter>
        <CartButton />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /cart/i })).toHaveAttribute(
      "href",
      "/cart",
    );
  });
});
