import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SiteRoutes } from "./routes";

describe("SiteRoutes", () => {
  it("navigates between Home and Our Menu when their nav links are clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("home-page")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Our Menu" }));

    expect(screen.getByTestId("our-menu-page")).toBeInTheDocument();
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Our Menu" })).toHaveStyle({
      color: "#C82D25",
    });
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveStyle({
      color: "#C82D25",
    });

    await user.click(screen.getByRole("link", { name: "Home" }));

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("our-menu-page")).not.toBeInTheDocument();
  });

  it("changes the URL and swaps the page without a full reload when a header nav link is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    const headerBefore = screen.getByRole("banner");

    await user.click(screen.getByRole("link", { name: "Our Menu" }));

    expect(screen.getByTestId("our-menu-page")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBe(headerBefore);
  });

  it("renders the register page's Facebook continue button at /register", () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: /continue with facebook/i }),
    ).toBeInTheDocument();
  });

  it("renders the login page's Facebook continue button at /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: /continue with facebook/i }),
    ).toBeInTheDocument();
  });

  it.each([
    ["/", "home-page"],
    ["/menu", "our-menu-page"],
    ["/cart", "cart-page"],
    ["/checkout", "checkout-page"],
  ])("renders the %s page at %s", (path, testId) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});

describe("browser history navigation", () => {
  beforeEach(() => {
    window.history.pushState(null, "", "/");
  });

  afterEach(() => {
    window.history.pushState(null, "", "/");
  });

  it("restores the previous page when the browser back button is pressed", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SiteRoutes />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("home-page")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Our Menu" }));

    expect(screen.getByTestId("our-menu-page")).toBeInTheDocument();

    window.history.back();

    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("our-menu-page")).not.toBeInTheDocument();
  });

  it("restores the page navigated back from when the browser forward button is pressed", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SiteRoutes />
      </BrowserRouter>,
    );

    await user.click(screen.getByRole("link", { name: "Our Menu" }));

    window.history.back();

    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });

    window.history.forward();

    await waitFor(() => {
      expect(screen.getByTestId("our-menu-page")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
  });
});
