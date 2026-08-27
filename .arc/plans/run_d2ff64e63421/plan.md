# MANOJ-ADMIN-PROJECT-STORY-013 — Design System & App Shell

## Current state (read from the repo)

STORY-004 and STORY-006 already shipped most of the visual foundation:

- `SiteHeader` (`#151212` bg) composes `BrandLogo`, `PrimaryNav` (Home/Our Menu only), `DeliveryIndicator` (green `#2A7043` value text). All already use `Fraunces`/`Geist` in inline `style` objects.
- `MenuItemCard` already prices in brand red (`#C82D25`, Fraunces).
- `FeaturedSection` already uses off-white `#FCFAF6`.
- `Layout` renders `SiteHeader` + `<Outlet/>` only — **no footer at all**.
- There is **no cart feature**: no `/cart` route, no "Cart" nav link, no cart icon/badge, no cart store. `SiteHeader.test.tsx` and `HomePage.test.tsx` currently contain explicit regression tests asserting **no** cart UI exists anywhere ("renders no cart item-count badge while the cart epic is unwired"). Those tests are now obsolete and must be replaced as part of this story, per `design-context.json`'s `header-cart-gap` note that leaves the cart nav link + badge for "whichever story adds a cart/checkout flow."
- No fonts are actually loaded anywhere (no `<link>`/`@font-face`); `Fraunces`/`Geist` only appear as CSS `font-family` fallback chains. jsdom cannot render glyphs, so — consistent with the codebase's existing convention (`routes.test.tsx` already asserts colors via `toHaveStyle`) — typeface/color ACs are verified via computed inline styles, not visual rendering.
- The Figma catalogue (`design-context.json`) proposes a rich footer (logo, description, social icons, legal links). **AC5 explicitly requires "no interactive elements"** in the footer, which conflicts with that catalogue (social links, legal nav, clickable logo). AC5 wins: the footer built here is static text only (hours, location, contact) — no `<a>`/`<button>`, no social row, no legal links, no logo. This intentionally narrows AC10's "matches the design" to the elements this story actually builds (background, spacing scale, responsive padding pattern), not the omitted interactive chrome.
- No literal footer copy (address/phone/email) exists anywhere in the repo; the Kitchen Hours values are literal (`design-context.json` `ScheduleRow` props). Location/contact copy will be authored as static placeholder content.
- Cart item count needs cross-component reactivity (header badge must update when an "add/remove" happens elsewhere), which nothing in the codebase currently does (`expenseStore`/`userStore` are single-consumer, no pub/sub). A minimal new in-memory store with subscribe/notify (via `useSyncExternalStore`) is added for exactly this — it is scoped to id-count tracking only; wiring real "Add to Order" buttons to it is explicitly out of scope (that's the "whichever story adds a cart/checkout flow" the design notes defer), so `MenuItemCard`'s existing "Add to Order" → `/menu` link behavior is left unchanged.

## New files

- `src/features/cart/cartStore.ts` + `cartStore.test.ts`
- `src/features/site/CartIcon.tsx` (hand-authored inline SVG, matching the existing `PlusIcon.tsx` pattern — no new icon-library dependency)
- `src/features/site/CartButton.tsx` + `CartButton.test.tsx`
- `src/features/site/CartPage.tsx` (minimal placeholder page, same shape as `OurMenuPage.tsx`)
- `src/features/site/SiteFooter.tsx` + `SiteFooter.test.tsx`
- `src/features/site/Layout.test.tsx`
- `src/features/site/DeliveryIndicator.test.tsx`

## Modified files

- `src/features/site/PrimaryNav.tsx` — add Cart `NavLink`
- `src/features/site/SiteHeader.tsx` — render `CartButton` next to `DeliveryIndicator`
- `src/features/site/SiteHeader.test.tsx` — replace the stale "no cart" test with real cart tests
- `src/features/site/HomePage.test.tsx` — drop the now-invalid "no cart anywhere" assertions
- `src/features/site/Layout.tsx` — render `SiteFooter`, wrap page in off-white background
- `src/features/site/routes.tsx` — add `/cart` route
- `src/features/site/routes.test.tsx` — extend nav test to cover Cart + header/footer persistence
- `src/features/site/MenuItemCard.test.tsx` — add a price-color regression assertion (AC7)

---

## AC-by-AC plan

### AC1 — header displays brand logo (any page)
Already implemented (`SiteHeader` → `BrandLogo`) and covered by `SiteHeader.test.tsx`. New coverage: extend `routes.test.tsx`'s navigation test to assert `getByRole("link", { name: /forno rosso/i })` stays present after navigating Home → Our Menu → Cart (folds into the AC13 work below). No production change needed.

### AC2 — header nav links for Home, Our Menu, Cart
1. **Failing test**: in `SiteHeader.test.tsx`, update the first test to also assert `screen.getByRole("link", { name: "Cart" })` is present.
2. **Minimal code**: add `<NavLink to="/cart" label="Cart" />` to `PrimaryNav.tsx`.
3. **Files**: `PrimaryNav.tsx`, `SiteHeader.test.tsx`.

### AC3 — cart icon displays a badge with current item count
1. **Failing test** (`cartStore.test.ts`): `getItemCount()` starts at `0`; after `addItem("diavola")` twice, `getItemCount()` is `2`.
2. **Minimal code** (`cartStore.ts`): module-level `let cartItems: string[] = []`; `addItem(id)` pushes and notifies; `getItemCount()` returns `cartItems.length`; `subscribeToCart(listener)` registers/returns unsubscribe; export `resetCart()` for test isolation.
3. **Failing test** (`CartButton.test.tsx`): render `<CartButton />` inside `MemoryRouter`; call `addItem("diavola")` three times (wrapped in `act`); assert the badge (`screen.getByTestId("cart-badge")`) shows `"3"` and the control has an accessible name mentioning "Cart" (`screen.getByRole("link", { name: /cart, 3 items/i })`).
4. **Minimal code** (`CartButton.tsx`): `useSyncExternalStore(subscribeToCart, getItemCount)` inside a small hook (co-located or `useCartItemCount` in `cartStore.ts`); render a `Link to="/cart"` with `aria-label={\`Cart, ${count} item${count === 1 ? "" : "s"}\`}`, a `CartIcon`, and `<span data-testid="cart-badge">{count}</span>`.
5. **Minimal code** (`CartIcon.tsx`): plain inline SVG shopping-cart glyph, `aria-hidden`, mirroring `PlusIcon.tsx`.
6. **Wire into header**: `SiteHeader.tsx` renders `<CartButton />` next to `DeliveryIndicator` inside a small flex wrapper (the design's `header-cart` region).
7. **Files**: `cartStore.ts`, `cartStore.test.ts`, `CartIcon.tsx`, `CartButton.tsx`, `CartButton.test.tsx`, `SiteHeader.tsx`.

### AC4 — badge updates when items are added/removed
1. **Failing test** (`cartStore.test.ts`): after `addItem("diavola")` then `removeItem("diavola")`, `getItemCount()` returns to `0`; a registered listener via `subscribeToCart` is invoked on both calls.
2. **Minimal code** (`cartStore.ts`): `removeItem(id)` removes the first matching id and notifies listeners (mirrors `addItem`).
3. **Failing test** (`CartButton.test.tsx`): render `<CartButton />`; `act(() => addItem("diavola"))` → badge shows `"1"`; `act(() => removeItem("diavola"))` → badge shows `"0"` — proves the already-rendered header reacts live, not just on remount.
4. **Files**: `cartStore.ts`, `cartStore.test.ts`, `CartButton.test.tsx`.

### AC5 — footer shows static hours/location/contact, no interactive elements
1. **Failing test** (`SiteFooter.test.tsx`):
   - `screen.getByRole("contentinfo")` exists.
   - Shows the three Kitchen Hours rows: "Monday - Thursday" / "12:00 PM - 10:00 PM", "Friday - Saturday" / "12:00 PM - 11:30 PM", "Sunday" / "1:00 PM - 9:30 PM" (literal values from `design-context.json`).
   - Shows a location/address line and a contact line (phone + email) — static placeholder copy authored for this story.
   - `screen.queryAllByRole("link")` and `screen.queryAllByRole("button")` are both empty within the footer.
2. **Minimal code** (`SiteFooter.tsx`): a `<footer>` with plain `<div>`/`<p>`/`<span>` text blocks for hours, location, and contact — no anchors, buttons, or social icons.
3. **Wire into shell**: `Layout.tsx` renders `<SiteFooter />` after `<Outlet />`.
4. **Failing test** (`Layout.test.tsx`): rendering `Layout` (with a stub child route) shows both `getByRole("banner")` (header) and `getByRole("contentinfo")` (footer).
5. **Files**: `SiteFooter.tsx`, `SiteFooter.test.tsx`, `Layout.tsx`, `Layout.test.tsx`.

### AC6 — header and footer background is dark near-black
1. **Failing test**: add to `SiteFooter.test.tsx` — `expect(screen.getByRole("contentinfo")).toHaveStyle({ backgroundColor: "#151212" })`. Add to `SiteHeader.test.tsx` — same assertion via `getByRole("banner")` (regression; header already sets this).
2. **Minimal code**: `SiteFooter.tsx` sets `backgroundColor: "#151212"`. No header change needed.
3. **Files**: `SiteFooter.tsx`, `SiteFooter.test.tsx`, `SiteHeader.test.tsx`.

### AC7 — CTA button or price uses the red accent color
1. **Failing test**: add to `MenuItemCard.test.tsx` — `expect(screen.getByText("$16.50")).toHaveStyle({ color: "#C82D25" })` (regression; not currently asserted).
2. **Minimal code**: none — `MenuItemCard` already sets this.
3. **Files**: `MenuItemCard.test.tsx`.

### AC8 — delivery/promo callout uses the green accent color
1. **Failing test** (`DeliveryIndicator.test.tsx`, new): render `<DeliveryIndicator prefix="Estimated delivery:" value="30 mins" />`; assert `screen.getByText("30 mins")` has `toHaveStyle({ color: "#2A7043" })` (regression; not currently asserted anywhere).
2. **Minimal code**: none — `DeliveryIndicator` already sets this.
3. **Files**: `DeliveryIndicator.test.tsx`.

### AC9 — main page background uses the warm off-white color
1. **Failing test** (`Layout.test.tsx`): the `Layout` wrapper element has `toHaveStyle({ backgroundColor: "#FCFAF6" })`.
2. **Minimal code** (`Layout.tsx`): wrap `SiteHeader`/`Outlet`/`SiteFooter` in a `<div style={{ backgroundColor: "#FCFAF6", minHeight: "100vh" }}>` (replacing the current bare `<>...</>` fragment).
3. **Files**: `Layout.tsx`, `Layout.test.tsx`.

### AC10 — desktop viewport layout proportions match the design
Scoped to the new footer, using the same responsive-padding pattern already established and tested for `SiteHeader`/`FeaturedSection` (`useIsMobileViewport`, 80px desktop / 20px mobile side padding, 640px breakpoint). Header/section proportions are pre-existing and already covered by their own tests.
1. **Failing test** (`SiteFooter.test.tsx`): at `window.innerWidth = 1280`, footer has `paddingLeft`/`paddingRight: "80px"` and the hours/location columns render side-by-side (`flexDirection: "row"` on their container).
2. **Failing test** (`SiteFooter.test.tsx`): at `window.innerWidth = 375`, footer has `paddingLeft`/`paddingRight: "20px"` and the columns stack (`flexDirection: "column"`).
3. **Minimal code** (`SiteFooter.tsx`): use `useIsMobileViewport()` to switch padding and `flexDirection`, mirroring `SiteHeader`/`FeaturedSection`.
4. **Files**: `SiteFooter.tsx`, `SiteFooter.test.tsx`.

### AC11 — display headings use the Fraunces serif typeface
Header/card/section headings already use Fraunces (pre-existing, unchanged). New coverage is only for the new footer's column headings.
1. **Failing test** (`SiteFooter.test.tsx`): `screen.getByRole("heading", { name: "Kitchen Hours" })` and `{ name: "Pizzeria Location" })` both `toHaveStyle({ fontFamily: "Fraunces, serif" })`.
2. **Minimal code** (`SiteFooter.tsx`): render column titles as `<h3 style={{ fontFamily: "Fraunces, serif", ... }}>`.
3. **Files**: `SiteFooter.tsx`, `SiteFooter.test.tsx`.

### AC12 — body/UI text uses the Geist sans typeface
1. **Failing test** (`SiteFooter.test.tsx`): the hours/location/contact text nodes `toHaveStyle({ fontFamily: "Geist, sans-serif" })`.
2. **Minimal code** (`SiteFooter.tsx`): body text spans/paragraphs set `fontFamily: "Geist, sans-serif"`.
3. **Files**: `SiteFooter.tsx`, `SiteFooter.test.tsx`.

### AC13 — header/footer persist unchanged across navigation
1. **Failing test**: extend `routes.test.tsx`'s existing navigation test — after clicking "Our Menu" then "Cart" then back to "Home", assert on every step that `screen.getByRole("banner")` (header, containing the brand logo link) and `screen.getByRole("contentinfo")` (footer) remain in the document, and that clicking "Cart" shows `screen.getByTestId("cart-page")`.
2. **Minimal code**: `routes.tsx` adds `<Route path="/cart" element={<CartPage />} />` inside the existing `<Route element={<Layout />}>` wrapper; `CartPage.tsx` is a minimal placeholder (`<main data-testid="cart-page"><h1>Cart</h1></main>`, matching `OurMenuPage.tsx`'s shape).
3. **Files**: `routes.tsx`, `routes.test.tsx`, `CartPage.tsx`.

---

## Required regression fixes (breaking changes from adding the cart)

- `SiteHeader.test.tsx`: replace `"renders no cart item-count badge while the cart epic is unwired"` with the AC3/AC4 cart-badge tests above (same file, test removed and superseded — this is expected, not a regression to avoid).
- `HomePage.test.tsx`: remove the two now-false assertions in `"navigates to the menu page when 'Add to Order' is clicked..."` (`queryByText(/cart/i)` / `queryByRole("button", { name: /cart/i })` must not exist) — a "Cart" nav link legitimately exists in the header on every page now. Keep the rest of that test (it still correctly proves clicking "Add to Order" doesn't call `addItem`/mutate the cart store).

## Test/build verification
Run `npm test` after each AC group to keep the suite green throughout, and once more at the end for the full suite.
