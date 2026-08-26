import { beforeEach, describe, expect, it } from "vitest";
import { addExpense } from "./expenseStore";

describe("expenseStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("appends a new expense with a generated id to localStorage", () => {
    addExpense({ amount: 12.5, date: "2026-08-26", category: "Food", notes: "" });

    const stored = JSON.parse(localStorage.getItem("expenses") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      amount: 12.5,
      date: "2026-08-26",
      category: "Food",
      notes: "",
    });
    expect(typeof stored[0].id).toBe("string");
    expect(stored[0].id.length).toBeGreaterThan(0);
  });

  it("appends rather than overwrites on subsequent calls", () => {
    addExpense({ amount: 10, date: "2026-08-26", category: "Food", notes: "" });
    addExpense({ amount: 20, date: "2026-08-27", category: "Transport", notes: "cab" });

    const stored = JSON.parse(localStorage.getItem("expenses") ?? "[]");
    expect(stored).toHaveLength(2);
  });
});
