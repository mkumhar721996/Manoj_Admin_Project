import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RegisterPage } from "./RegisterPage";
import { loginWithFacebook } from "./facebookAuth";
import { setCurrentUser } from "./session";
import { createUserFromFacebookProfile } from "./userStore";

vi.mock("./facebookAuth");
vi.mock("./userStore");
vi.mock("./session");

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.mocked(loginWithFacebook).mockReset();
    vi.mocked(createUserFromFacebookProfile).mockReset();
    vi.mocked(setCurrentUser).mockReset();
  });

  it("creates a new account linked to the Facebook profile on registration", async () => {
    const profile = { id: "fb-1", name: "Jane Doe", email: "jane@example.com" };
    const registeredUser = {
      id: "user-1",
      facebookId: "fb-1",
      name: "Jane Doe",
      email: "jane@example.com",
    };
    vi.mocked(loginWithFacebook).mockResolvedValue(profile);
    vi.mocked(createUserFromFacebookProfile).mockReturnValue(registeredUser);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /continue with facebook/i }),
    );

    expect(createUserFromFacebookProfile).toHaveBeenCalledTimes(1);
    expect(createUserFromFacebookProfile).toHaveBeenCalledWith(profile);
    expect(setCurrentUser).toHaveBeenCalledWith(registeredUser);
    expect(
      await screen.findByText(/account created/i),
    ).toBeInTheDocument();
  });

  it("shows an error message when the Facebook registration flow fails", async () => {
    vi.mocked(loginWithFacebook).mockRejectedValue(
      new Error("Facebook login was cancelled"),
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /continue with facebook/i }),
    );

    expect(
      await screen.findByText(/registration failed/i),
    ).toBeInTheDocument();
    expect(createUserFromFacebookProfile).not.toHaveBeenCalled();
    expect(setCurrentUser).not.toHaveBeenCalled();
  });
});
