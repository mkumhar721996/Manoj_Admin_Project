# Plan: MANOJ-ADMIN-PROJECT-BUG-010 — AC Validator and Story Enhancer - RHS selection reset after refine

## Status: BLOCKED — cannot draft a test-first plan yet

## Codebase investigation

The entire repository (this worktree, on top of `main` @ `77bbcd1`) currently contains only the
"Create Expense" feature from `MANOJ-ADMIN-PROJECT-STORY-001`:

- `src/App.tsx` — toggles between an "Add Expense" button and `CreateExpenseForm`.
- `src/features/expenses/CreateExpenseForm.tsx`, `expenseStore.ts`, `categories.ts`.
- `src/types/expense.ts`.

A full-repo search (`Glob **/*` and `Grep` for `AC Validator|Story Enhancer|refine|selection|panel|
right-hand|rightPanel|Validator|Enhancer`) found **zero matches**. There is no AC Validator
screen, no Story Enhancer screen, no right-hand-side panel component, no "refine ticket" action,
and no selection-state code anywhere in this codebase — in this branch or in `main`.

## Why this blocks planning

This bug report describes a regression in an "AC Validator" and "Story Enhancer" UI with a
two-pane layout (a right-hand side selectable list/panel) and a "refine ticket" action that
re-fetches or re-renders content. None of that exists here yet. A test-first plan needs to:

1. Locate the component that owns the RHS selection state (e.g. `selectedId` in
   `useState`/context/store).
2. Locate the "refine" handler/effect that likely re-fetches data and replaces the RHS list,
   inadvertently resetting or not restoring that selection state.
3. Write a failing test against those real files for each AC, then make the minimal fix.

Since none of those files exist, I can't do step 1–3 without inventing a fictional component
tree, fictional prop names, and a fictional "refine" API — which would violate "no speculative
work" and would not match whatever the real implementation ends up being. Any plan I write now
would have to be thrown away and rewritten once the real code is available.

## Open questions for the reviewer

- Is this worktree/branch missing a merge? Is the AC Validator / Story Enhancer feature expected
  to already be present (e.g. from another epic/story not yet merged into `main`), or does this
  bug pre-date that feature actually being built here?
- If the feature genuinely doesn't exist yet in this codebase, should this BUG ticket instead be
  scoped as building the minimal AC Validator / Story Enhancer scaffolding first (out of scope per
  "stay within the ACs" for a bug fix), or should it be re-pointed at the correct
  repo/branch/worktree?
- If there's a different branch or repo where this feature lives, please point me to it (branch
  name, or paste the relevant component file(s)) so the plan can reference real file paths,
  real state variables, and a real "refine" call site.

## Next step

Once the reviewer confirms where the AC Validator / Story Enhancer source lives (or pastes the
relevant component code), I will:
- Read the actual selection-state and refine-handler code.
- Write the plan in the same test-first format as
  `.arc/plans/run_19299e26fe81/plan.md` (failing test → minimal fix → exact files), one entry per
  AC:
  - AC1: single refine preserves RHS selection.
  - AC2: multiple successive refines preserve RHS selection.
  - AC3: refining with no prior RHS selection does not introduce a default selection.
