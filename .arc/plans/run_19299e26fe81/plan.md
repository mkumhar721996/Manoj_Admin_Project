# Plan: MANOJ-ADMIN-PROJECT-STORY-001 — Create Expense

## Context / assumptions

The repository is currently empty (only `README.md`, `.env`, `.git`). There is no existing
frontend app, framework, or test runner to conform to, so this story also stands up the minimal
project scaffolding. Since this is the first story in the "Expense Entry" epic, scaffolding is
kept to the smallest footprint that lets the ACs be implemented and tested — no list/edit/delete
UI is built, only a placeholder "launching surface" needed to prove open/close behavior (AC2, AC6).

Stack choice: React + TypeScript + Vite, tested with Vitest + React Testing Library (RTL) +
jest-dom + user-event, jsdom environment. Persistence: browser `localStorage`, matching the epic's
"single local user, no authentication, saved locally" framing.

Assumptions flagged for reviewer sign-off (nothing in the ticket specifies these — pick sensible
defaults, trivially changed later since each is a single constant/config):
- Fixed category list: `Food, Transport, Housing, Utilities, Entertainment, Health, Other`.
- Category field has no AC requiring it to be validated as required — only amount and date have
  validation ACs (AC3, AC4). Category and notes are optional; nothing blocks a save if category is
  left unselected. This is intentional minimalism per "stay within the ACs."
- "Launching surface" is modeled as a minimal `App` component with an "Add Expense" button; when
  the form closes on success, the button/surface becomes visible again with no confirmation banner
  (AC6).

## Step 0 — Project scaffolding (infra, not TDD)

Not tied to a single AC; required before any test can run.

Files to create:
- `package.json` — deps: `react`, `react-dom`; devDeps: `vite`, `@vitejs/plugin-react`,
  `typescript`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`,
  `@testing-library/user-event`. Scripts: `dev`, `build`, `test` (`vitest run`).
- `vite.config.ts` — React plugin; `test` config with `environment: 'jsdom'`,
  `setupFiles: './src/setupTests.ts'`.
- `tsconfig.json` — standard React/Vite TS config.
- `index.html`, `src/main.tsx` — app entry mounting `<App />`.
- `src/setupTests.ts` — `import '@testing-library/jest-dom'`.
- `src/types/expense.ts` — `Expense` type: `{ id: string; amount: number; date: string; category: string; notes: string }`.
- `src/features/expenses/categories.ts` — `export const EXPENSE_CATEGORIES = [...]  as const`.

## AC1 — Form renders empty fields (amount, date, category, notes)

**Failing test first** (`src/features/expenses/CreateExpenseForm.test.tsx`):
- Render `<CreateExpenseForm onClose={vi.fn()} />`.
- Assert an amount `<input type="number">` exists and its value is `''`.
- Assert a date `<input type="date">` exists and its value is `''`.
- Assert a category `<select>` exists, its value is `''` (placeholder/unselected), and it lists
  every entry from `EXPENSE_CATEGORIES` as an `<option>`.
- Assert a notes `<textarea>` exists and its value is `''`.

**Minimal code**:
- `src/features/expenses/CreateExpenseForm.tsx` — controlled component with local state
  `{ amount: '', date: '', category: '', notes: '' }`, rendering the four labeled fields (amount
  number input, date input, category select with a disabled placeholder option + `EXPENSE_CATEGORIES`
  options, notes textarea) and a submit button. No submit handler logic yet.

**Files**: create `src/features/expenses/CreateExpenseForm.tsx`,
`src/features/expenses/CreateExpenseForm.test.tsx`.

## Persistence foundation (underpins AC2, needed before wiring submit)

**Failing test first** (`src/features/expenses/expenseStore.test.ts`):
- Clear `localStorage` in `beforeEach`.
- Call `addExpense({ amount: 12.5, date: '2026-08-26', category: 'Food', notes: '' })`.
- Assert `localStorage.getItem('expenses')` parses to an array containing one entry with the
  given `amount`, `date`, `category`, `notes`, and a generated string `id`.
- Call `addExpense` a second time and assert the array now has two entries (append, not overwrite).

**Minimal code**:
- `src/features/expenses/expenseStore.ts` — `addExpense(input)` reads the `expenses` key from
  `localStorage` (defaulting to `[]`), appends `{ ...input, id: crypto.randomUUID() }`, writes it
  back with `JSON.stringify`.

**Files**: create `src/features/expenses/expenseStore.ts`, `src/features/expenses/expenseStore.test.ts`.

## AC2 — Valid submit saves locally and closes, returning to launching surface

**Failing test first**, two levels:
1. `CreateExpenseForm.test.tsx` (unit, `vi.mock('./expenseStore')`): fill amount `50`, date
   `2026-08-26`, submit. Assert `addExpense` was called once with
   `{ amount: 50, date: '2026-08-26', category: '', notes: '' }`, and assert the `onClose` prop
   was called once.
2. `src/App.test.tsx` (integration, real `expenseStore`, `localStorage` cleared each test): render
   `<App />`, click "Add Expense" (launching surface), the form appears; fill amount + date,
   submit; assert the form is no longer in the DOM and the "Add Expense" launching surface is
   visible again.

**Minimal code**:
- In `CreateExpenseForm.tsx`: submit handler calls `addExpense({ amount: Number(amount), date, category, notes })`
  then `props.onClose()` when there are no validation errors (validation added in AC3/AC4 below;
  for this step, "no errors" trivially holds since no validation exists yet).
- `src/App.tsx` — `showForm` boolean state; renders "Add Expense" button when `false`; renders
  `<CreateExpenseForm onClose={() => setShowForm(false)} />` when `true`.

**Files**: modify `src/features/expenses/CreateExpenseForm.tsx`; create `src/App.tsx`,
`src/App.test.tsx`.

## AC3 — Amount zero/negative shows inline error, form stays open, other fields intact

**Failing test first** (`CreateExpenseForm.test.tsx`): fill date `2026-08-26`, category `Food`,
notes `"lunch"`, set amount to `0` (and a second case: `-5`), submit. Assert an error message is
rendered adjacent to the amount field (e.g. `getByText(/amount must be greater than 0/i)`,
associated via `aria-describedby`), the form's fields still show `date=2026-08-26`,
`category=Food`, `notes=lunch`, and `addExpense`/`onClose` were NOT called.

**Minimal code**: add a `validate()` function returning `{ amount?: string; date?: string }`; on
submit, run validation first — if `amount <= 0` set `errors.amount`; if any errors exist, set them
in state and return early (no save, no close, state/fields unchanged since they're already
controlled state). Render the amount error text under the amount input.

**Files**: modify `src/features/expenses/CreateExpenseForm.tsx`,
`src/features/expenses/CreateExpenseForm.test.tsx`.

## AC4 — Missing date shows inline error, form stays open, other fields intact

**Failing test first**: fill amount `20`, category `Food`, notes `"lunch"`, leave date empty,
submit. Assert an error message adjacent to the date field, other field values intact, no save/close.

**Minimal code**: extend `validate()` — if `date` is falsy, set `errors.date`. Render the date
error text under the date input.

**Files**: modify `src/features/expenses/CreateExpenseForm.tsx`,
`src/features/expenses/CreateExpenseForm.test.tsx`.

## AC5 — Multiple invalid fields show errors simultaneously

**Failing test first**: leave date empty AND set amount to `-1`, submit. Assert both the amount
error and the date error are present in the DOM at once, and no save/close occurred.

**Minimal code**: none expected beyond AC3+AC4 — `validate()` already returns a full errors object
independent of short-circuiting, and both error nodes render whenever their key is present. This
test should pass once AC3 and AC4 are implemented; if it doesn't, fix `validate()` to not
short-circuit on the first error found.

**Files**: `src/features/expenses/CreateExpenseForm.test.tsx` only (regression/confirmation test).

## AC6 — Silent close: no success toast/confirmation after save

**Failing test first** (`src/App.test.tsx`): repeat the AC2 integration flow (open form, fill
valid amount + date, submit); after the form closes, assert there is no element with role
`status` or `alert`, and no text matching `/success|saved|added/i` anywhere in the document.

**Minimal code**: none — as long as `CreateExpenseForm`/`App` never render a toast/banner
component, this passes by construction. This test exists to lock in the "no confirmation" behavior
so nobody adds one later without noticing the test fail.

**Files**: `src/App.test.tsx` only.

## AC7 — Empty notes with otherwise valid data saves without error

**Failing test first** (`CreateExpenseForm.test.tsx`): fill amount `15`, date `2026-08-26`,
category `Food`, leave notes empty, submit. Assert `addExpense` was called with `notes: ''`,
`onClose` was called, and no error text is present in the DOM.

**Minimal code**: none expected — `notes` is never included in `validate()`'s checks (AC3/AC4 only
cover amount/date), so an empty notes value already passes through. This test confirms that by
construction.

**Files**: `src/features/expenses/CreateExpenseForm.test.tsx` only.

## Execution order

1. Scaffolding (Step 0).
2. AC1 test → minimal render code.
3. `expenseStore` test → persistence code.
4. AC2 tests (unit + integration) → submit handler + `App` shell.
5. AC3 test → amount validation.
6. AC4 test → date validation.
7. AC5 test → confirm combined-error behavior (should already pass).
8. AC6 test → confirm silent close (should already pass).
9. AC7 test → confirm optional notes (should already pass).
10. Full `vitest run` pass, review fixed category list and validation copy with reviewer.
