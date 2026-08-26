import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("opens the create expense form, saves on valid submit, and returns to the launching surface with no confirmation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /add expense/i }));
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/amount/i), "50");
    await user.type(screen.getByLabelText(/date/i), "2026-08-26");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.queryByLabelText(/amount/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add expense/i }),
    ).toBeInTheDocument();

    const stored = JSON.parse(localStorage.getItem("expenses") ?? "[]");
    expect(stored).toHaveLength(1);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText(/success|saved|added/i)).not.toBeInTheDocument();
  });
});
