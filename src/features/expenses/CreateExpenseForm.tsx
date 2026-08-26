import { useState } from "react";
import type { FormEvent } from "react";
import { EXPENSE_CATEGORIES } from "./categories";
import { addExpense } from "./expenseStore";

type CreateExpenseFormProps = {
  onClose: () => void;
};

type FormErrors = {
  amount?: string;
  date?: string;
};

export function CreateExpenseForm({ onClose }: CreateExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!(Number(amount) > 0)) {
      nextErrors.amount = "Amount must be greater than 0";
    }
    if (!date) {
      nextErrors.date = "Date is required";
    }
    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    addExpense({ amount: Number(amount), date, category, notes });
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="expense-amount">Amount</label>
        <input
          id="expense-amount"
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          aria-describedby={errors.amount ? "expense-amount-error" : undefined}
        />
        {errors.amount && (
          <span id="expense-amount-error">{errors.amount}</span>
        )}
      </div>

      <div>
        <label htmlFor="expense-date">Date</label>
        <input
          id="expense-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          aria-describedby={errors.date ? "expense-date-error" : undefined}
        />
        {errors.date && <span id="expense-date-error">{errors.date}</span>}
      </div>

      <div>
        <label htmlFor="expense-category">Category</label>
        <select
          id="expense-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="" disabled>
            Select a category
          </option>
          {EXPENSE_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="expense-notes">Notes</label>
        <textarea
          id="expense-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>

      <button type="submit">Save</button>
    </form>
  );
}
