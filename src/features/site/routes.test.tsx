import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createUserFromFacebookProfile } from "../auth/userStore";
import { setCurrentUser } from "../auth/session";
import { SiteRoutes } from "./routes";

describe("SiteRoutes", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    delete window.FB;
  });

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

  it("redirects to login when an unauthenticated user visits /profile", () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("profile-page")).not.toBeInTheDocument();
  });

  it("persists an edited profile field to the real user store", async () => {
    const registeredUser = createUserFromFacebookProfile({
      id: "fb-1",
      name: "Jane Doe",
      email: "jane@example.com",
    });
    setCurrentUser(registeredUser);
    window.FB = {
      login: () => {},
      getLoginStatus: (callback) => callback({ status: "connected" }),
      api: (_path, _params, callback) =>
        callback({ id: "fb-1", name: "Jane Doe", email: "jane@example.com" }),
    };

    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), "Jane Smith");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await screen.findByDisplayValue("Jane Smith");

    const stored = JSON.parse(localStorage.getItem("users") ?? "[]");
    const storedUser = stored.find(
      (candidate: { id: string }) => candidate.id === registeredUser.id,
    );
    expect(storedUser).toMatchObject({ name: "Jane Smith" });
  });

  it("logs out, clears the session, and returns to the login screen", async () => {
    const registeredUser = createUserFromFacebookProfile({
      id: "fb-1",
      name: "Jane Doe",
      email: "jane@example.com",
    });
    setCurrentUser(registeredUser);

    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <SiteRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("profile-page")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /log out/i }));

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("profile-page")).not.toBeInTheDocument();
    expect(localStorage.getItem("session")).toBeNull();
  });
});
