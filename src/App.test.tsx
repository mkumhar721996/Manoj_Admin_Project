import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { addExpense } from "./features/expenses/expenseStore";

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

  it("shows a newly created expense in the list immediately, without a page reload", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /add expense/i }));
    await user.type(screen.getByLabelText(/amount/i), "50");
    await user.type(screen.getByLabelText(/date/i), "2026-08-26");
    await user.click(screen.getByRole("button", { name: /save/i }));

    const deleteButton = screen.getByRole("button", {
      name: "Delete expense of $50.00 on 2026-08-26",
    });
    await user.click(deleteButton);
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    const stored = JSON.parse(localStorage.getItem("expenses") ?? "[]");
    expect(stored).toHaveLength(0);
  });

  it("shows a confirmation dialog before deleting, then removes the expense and returns to the launching surface", async () => {
    addExpense({ amount: 12.5, date: "2026-08-26", category: "Food", notes: "" });
    const user = userEvent.setup();
    render(<App />);

    const deleteButton = screen.getByRole("button", {
      name: "Delete expense of $12.50 on 2026-08-26",
    });
    await user.click(deleteButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    let stored = JSON.parse(localStorage.getItem("expenses") ?? "[]");
    expect(stored).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    ).not.toBeInTheDocument();

    stored = JSON.parse(localStorage.getItem("expenses") ?? "[]");
    expect(stored).toHaveLength(0);
  });

  it("does not show the deleted expense in a fresh render after confirmed deletion", async () => {
    addExpense({ amount: 12.5, date: "2026-08-26", category: "Food", notes: "" });
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(
      screen.getByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    );
    await user.click(screen.getByRole("button", { name: /^delete$/i }));
    unmount();

    render(<App />);

    expect(
      screen.queryByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    ).not.toBeInTheDocument();
  });

  it("keeps the expense and stays on the current surface when deletion is cancelled", async () => {
    addExpense({ amount: 12.5, date: "2026-08-26", category: "Food", notes: "" });
    addExpense({ amount: 20, date: "2026-08-27", category: "Transport", notes: "cab" });
    const before = localStorage.getItem("expenses");
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    );
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Delete expense of $20.00 on 2026-08-27",
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(localStorage.getItem("expenses")).toBe(before);
  });
});
