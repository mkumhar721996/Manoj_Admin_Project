import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

describe("DeleteConfirmationDialog", () => {
  it("renders a dialog", () => {
    render(<DeleteConfirmationDialog onConfirm={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onConfirm and not onCancel when Delete is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<DeleteConfirmationDialog onConfirm={onConfirm} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("calls onCancel and not onConfirm when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<DeleteConfirmationDialog onConfirm={onConfirm} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
