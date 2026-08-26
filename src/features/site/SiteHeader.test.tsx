import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the brand logo, Home/Our Menu nav links, and the delivery-time indicator", () => {
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

    const indicator = screen.getByText(/estimated delivery/i);
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveTextContent("30 mins");
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

  it("renders no cart item-count badge while the cart epic is unwired", () => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    expect(screen.queryByText(/cart/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: /cart/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cart/i }),
    ).not.toBeInTheDocument();
  });

  it("keeps all nav links and the delivery indicator present at a 1280px desktop viewport", () => {
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
  });

  it("keeps all nav links and the delivery indicator present at a 375px mobile viewport without hiding content", () => {
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
  });
});
