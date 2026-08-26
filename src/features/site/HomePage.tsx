import { useState } from "react";
import { CreateExpenseForm } from "../expenses/CreateExpenseForm";
import { ExpenseList } from "../expenses/ExpenseList";
import { FeaturedSection } from "./FeaturedSection";

export function HomePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main data-testid="home-page">
      <h1>Home</h1>
      {showForm ? (
        <CreateExpenseForm onClose={() => setShowForm(false)} />
      ) : (
        <button type="button" onClick={() => setShowForm(true)}>
          Add Expense
        </button>
      )}
      <ExpenseList />
      <FeaturedSection />
    </main>
  );
}
