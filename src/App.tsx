import { useState } from "react";
import { CreateExpenseForm } from "./features/expenses/CreateExpenseForm";

export function App() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <CreateExpenseForm onClose={() => setShowForm(false)} />;
  }

  return (
    <button type="button" onClick={() => setShowForm(true)}>
      Add Expense
    </button>
  );
}
