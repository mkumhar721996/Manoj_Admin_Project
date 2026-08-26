import { useState } from "react";
import { CreateExpenseForm } from "../expenses/CreateExpenseForm";
import { ExpenseList } from "../expenses/ExpenseList";

export function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [expenseListVersion, setExpenseListVersion] = useState(0);

  function handleFormClose() {
    setShowForm(false);
    setExpenseListVersion((version) => version + 1);
  }

  return (
    <main data-testid="home-page">
      <h1>Home</h1>
      {showForm ? (
        <CreateExpenseForm onClose={handleFormClose} />
      ) : (
        <button type="button" onClick={() => setShowForm(true)}>
          Add Expense
        </button>
      )}
      <ExpenseList key={expenseListVersion} />
    </main>
  );
}
