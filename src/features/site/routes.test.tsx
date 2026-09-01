import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { SiteRoutes } from "./routes";

describe("SiteRoutes", () => {
  it("navigates between Home, Our Menu, and Cart when their nav links are clicked, keeping the header and footer visible and unchanged", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Our Menu" }));

    expect(screen.getByTestId("our-menu-page")).toBeInTheDocument();
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Our Menu" })).toHaveStyle({
      color: "#C82D25",
    });
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveStyle({
      color: "#C82D25",
    });
    expect(
      screen.getByRole("link", { name: /forno rosso/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Cart" }));

    expect(screen.getByTestId("cart-page")).toBeInTheDocument();
    expect(screen.queryByTestId("our-menu-page")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /forno rosso/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Home" }));

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("cart-page")).not.toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
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
});
