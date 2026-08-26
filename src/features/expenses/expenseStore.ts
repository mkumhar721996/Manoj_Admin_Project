import type { Expense } from "../../types/expense";

const STORAGE_KEY = "expenses";

export function getExpenses(): Expense[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
}

export function addExpense(input: Omit<Expense, "id">): Expense {
  const expenses = getExpenses();
  const expense: Expense = { ...input, id: crypto.randomUUID() };
  expenses.push(expense);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  return expense;
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses().filter((expense) => expense.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}
