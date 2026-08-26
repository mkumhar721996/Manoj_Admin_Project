import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";
import { loginWithFacebook } from "./facebookAuth";
import { setCurrentUser } from "./session";
import { authenticateFacebookUser } from "./userStore";

vi.mock("./facebookAuth");
vi.mock("./userStore");
vi.mock("./session");

describe("LoginPage", () => {
  beforeEach(() => {
    vi.mocked(loginWithFacebook).mockReset();
    vi.mocked(authenticateFacebookUser).mockReset();
    vi.mocked(setCurrentUser).mockReset();
  });

  it("logs the user in when Facebook registration was completed", async () => {
    const profile = { id: "fb-1", name: "Jane Doe", email: "jane@example.com" };
    const registeredUser = {
      id: "user-1",
      facebookId: "fb-1",
      name: "Jane Doe",
      email: "jane@example.com",
    };
    vi.mocked(loginWithFacebook).mockResolvedValue(profile);
    vi.mocked(authenticateFacebookUser).mockReturnValue(registeredUser);

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(
      screen.getByRole("button", { name: /continue with facebook/i }),
    );

    expect(await screen.findByText(/logged in/i)).toBeInTheDocument();
    expect(setCurrentUser).toHaveBeenCalledWith(registeredUser);
    expect(screen.queryByText(/no account found/i)).not.toBeInTheDocument();
  });

  it("rejects the login when Facebook registration was never completed", async () => {
    const profile = { id: "fb-404", name: "No One", email: "no@one.com" };
    vi.mocked(loginWithFacebook).mockResolvedValue(profile);
    vi.mocked(authenticateFacebookUser).mockReturnValue(null);

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(
      screen.getByRole("button", { name: /continue with facebook/i }),
    );

    expect(
      await screen.findByText(/no account found.*register/i),
    ).toBeInTheDocument();
    expect(setCurrentUser).not.toHaveBeenCalled();
  });
});
