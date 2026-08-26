import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RegisterPage } from "./RegisterPage";
import { loginWithFacebook } from "./facebookAuth";
import { createUserFromFacebookProfile } from "./userStore";

vi.mock("./facebookAuth");
vi.mock("./userStore");

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.mocked(loginWithFacebook).mockReset();
    vi.mocked(createUserFromFacebookProfile).mockReset();
  });

  it("creates a new account linked to the Facebook profile on registration", async () => {
    const profile = { id: "fb-1", name: "Jane Doe", email: "jane@example.com" };
    vi.mocked(loginWithFacebook).mockResolvedValue(profile);
    vi.mocked(createUserFromFacebookProfile).mockReturnValue({
      id: "user-1",
      facebookId: "fb-1",
      name: "Jane Doe",
      email: "jane@example.com",
    });

    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.click(
      screen.getByRole("button", { name: /continue with facebook/i }),
    );

    expect(createUserFromFacebookProfile).toHaveBeenCalledTimes(1);
    expect(createUserFromFacebookProfile).toHaveBeenCalledWith(profile);
    expect(
      await screen.findByText(/account created/i),
    ).toBeInTheDocument();
  });
});
