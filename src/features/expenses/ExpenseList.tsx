import { useState } from "react";
import type { Expense } from "../../types/expense";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { deleteExpense, getExpenses } from "./expenseStore";

export function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>(() => getExpenses());
  const [pendingDeletion, setPendingDeletion] = useState<Expense | null>(null);

  function handleConfirm() {
    if (!pendingDeletion) {
      return;
    }
    deleteExpense(pendingDeletion.id);
    setExpenses(getExpenses());
    setPendingDeletion(null);
  }

  function handleCancel() {
    setPendingDeletion(null);
  }

  return (
    <div data-testid="expense-list">
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.date} · {expense.category || "Uncategorized"} · $
            {expense.amount.toFixed(2)}
            <button
              type="button"
              aria-label={`Delete expense of $${expense.amount.toFixed(2)} on ${expense.date}`}
              onClick={() => setPendingDeletion(expense)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {pendingDeletion && (
        <DeleteConfirmationDialog
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
