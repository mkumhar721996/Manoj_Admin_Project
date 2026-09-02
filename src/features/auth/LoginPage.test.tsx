import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";
import { loginWithFacebook } from "./facebookAuth";
import { setCurrentUser } from "./session";
import {
  authenticateFacebookUser,
  findFacebookCollision,
  linkFacebookToExistingUser,
} from "./userStore";

vi.mock("./facebookAuth");
vi.mock("./userStore");
vi.mock("./session");

describe("LoginPage", () => {
  beforeEach(() => {
    vi.mocked(loginWithFacebook).mockReset();
    vi.mocked(authenticateFacebookUser).mockReset();
    vi.mocked(findFacebookCollision).mockReset();
    vi.mocked(linkFacebookToExistingUser).mockReset();
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
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

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
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /continue with facebook/i }),
    );

    expect(
      await screen.findByText(/no account found.*register/i),
    ).toBeInTheDocument();
    expect(setCurrentUser).not.toHaveBeenCalled();
  });

  it("shows an error message when the Facebook login flow fails", async () => {
    vi.mocked(loginWithFacebook).mockRejectedValue(
      new Error("Facebook login was cancelled"),
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /continue with facebook/i }),
    );

    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
    expect(authenticateFacebookUser).not.toHaveBeenCalled();
    expect(setCurrentUser).not.toHaveBeenCalled();
  });

  describe("when the Facebook identity collides with an existing OTP account", () => {
    const profile = { id: "fb-1", name: "Jane Doe", email: "jane@example.com" };
    const collidingUser = {
      id: "user-1",
      name: "Jane Doe",
      otpIdentifier: "jane@example.com",
    };

    async function loginAndReachPrompt() {
      vi.mocked(loginWithFacebook).mockResolvedValue(profile);
      vi.mocked(authenticateFacebookUser).mockReturnValue(null);
      vi.mocked(findFacebookCollision).mockReturnValue(collidingUser);

      const user = userEvent.setup();
      render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

      await user.click(
        screen.getByRole("button", { name: /continue with facebook/i }),
      );

      expect(await screen.findByRole("dialog")).toBeInTheDocument();
      return user;
    }

    it("surfaces a link-accounts prompt before proceeding, without authenticating", async () => {
      await loginAndReachPrompt();

      expect(screen.getByRole("dialog")).toHaveTextContent(
        /account already exists/i,
      );
      expect(setCurrentUser).not.toHaveBeenCalled();
    });

    it("links both methods to the same account and authenticates when confirmed", async () => {
      const linkedUser = { ...collidingUser, facebookId: "fb-1" };
      vi.mocked(linkFacebookToExistingUser).mockReturnValue(linkedUser);
      const user = await loginAndReachPrompt();

      await user.click(screen.getByRole("button", { name: /link accounts/i }));

      expect(linkFacebookToExistingUser).toHaveBeenCalledTimes(1);
      expect(linkFacebookToExistingUser).toHaveBeenCalledWith(
        collidingUser.id,
        profile,
      );
      expect(setCurrentUser).toHaveBeenCalledWith(linkedUser);
      expect(await screen.findByText(/logged in/i)).toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does not merge accounts or authenticate, and returns to the login screen when declined", async () => {
      const user = await loginAndReachPrompt();

      await user.click(screen.getByRole("button", { name: /not now/i }));

      expect(linkFacebookToExistingUser).not.toHaveBeenCalled();
      expect(setCurrentUser).not.toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /continue with facebook/i }),
      ).toBeInTheDocument();
      expect(screen.queryByText(/logged in/i)).not.toBeInTheDocument();
    });
  });
});
