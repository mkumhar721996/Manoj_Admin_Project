import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { SiteRoutes } from "./routes";

describe("HomePage", () => {
  it("shows the featured menu section on the home page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByText(/chef recommendations/i)).toBeInTheDocument();
    expect(
      screen.getByText(/popular sourdough pizzas/i),
    ).toBeInTheDocument();
  });

  it("shows the footer's kitchen hours and pizzeria location on the home page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /kitchen hours/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /pizzeria location/i }),
    ).toBeInTheDocument();
  });

  it("navigates to the menu page when 'Add to Order' is clicked, with no cart logic triggered", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    const addToOrderLinks = screen.getAllByRole("link", {
      name: /add to order/i,
    });
    expect(addToOrderLinks.length).toBeGreaterThan(0);

    await user.click(addToOrderLinks[0]);

    expect(screen.getByTestId("our-menu-page")).toBeInTheDocument();
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();

    expect(screen.queryByText(/cart/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cart/i }),
    ).not.toBeInTheDocument();
  });
});
