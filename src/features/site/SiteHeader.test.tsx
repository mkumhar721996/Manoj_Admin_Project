import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { addItem, removeItem, resetCart } from "../cart/cartStore";
import { SiteHeader } from "./SiteHeader";

const DEFAULT_INNER_WIDTH = window.innerWidth;

describe("SiteHeader", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    act(() => {
      window.innerWidth = DEFAULT_INNER_WIDTH;
      window.dispatchEvent(new Event("resize"));
    });
  });

  it("renders the brand logo, Home/Our Menu/Cart nav links, and the delivery-time indicator", () => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /forno rosso/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Our Menu" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cart" })).toBeInTheDocument();

    const indicator = screen.getByText(/estimated delivery/i);
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveTextContent("30 mins");
  });

  it("has a dark near-black background", () => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    expect(screen.getByRole("banner")).toHaveStyle({
      backgroundColor: "#151212",
    });
  });

  it("displays the delivery-time indicator from the externally fetched site config, not a hardcoded value", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            deliveryEtaPrefix: "Ready for pickup in:",
            deliveryEtaValue: "45 mins",
          }),
      }),
    );

    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    const indicator = await screen.findByText(/ready for pickup in/i);
    expect(indicator).toHaveTextContent("45 mins");
    expect(screen.queryByText(/estimated delivery/i)).not.toBeInTheDocument();
  });

  it("displays a cart badge reflecting the current cart item count, updating live as items are added and removed", async () => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("cart-badge")).toHaveTextContent("0");

    await act(async () => {
      addItem("diavola");
      addItem("margherita");
    });
    expect(screen.getByTestId("cart-badge")).toHaveTextContent("2");

    await act(async () => {
      removeItem("diavola");
    });
    expect(screen.getByTestId("cart-badge")).toHaveTextContent("1");

    resetCart();
  });

  it("keeps all nav links and the delivery indicator visible and legible at a 1280px desktop viewport", () => {
    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Our Menu" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/estimated delivery/i)).toBeInTheDocument();
    expect(screen.getByRole("banner")).toHaveStyle({
      paddingLeft: "80px",
      paddingRight: "80px",
    });
  });

  it("reduces header padding to avoid content overflow at a 375px mobile viewport, without hiding any content", () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Our Menu" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/estimated delivery/i)).toBeInTheDocument();
    // Fixed 80px/side padding leaves only 215px of content width at 375px and
    // causes horizontal overflow; the header must shrink its side padding on
    // narrow viewports to keep the logo, nav, and indicator on-screen.
    expect(screen.getByRole("banner")).toHaveStyle({
      paddingLeft: "20px",
      paddingRight: "20px",
    });
  });

  it("restores the full 80px padding when the viewport widens back past the mobile breakpoint", async () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    expect(screen.getByRole("banner")).toHaveStyle({ paddingLeft: "20px" });

    await act(async () => {
      window.innerWidth = 1280;
      window.dispatchEvent(new Event("resize"));
    });

    expect(screen.getByRole("banner")).toHaveStyle({ paddingLeft: "80px" });
  });
});
