# Plan: MANOJ-ADMIN-PROJECT-STORY-003 — Delete Expense

## Context / codebase fit

Traced the live app tree from `src/main.tsx`: it mounts `App` (`src/App.tsx`), which now
renders `<BrowserRouter><SiteRoutes /></BrowserRouter>` (`src/features/site/routes.tsx`). `SiteRoutes`
wraps `Layout` (renders `SiteHeader` + `<Outlet />`) around `HomePage` at `/`
(`src/features/site/HomePage.tsx`). `HomePage` is where STORY-001's "Add Expense" button /
`CreateExpenseForm` toggle actually lives today — it is the real, reachable "launching surface"
for the expense feature (confirmed by the existing `src/App.test.tsx`, which renders `<App />` and
exercises that exact flow end-to-end).

There is currently **no UI that lists existing expense records** — only create. `expenseStore.ts`
only exports `addExpense`. To satisfy AC1 ("GIVEN an existing expense record"), this story must add
the minimal scaffolding to display existing records so one can be targeted for deletion, matching
STORY-001's precedent of building only the minimal "launching surface" needed for its ACs (no
edit UI, no filtering/sorting — that's other stories' scope).

Design decisions (flagged for reviewer sign-off, same style as prior plans):
- **Confirmation dialog is an in-page React component (`role="dialog"`), not `window.confirm`.**
  A native `confirm()` is not practical to drive/assert against with RTL in the same way as the
  rest of this codebase's tests (`CreateExpenseForm.test.tsx`, `SiteHeader.test.tsx`), and every
  existing dialog-like UI in this repo is a plain component, not a browser API. This keeps the
  delete flow testable and consistent with the rest of the app.
- **The list lives in `src/features/expenses/ExpenseList.tsx` and is mounted in `HomePage.tsx`**
  (the real launching surface per the trace above), rendered alongside the existing "Add
  Expense" button/form — not a new route. Since the dialog is an overlay on the same page rather
  than a navigation, "returned to / remains on the launching surface" (AC3/AC6) is satisfied by
  the dialog unmounting and the underlying `HomePage` (list + Add Expense control) staying put.
- **No edit affordance, no undo, no "success" messaging.** Only delete is in scope; STORY-001
  already established the "no confirmation banner" pattern (see its AC6/`App.test.tsx` asserting
  no `role="status"`/`role="alert"`/success text), so the new dialog and list avoid that wording
  too, to not regress that existing test.
- Each list item shows `date · category (or "Uncategorized" if empty) · $amount`, and its Delete
  button carries an `aria-label` naming the specific expense (e.g. `Delete expense of $12.50 on
  2026-08-26`) so tests can target one item unambiguously when multiple exist.

## Foundation — `getExpenses` / `deleteExpense` in the store

**Failing test first** (`src/features/expenses/expenseStore.test.ts`, extend existing file):
- `getExpenses()`: seed `localStorage` with two expenses via `addExpense`; assert `getExpenses()`
  returns both, in insertion order.
- `deleteExpense(id)`: seed two expenses; call `deleteExpense` with the first one's id; assert
  `getExpenses()` (a fresh call, not cached component state) now returns only the second one, and
  that a re-read of raw `localStorage.getItem('expenses')` also no longer contains the deleted id
  (proves real persisted removal, not just an in-memory filter) — this is the store-level basis for
  AC7.
- `deleteExpense(id)` for a non-existent id: assert it doesn't throw and leaves the existing array
  unchanged (defensive baseline, no AC removed by this).

**Minimal code** (`src/features/expenses/expenseStore.ts`):
- `export function getExpenses(): Expense[]` — `JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")`.
- `export function deleteExpense(id: string): void` — `getExpenses().filter(e => e.id !== id)`,
  write back with `localStorage.setItem`.
- Refactor `addExpense` to read via `getExpenses()` instead of duplicating the `JSON.parse` line
  (trivial dedup, not a behavior change).

**Files**: modify `src/features/expenses/expenseStore.ts`, `src/features/expenses/expenseStore.test.ts`.

## `DeleteConfirmationDialog` — dumb confirm/cancel component

**Failing test first** (`src/features/expenses/DeleteConfirmationDialog.test.tsx`, new):
- Render `<DeleteConfirmationDialog onConfirm={vi.fn()} onCancel={vi.fn()} />`.
- Assert `getByRole('dialog')` exists.
- Click the "Delete" button inside the dialog → assert `onConfirm` called once, `onCancel` not called.
- Click the "Cancel" button → (fresh render) assert `onCancel` called once, `onConfirm` not called.

**Minimal code** (`src/features/expenses/DeleteConfirmationDialog.tsx`):
- Props `{ onConfirm: () => void; onCancel: () => void }`.
- Renders a `<div role="dialog" aria-modal="true" aria-label="Confirm deletion">` containing a
  message ("Delete this expense? This action cannot be undone.") and two buttons: "Delete" (calls
  `onConfirm`) and "Cancel" (calls `onCancel`).

**Files**: create `src/features/expenses/DeleteConfirmationDialog.tsx`,
`src/features/expenses/DeleteConfirmationDialog.test.tsx`.

## `ExpenseList` — the launching surface, wired to the store + dialog

This component covers AC1, AC2, AC4, AC5 directly; AC3/AC6 are covered here at the component level
and confirmed end-to-end in the `App.test.tsx` integration tests below.

**Failing test first** (`src/features/expenses/ExpenseList.test.tsx`, new; `vi.mock("./expenseStore")`
the same way `CreateExpenseForm.test.tsx` mocks it):
1. **AC1** — seed `getExpenses` mock to return one expense; render `<ExpenseList />`; click its
   Delete button (matched via the per-item `aria-label`); assert `getByRole('dialog')` now appears
   and `deleteExpense` has NOT been called (nothing removed before confirmation).
2. **AC2** — with the dialog open (from step 1's flow), click "Delete" inside the dialog; assert
   `deleteExpense` was called exactly once with that expense's `id`.
3. **AC3** — after confirming, assert `queryByRole('dialog')` is gone and the list container
   (`getByTestId('expense-list')`) is still rendered.
4. **AC4** — open the dialog for an item, click "Cancel"; assert `queryByRole('dialog')` is gone.
5. **AC5** — after that cancel, assert `deleteExpense` was never called.
6. **AC6** — after that cancel, assert the original item's row/label is still present in the list
   (`getByRole('button', { name: <that item's delete aria-label> })` still exists) and the list
   container is still rendered.
7. Regression: seed two expenses, delete one via full click→confirm flow; assert the mocked
   `getExpenses` re-fetch after deletion drives the list to show only the remaining one (proves the
   component re-reads the store rather than just splicing local state).

**Minimal code** (`src/features/expenses/ExpenseList.tsx`):
- `useState<Expense[]>(() => getExpenses())` for the list, `useState<Expense | null>(null)` for
  `pendingDeletion`.
- Renders a `<div data-testid="expense-list">` wrapping a `<ul>` of `<li>` rows (date · category ·
  amount + the labeled Delete button per item above), and conditionally renders
  `<DeleteConfirmationDialog>` when `pendingDeletion` is set.
- Delete button `onClick` sets `pendingDeletion` to that expense.
- Dialog's `onConfirm`: call `deleteExpense(pendingDeletion.id)`, then `setExpenses(getExpenses())`
  (re-fetch, not local filter), then `setPendingDeletion(null)`.
- Dialog's `onCancel`: `setPendingDeletion(null)` only — no store call.

**Files**: create `src/features/expenses/ExpenseList.tsx`, `src/features/expenses/ExpenseList.test.tsx`.

## Wire `ExpenseList` into the launching surface

Not tied to one AC in isolation — required so AC1–AC7 are reachable from the real app tree, not
just in component isolation.

**Minimal code**: in `src/features/site/HomePage.tsx`, render `<ExpenseList />` unconditionally
(alongside the existing Add Expense button/form toggle), so existing records are always visible on
the launching surface regardless of whether the create form is open.

**Files**: modify `src/features/site/HomePage.tsx`.

## End-to-end coverage (AC1–AC7 against the real store, real launching surface)

**Failing tests first** (`src/App.test.tsx`, extend existing file — real `expenseStore`,
`localStorage.clear()` in `beforeEach` as already set up):
1. Seed one expense directly via `addExpense` before rendering `<App />` (or drive it through the
   existing "Add Expense" flow already covered by the current test). Render `<App />`; assert the
   expense appears in the list on the home surface.
2. Click its Delete button → **AC1**: assert the confirmation dialog (`getByRole('dialog')`)
   appears and raw `localStorage` still contains the expense (nothing removed pre-confirmation).
3. Click "Delete" inside the dialog → **AC2/AC3**: assert raw `localStorage.getItem('expenses')`
   no longer contains that expense's id; assert the dialog is gone and the home surface
   (`getByTestId('home-page')`) is still rendered with the item no longer listed.
4. **AC7**: unmount and re-render a fresh `<App />` (simulating a subsequent visit/reload against
   the same `localStorage`); assert the deleted expense still does not appear anywhere in the
   rendered list — proving the removal was truly persisted, not just component state.
5. Separate test: seed two expenses; open the dialog for one and click "Cancel" →
   **AC4/AC5/AC6**: assert the dialog is gone, both expenses are still listed, and raw
   `localStorage` is byte-for-byte unchanged from before the cancel.

**Minimal code**: none expected beyond the components above — this test suite exercises the real
wiring end-to-end and should pass by construction once the pieces above are correct; if it doesn't,
fix the wiring (not add new abstractions).

**Files**: modify `src/App.test.tsx`.

## Execution order

1. `expenseStore` tests (`getExpenses`, `deleteExpense`) → store code.
2. `DeleteConfirmationDialog` test → dialog component.
3. `ExpenseList` tests (AC1–AC6 in isolation, mocked store) → list component.
4. Wire `ExpenseList` into `HomePage.tsx`.
5. `App.test.tsx` end-to-end tests (AC1–AC7 against the real store and real launching surface).
6. Full `vitest run` pass; confirm the pre-existing `App.test.tsx` "Add Expense" test still passes
   unmodified (no `role="status"`/`role="alert"`/success-text regression from the new list/dialog).
