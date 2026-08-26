import type { Expense } from "../../types/expense";

const STORAGE_KEY = "expenses";

export function addExpense(input: Omit<Expense, "id">): Expense {
  const expenses: Expense[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) ?? "[]",
  );
  const expense: Expense = { ...input, id: crypto.randomUUID() };
  expenses.push(expense);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  return expense;
}
