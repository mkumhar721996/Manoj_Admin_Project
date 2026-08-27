# Plan: MANOJ-ADMIN-PROJECT-STORY-014 — Client-Side Routing

## Codebase context

Client-side routing infrastructure already exists and this story extends it, it does not
introduce it from scratch:

- `src/main.tsx` mounts `App` (`src/App.tsx`), which renders `<BrowserRouter><SiteRoutes />
  </BrowserRouter>`.
- `src/features/site/routes.tsx` (`SiteRoutes`) declares `<Routes>` wrapping a `Layout`
  (`src/features/site/Layout.tsx`: `SiteHeader` + `<Outlet />`) around `Route`s for `/`
  (`HomePage`), `/menu` (`OurMenuPage`), `/register` (`RegisterPage`), `/login` (`LoginPage`).
  **`/cart` and `/checkout` do not exist yet** — this is the actual gap AC1 targets.
- Header navigation is `SiteHeader.tsx` → `PrimaryNav.tsx` → `NavLink.tsx`, which wraps React
  Router's `NavLink`. Because it's a real `<Link>`-based component (not a plain `<a href>` with a
  full navigation), clicking it already changes the URL and swaps the routed page without a full
  reload — `routes.test.tsx` already has a passing test clicking between Home and Our Menu that
  demonstrates this for the two links that exist today.
- `routes.test.tsx` and `HomePage.test.tsx` use `MemoryRouter` for route/link-click assertions.
  `App.tsx`'s real `BrowserRouter` (backed by jsdom's `window.history`) is what actually gives us
  back/forward semantics — `MemoryRouter`'s in-memory history isn't wired to `window.history.back
  ()`/`forward()`, so AC3/AC4 need tests that render through a real `BrowserRouter` instead.
- Convention for simple/placeholder pages: `OurMenuPage.tsx` is a two-line stub
  (`<main data-testid="our-menu-page"><h1>Our Menu</h1></main>`) with no dedicated test file of its
  own — it's exercised only through `routes.test.tsx`/`HomePage.test.tsx` integration tests. This
  plan follows that precedent for the two new pages.

## Scope decision (flagged for reviewer sign-off)

**No new header nav links for Cart/Checkout.** `SiteHeader.test.tsx` has an explicit, currently
passing test — "renders no cart item-count badge while the cart epic is unwired" — asserting there
is no cart-related link/button/text in the header at all. None of this story's ACs require a nav
link to Cart/Checkout: AC1 only requires that navigating (e.g. typing the URL / a direct link
elsewhere) to `/cart` or `/checkout` renders the right page, and AC2 only requires that clicking
*a* header nav link changes the URL correctly, which the existing Home/Our Menu links already
prove. Adding Cart/Checkout entries to `PrimaryNav` now would regress that SiteHeader test and
would be scope creep into the (explicitly deferred) cart epic. This plan therefore adds routes and
pages for `/cart` and `/checkout`, reachable by direct navigation, but leaves `PrimaryNav`
untouched.

## AC1 — root, menu, cart, and checkout routes each render their page

**Failing test first** (`src/features/site/routes.test.tsx`, new `describe` block): for each of
`/`, `/menu`, `/cart`, `/checkout`, render `<MemoryRouter initialEntries={[path]}><SiteRoutes />
</MemoryRouter>` and assert the corresponding `data-testid` (`home-page`, `our-menu-page`,
`cart-page`, `checkout-page`) is present. `/cart` and `/checkout` fail today (no route exists →
nothing renders inside `Layout`'s `Outlet`).

**Minimal code**:
- `src/features/site/CartPage.tsx` (new) — `<main data-testid="cart-page"><h1>Cart</h1></main>`,
  mirroring `OurMenuPage.tsx`.
- `src/features/site/CheckoutPage.tsx` (new) — `<main data-testid="checkout-page"><h1>Checkout
  </h1></main>`.
- `src/features/site/routes.tsx` — add `<Route path="/cart" element={<CartPage />} />` and
  `<Route path="/checkout" element={<CheckoutPage />} />` inside the existing `Layout` route, next
  to `/` and `/menu`.

**Files**: create `src/features/site/CartPage.tsx`, `src/features/site/CheckoutPage.tsx`; modify
`src/features/site/routes.tsx`, `src/features/site/routes.test.tsx`.

## AC2 — header nav link click changes the URL and swaps the page without a full reload

**Failing test first** (`src/features/site/routes.test.tsx`, extend the existing "navigates
between Home and Our Menu" test or add a sibling test in the same `describe`): render `<MemoryRouter
initialEntries={["/"]}><SiteRoutes /></MemoryRouter>`; capture `const headerBefore =
screen.getByRole("banner")`; click the "Our Menu" nav link; assert `our-menu-page` is shown and
`screen.getByRole("banner")` is (`toBe`) the *same* DOM node as `headerBefore`. A full page reload
would tear down and remount the whole React tree (including `SiteHeader`), producing a new node,
so this is the concrete, assertable signal for "no full page reload" that the AC calls for.

This is expected to pass without production code changes, since `NavLink`/`Link` already avoid
full reloads — writing it first still matters because it's new, AC-specific coverage that doesn't
exist yet (today's test only checks that content swapped, not that no reload occurred). If it
somehow fails, the fix is in `NavLink.tsx`/`PrimaryNav.tsx` (e.g. an accidental plain `<a href>`),
not a new abstraction.

**Files**: modify `src/features/site/routes.test.tsx`.

## AC3 — browser back button restores the previous page

**Failing test first** (`src/features/site/routes.test.tsx`, new `describe("browser history
navigation")` block using a **real `BrowserRouter`**, not `MemoryRouter`, since only real
`window.history` responds to `.back()`/`.forward()`):
- `beforeEach`/`afterEach`: reset the URL with `window.history.pushState(null, "", "/")` so tests
  in this block don't leak URL state into each other or into other files.
- Render `<BrowserRouter><SiteRoutes /></BrowserRouter>` starting at `/`.
- Click the "Our Menu" nav link → assert `our-menu-page`.
- `await act(async () => { window.history.back(); })` (wrapped in `act` since the `popstate`
  listener triggers a React state update).
- Assert `home-page` is back and `our-menu-page` is gone.

This should pass by construction (React Router's `BrowserRouter` already listens for `popstate`),
confirming the existing wiring genuinely supports back navigation end-to-end rather than only
via in-app link clicks.

**Files**: modify `src/features/site/routes.test.tsx`.

## AC4 — browser forward button restores the page navigated back from

**Failing test first** (same new `describe` block, continuing the AC3 pattern): repeat the AC3
setup (start at `/`, click "Our Menu", `window.history.back()` to return to `home-page`), then
`await act(async () => { window.history.forward(); })`; assert `our-menu-page` is shown again and
`home-page` is gone.

**Files**: modify `src/features/site/routes.test.tsx`.

## Execution order

1. Add the AC1 direct-navigation tests for `/`, `/menu`, `/cart`, `/checkout` to
   `routes.test.tsx` — confirm `/cart`/`/checkout` fail.
2. Create `CartPage.tsx`, `CheckoutPage.tsx`; wire `/cart` and `/checkout` into `routes.tsx` —
   confirm AC1 tests pass.
3. Add the AC2 "no full reload" (`banner` node identity) test — confirm it passes against the
   existing `NavLink`/`Layout` wiring.
4. Add the AC3/AC4 `BrowserRouter` back/forward `describe` block — confirm both pass against the
   existing `BrowserRouter` wiring in `App.tsx`/`routes.tsx`.
5. Full `vitest run` — confirm no regressions in `SiteHeader.test.tsx` (still no cart nav link/
   badge), `HomePage.test.tsx`, or `App.test.tsx`.
