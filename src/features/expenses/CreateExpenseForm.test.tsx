import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateExpenseForm } from "./CreateExpenseForm";
import { EXPENSE_CATEGORIES } from "./categories";
import { addExpense } from "./expenseStore";

vi.mock("./expenseStore");

describe("CreateExpenseForm", () => {
  beforeEach(() => {
    vi.mocked(addExpense).mockClear();
  });

  it("renders empty amount, date, category, and notes fields", () => {
    render(<CreateExpenseForm onClose={vi.fn()} />);

    const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement;
    expect(amountInput).toHaveAttribute("type", "number");
    expect(amountInput.value).toBe("");

    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
    expect(dateInput).toHaveAttribute("type", "date");
    expect(dateInput.value).toBe("");

    const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement;
    expect(categorySelect.value).toBe("");
    for (const category of EXPENSE_CATEGORIES) {
      expect(
        screen.getByRole("option", { name: category }),
      ).toBeInTheDocument();
    }

    const notesInput = screen.getByLabelText(/notes/i) as HTMLTextAreaElement;
    expect(notesInput.tagName).toBe("TEXTAREA");
    expect(notesInput.value).toBe("");
  });

  it("saves the expense and closes on a valid submit", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CreateExpenseForm onClose={onClose} />);

    await user.type(screen.getByLabelText(/amount/i), "50");
    await user.type(screen.getByLabelText(/date/i), "2026-08-26");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(addExpense).toHaveBeenCalledTimes(1);
    expect(addExpense).toHaveBeenCalledWith({
      amount: 50,
      date: "2026-08-26",
      category: "",
      notes: "",
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it.each([["0"], ["-5"]])(
    "shows an inline amount error and keeps other fields intact when amount is %s",
    async (invalidAmount) => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<CreateExpenseForm onClose={onClose} />);

      await user.type(screen.getByLabelText(/date/i), "2026-08-26");
      await user.selectOptions(screen.getByLabelText(/category/i), "Food");
      await user.type(screen.getByLabelText(/notes/i), "lunch");
      await user.type(screen.getByLabelText(/amount/i), invalidAmount);
      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        screen.getByText(/amount must be greater than 0/i),
      ).toBeInTheDocument();
      expect((screen.getByLabelText(/date/i) as HTMLInputElement).value).toBe(
        "2026-08-26",
      );
      expect(
        (screen.getByLabelText(/category/i) as HTMLSelectElement).value,
      ).toBe("Food");
      expect(
        (screen.getByLabelText(/notes/i) as HTMLTextAreaElement).value,
      ).toBe("lunch");
      expect(addExpense).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    },
  );

  it("shows an inline date error and keeps other fields intact when date is missing", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CreateExpenseForm onClose={onClose} />);

    await user.type(screen.getByLabelText(/amount/i), "20");
    await user.selectOptions(screen.getByLabelText(/category/i), "Food");
    await user.type(screen.getByLabelText(/notes/i), "lunch");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/date is required/i)).toBeInTheDocument();
    expect((screen.getByLabelText(/amount/i) as HTMLInputElement).value).toBe(
      "20",
    );
    expect(
      (screen.getByLabelText(/category/i) as HTMLSelectElement).value,
    ).toBe("Food");
    expect(
      (screen.getByLabelText(/notes/i) as HTMLTextAreaElement).value,
    ).toBe("lunch");
    expect(addExpense).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows both amount and date errors simultaneously when both are invalid", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CreateExpenseForm onClose={onClose} />);

    await user.type(screen.getByLabelText(/amount/i), "-1");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(
      screen.getByText(/amount must be greater than 0/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/date is required/i)).toBeInTheDocument();
    expect(addExpense).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("saves successfully with empty notes and otherwise valid data", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CreateExpenseForm onClose={onClose} />);

    await user.type(screen.getByLabelText(/amount/i), "15");
    await user.type(screen.getByLabelText(/date/i), "2026-08-26");
    await user.selectOptions(screen.getByLabelText(/category/i), "Food");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(addExpense).toHaveBeenCalledWith({
      amount: 15,
      date: "2026-08-26",
      category: "Food",
      notes: "",
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});
