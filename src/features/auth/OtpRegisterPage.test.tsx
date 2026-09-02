import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OtpRegisterPage } from "./OtpRegisterPage";
import { requestOtpRegistration } from "./otpAuth";
import { setCurrentUser } from "./session";
import { createUserFromOtpProfile } from "./userStore";

vi.mock("./otpAuth");
vi.mock("./userStore");
vi.mock("./session");

describe("OtpRegisterPage", () => {
  beforeEach(() => {
    vi.mocked(requestOtpRegistration).mockReset();
    vi.mocked(createUserFromOtpProfile).mockReset();
    vi.mocked(setCurrentUser).mockReset();
  });

  it("creates a new account linked to the OTP identifier on registration", async () => {
    const profile = { identifier: "jane@example.com", name: "Jane Doe" };
    const registeredUser = {
      id: "user-1",
      name: "Jane Doe",
      otpIdentifier: "jane@example.com",
    };
    vi.mocked(requestOtpRegistration).mockResolvedValue(profile);
    vi.mocked(createUserFromOtpProfile).mockReturnValue(registeredUser);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OtpRegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/phone or email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/name/i), "Jane Doe");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(createUserFromOtpProfile).toHaveBeenCalledTimes(1);
    expect(createUserFromOtpProfile).toHaveBeenCalledWith(profile);
    expect(setCurrentUser).toHaveBeenCalledWith(registeredUser);
    expect(await screen.findByText(/account created/i)).toBeInTheDocument();
  });

  it("shows an error message when the OTP registration flow fails", async () => {
    vi.mocked(requestOtpRegistration).mockRejectedValue(new Error("failed"));

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OtpRegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/phone or email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/name/i), "Jane Doe");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/registration failed/i)).toBeInTheDocument();
    expect(createUserFromOtpProfile).not.toHaveBeenCalled();
    expect(setCurrentUser).not.toHaveBeenCalled();
  });
});
