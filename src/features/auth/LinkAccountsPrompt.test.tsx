import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LinkAccountsPrompt } from "./LinkAccountsPrompt";

describe("LinkAccountsPrompt", () => {
  const collidingUser = { id: "u1", name: "Jane", email: "jane@x.com" };

  it("renders a dialog explaining the collision", () => {
    render(
      <LinkAccountsPrompt
        collidingUser={collidingUser}
        onConfirm={vi.fn()}
        onDecline={vi.fn()}
      />,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/account already exists/i);
    expect(dialog).toHaveTextContent("jane@x.com");
  });

  it("calls onConfirm and not onDecline when Link accounts is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onDecline = vi.fn();
    render(
      <LinkAccountsPrompt
        collidingUser={collidingUser}
        onConfirm={onConfirm}
        onDecline={onDecline}
      />,
    );

    await user.click(screen.getByRole("button", { name: /link accounts/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onDecline).not.toHaveBeenCalled();
  });

  it("calls onDecline and not onConfirm when Not now is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onDecline = vi.fn();
    render(
      <LinkAccountsPrompt
        collidingUser={collidingUser}
        onConfirm={onConfirm}
        onDecline={onDecline}
      />,
    );

    await user.click(screen.getByRole("button", { name: /not now/i }));

    expect(onDecline).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("shows an error message inside the dialog when provided, while keeping it open for retry", () => {
    render(
      <LinkAccountsPrompt
        collidingUser={collidingUser}
        error="Unable to verify ownership of the linked account. Please try again."
        onConfirm={vi.fn()}
        onDecline={vi.fn()}
      />,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent(/unable to verify ownership/i);
    expect(
      screen.getByRole("button", { name: /link accounts/i }),
    ).toBeInTheDocument();
  });

  it("renders no error text when none is provided", () => {
    render(
      <LinkAccountsPrompt
        collidingUser={collidingUser}
        onConfirm={vi.fn()}
        onDecline={vi.fn()}
      />,
    );

    expect(screen.queryByText(/unable to verify ownership/i)).not.toBeInTheDocument();
  });
});
