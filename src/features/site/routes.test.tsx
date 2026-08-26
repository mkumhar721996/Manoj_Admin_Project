import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
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
});
