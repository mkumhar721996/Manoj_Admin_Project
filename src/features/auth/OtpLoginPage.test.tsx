import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OtpLoginPage } from "./OtpLoginPage";
import { requestOtpLogin } from "./otpAuth";
import { setCurrentUser } from "./session";
import {
  authenticateOtpUser,
  findOtpCollision,
  linkOtpToExistingUser,
} from "./userStore";

vi.mock("./otpAuth");
vi.mock("./userStore");
vi.mock("./session");

describe("OtpLoginPage", () => {
  beforeEach(() => {
    vi.mocked(requestOtpLogin).mockReset();
    vi.mocked(authenticateOtpUser).mockReset();
    vi.mocked(findOtpCollision).mockReset();
    vi.mocked(linkOtpToExistingUser).mockReset();
    vi.mocked(setCurrentUser).mockReset();
  });

  async function submitIdentifier(identifier: string) {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OtpLoginPage />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByLabelText(/phone or email/i),
      identifier,
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    return user;
  }

  it("logs the user in when an OTP account exists", async () => {
    const registeredUser = { id: "user-1", name: "Jane Doe", otpIdentifier: "jane@example.com" };
    vi.mocked(requestOtpLogin).mockResolvedValue("jane@example.com");
    vi.mocked(authenticateOtpUser).mockReturnValue(registeredUser);

    await submitIdentifier("jane@example.com");

    expect(await screen.findByText(/logged in/i)).toBeInTheDocument();
    expect(setCurrentUser).toHaveBeenCalledWith(registeredUser);
  });

  it("shows a not-found message when no OTP account and no collision exist", async () => {
    vi.mocked(requestOtpLogin).mockResolvedValue("no@one.com");
    vi.mocked(authenticateOtpUser).mockReturnValue(null);
    vi.mocked(findOtpCollision).mockReturnValue(undefined);

    await submitIdentifier("no@one.com");

    expect(await screen.findByText(/no account found/i)).toBeInTheDocument();
    expect(setCurrentUser).not.toHaveBeenCalled();
  });

  it("shows an error message when the OTP request fails", async () => {
    vi.mocked(requestOtpLogin).mockRejectedValue(new Error("failed"));

    await submitIdentifier("jane@example.com");

    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
    expect(setCurrentUser).not.toHaveBeenCalled();
  });

  describe("when the OTP identifier collides with an existing Facebook account", () => {
    const collidingUser = {
      id: "user-1",
      name: "Jane Doe",
      facebookId: "fb-1",
      email: "jane@example.com",
    };

    async function loginAndReachPrompt() {
      vi.mocked(requestOtpLogin).mockResolvedValue("jane@example.com");
      vi.mocked(authenticateOtpUser).mockReturnValue(null);
      vi.mocked(findOtpCollision).mockReturnValue(collidingUser);

      const user = await submitIdentifier("jane@example.com");

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
      const linkedUser = { ...collidingUser, otpIdentifier: "jane@example.com" };
      vi.mocked(linkOtpToExistingUser).mockReturnValue(linkedUser);
      const user = await loginAndReachPrompt();

      await user.click(screen.getByRole("button", { name: /link accounts/i }));

      expect(linkOtpToExistingUser).toHaveBeenCalledTimes(1);
      expect(linkOtpToExistingUser).toHaveBeenCalledWith(
        collidingUser.id,
        "jane@example.com",
      );
      expect(setCurrentUser).toHaveBeenCalledWith(linkedUser);
      expect(await screen.findByText(/logged in/i)).toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does not merge accounts or authenticate, and returns to the login screen when declined", async () => {
      const user = await loginAndReachPrompt();

      await user.click(screen.getByRole("button", { name: /not now/i }));

      expect(linkOtpToExistingUser).not.toHaveBeenCalled();
      expect(setCurrentUser).not.toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.getByLabelText(/phone or email/i)).toBeInTheDocument();
      expect(screen.queryByText(/logged in/i)).not.toBeInTheDocument();
    });
  });
});
