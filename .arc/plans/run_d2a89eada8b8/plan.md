# Plan: MANOJ-ADMIN-PROJECT-STORY-012 — User Registration & Login via Facebook

## Codebase context

This is a frontend-only React 18 + TypeScript + Vite app (Vitest + Testing Library). There is
**no backend and no existing auth code at all** — no user/session concept, no login/register
pages, no Facebook SDK dependency. The only precedent for persistence is
`src/features/expenses/expenseStore.ts`, a localStorage-backed store that components call
directly and that tests mock with `vi.mock(...)` (see `CreateExpenseForm.test.tsx`). Routing uses
`react-router-dom` via `src/features/site/routes.tsx` + `Layout.tsx`.

Since there is no server to perform a real Facebook OAuth token exchange, this plan follows the
same pattern already used for `expenseStore`: an adapter module (`facebookAuth.ts`) is the single
boundary that would call the real Facebook SDK (`window.FB`); it is mocked in all component tests,
exactly like `expenseStore` is mocked in `CreateExpenseForm.test.tsx`. All account-linking and
login logic — the part actually under test for these ACs — lives in plain, unit-testable
functions (`userStore.ts`, `session.ts`).

New files only; nothing existing is renamed or removed. New feature folder: `src/features/auth/`.

## Design

- `src/types/user.ts` — `User = { id: string; facebookId: string; name: string; email: string }`.
- `src/features/auth/facebookAuth.ts` — `FacebookProfile` type + `loginWithFacebook(): Promise<FacebookProfile>`, a thin wrapper around `window.FB.login`/`FB.api`. Not unit-tested directly (it's the untestable browser-SDK boundary); always mocked in page tests, matching how this repo treats browser APIs (e.g. `crypto.randomUUID` in `expenseStore` isn't mocked/tested either, but here the boundary is external and non-deterministic so it's isolated behind this adapter for mockability).
- `src/features/auth/userStore.ts` — localStorage-backed (`STORAGE_KEY = "users"`), mirrors `expenseStore.ts` style:
  - `findUserByFacebookId(facebookId): User | undefined`
  - `createUserFromFacebookProfile(profile: FacebookProfile): User`
  - `authenticateFacebookUser(profile: FacebookProfile): User | null`
- `src/features/auth/session.ts` — localStorage-backed (`STORAGE_KEY = "session"`): `setCurrentUser(user)`, `getCurrentUser()`, `clearCurrentUser()`.
- `src/features/auth/RegisterPage.tsx` — "Continue with Facebook" button → `loginWithFacebook()` → `createUserFromFacebookProfile()` → `setCurrentUser()` → success message.
- `src/features/auth/LoginPage.tsx` — "Continue with Facebook" button → `loginWithFacebook()` → `authenticateFacebookUser()`; if a `User` is returned, `setCurrentUser()` + success message; if `null`, show rejection message and do not touch the session.
- `src/features/site/routes.tsx` — add `/register` → `RegisterPage`, `/login` → `LoginPage` inside the existing `Layout` route.

## AC1 — Register via Facebook creates a linked account

**Failing test 1** (`src/features/auth/userStore.test.ts`, new file):
`createUserFromFacebookProfile({ id: "fb-1", name: "Jane Doe", email: "jane@example.com" })`
appends one record to `localStorage["users"]` containing that `facebookId`, `name`, `email`, and a
generated string `id`.

**Failing test 2** (`src/features/auth/RegisterPage.test.tsx`, new file): `vi.mock` both
`./facebookAuth` and `./userStore`. Mock `loginWithFacebook` to resolve
`{ id: "fb-1", name: "Jane Doe", email: "jane@example.com" }`. Render `RegisterPage`, click
"Continue with Facebook". Assert `createUserFromFacebookProfile` was called once with that exact
profile, and the page shows a success message (e.g. `/account created/i`).

**Minimal code to pass:**
- `src/types/user.ts` — `User` type.
- `src/features/auth/facebookAuth.ts` — `FacebookProfile` type, `loginWithFacebook()` stub calling `window.FB`.
- `src/features/auth/userStore.ts` — `findUserByFacebookId`, `createUserFromFacebookProfile`.
- `src/features/auth/session.ts` — `setCurrentUser`, `getCurrentUser`, `clearCurrentUser`.
- `src/features/auth/RegisterPage.tsx` — button + handler as described above.
- `src/features/site/routes.tsx` — add `/register` route.
- `src/features/site/routes.test.tsx` — extend with a case: navigating to `/register` (via `MemoryRouter initialEntries={["/register"]}`) renders the register page's "Continue with Facebook" button.

## AC2 — Successful Facebook registration then login succeeds

**Failing test 1** (`src/features/auth/userStore.test.ts`): seed `localStorage["users"]` with a
user whose `facebookId` is `"fb-1"`. `authenticateFacebookUser({ id: "fb-1", name: "Jane Doe",
email: "jane@example.com" })` returns that stored `User`.

**Failing test 2** (`src/features/auth/LoginPage.test.tsx`, new file): `vi.mock` `./facebookAuth`
and `./userStore`. Mock `loginWithFacebook` to resolve a profile; mock `authenticateFacebookUser`
to resolve/return a matching `User`. Render `LoginPage`, click "Continue with Facebook". Assert
`setCurrentUser` (mock `./session`) was called with that `User`, and the page shows a success
message (e.g. `/logged in/i`), with no error message present.

**Minimal code to pass:**
- `src/features/auth/userStore.ts` — add `authenticateFacebookUser` (looks up via `findUserByFacebookId`).
- `src/features/auth/LoginPage.tsx` — button + handler: on a non-null user, call `setCurrentUser` and show success.
- `src/features/site/routes.tsx` — add `/login` route.
- `src/features/site/routes.test.tsx` — extend with a case: navigating to `/login` renders the login page's "Continue with Facebook" button.

## AC3 — Login rejected when Facebook registration was never completed

**Failing test 1** (`src/features/auth/userStore.test.ts`): with `localStorage["users"]` empty (or
containing only unrelated users), `authenticateFacebookUser({ id: "fb-404", name: "No One",
email: "no@one.com" })` returns `null`.

**Failing test 2** (`src/features/auth/LoginPage.test.tsx`): mock `loginWithFacebook` to resolve a
profile; mock `authenticateFacebookUser` to return `null`. Render `LoginPage`, click "Continue
with Facebook". Assert a rejection message is shown (e.g. `/no account found.*register/i`) and
`setCurrentUser` (mocked `./session`) is **not** called.

**Minimal code to pass:**
- `src/features/auth/LoginPage.tsx` — add the `null`-user branch: show the rejection message, skip `setCurrentUser`. (This completes the handler started in AC2; no other new files.)

## Test order (TDD)

1. `userStore.test.ts`: `createUserFromFacebookProfile` (AC1) → implement.
2. `RegisterPage.test.tsx` (AC1) → implement `RegisterPage`, `facebookAuth`, `session`, wire `/register` route.
3. `userStore.test.ts`: `authenticateFacebookUser` found case (AC2) → implement.
4. `LoginPage.test.tsx` success case (AC2) → implement `LoginPage` happy path, wire `/login` route.
5. `userStore.test.ts`: `authenticateFacebookUser` not-found case (AC3) → implement.
6. `LoginPage.test.tsx` rejection case (AC3) → implement the rejection branch.

## Out of scope

No nav-link wiring in `SiteHeader`, no "logged in as" header UI, no logout, no real Facebook App
ID/SDK script loading, no non-Facebook (email/password) auth, no backend/session persistence
beyond localStorage. None of these are required by the three ACs above.
