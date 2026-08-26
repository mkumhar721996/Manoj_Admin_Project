import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExpenseList } from "./ExpenseList";
import { deleteExpense, getExpenses } from "./expenseStore";

vi.mock("./expenseStore");

const firstExpense = {
  id: "id-1",
  amount: 12.5,
  date: "2026-08-26",
  category: "Food",
  notes: "",
};

const secondExpense = {
  id: "id-2",
  amount: 20,
  date: "2026-08-27",
  category: "Transport",
  notes: "cab",
};

describe("ExpenseList", () => {
  beforeEach(() => {
    vi.mocked(getExpenses).mockReset();
    vi.mocked(deleteExpense).mockReset();
  });

  it("shows a confirmation dialog and does not delete when Delete is clicked", async () => {
    vi.mocked(getExpenses).mockReturnValue([firstExpense]);
    const user = userEvent.setup();
    render(<ExpenseList />);

    await user.click(
      screen.getByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(deleteExpense).not.toHaveBeenCalled();
  });

  it("deletes the expense when confirmed in the dialog", async () => {
    vi.mocked(getExpenses).mockReturnValue([firstExpense]);
    const user = userEvent.setup();
    render(<ExpenseList />);

    await user.click(
      screen.getByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    );
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(deleteExpense).toHaveBeenCalledTimes(1);
    expect(deleteExpense).toHaveBeenCalledWith("id-1");
  });

  it("closes the dialog and stays on the list after confirming", async () => {
    vi.mocked(getExpenses).mockReturnValue([firstExpense]);
    const user = userEvent.setup();
    render(<ExpenseList />);

    await user.click(
      screen.getByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    );
    vi.mocked(getExpenses).mockReturnValue([]);
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("expense-list")).toBeInTheDocument();
  });

  it("closes the dialog without deleting when Cancel is clicked", async () => {
    vi.mocked(getExpenses).mockReturnValue([firstExpense]);
    const user = userEvent.setup();
    render(<ExpenseList />);

    await user.click(
      screen.getByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    );
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(deleteExpense).not.toHaveBeenCalled();
  });

  it("keeps the expense listed after cancelling", async () => {
    vi.mocked(getExpenses).mockReturnValue([firstExpense]);
    const user = userEvent.setup();
    render(<ExpenseList />);

    await user.click(
      screen.getByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    );
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(
      screen.getByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("expense-list")).toBeInTheDocument();
  });

  it("re-fetches the list from the store after a confirmed deletion", async () => {
    vi.mocked(getExpenses).mockReturnValue([firstExpense, secondExpense]);
    const user = userEvent.setup();
    render(<ExpenseList />);

    vi.mocked(getExpenses).mockReturnValue([secondExpense]);
    await user.click(
      screen.getByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    );
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(
      screen.queryByRole("button", {
        name: "Delete expense of $12.50 on 2026-08-26",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Delete expense of $20.00 on 2026-08-27",
      }),
    ).toBeInTheDocument();
  });
});
