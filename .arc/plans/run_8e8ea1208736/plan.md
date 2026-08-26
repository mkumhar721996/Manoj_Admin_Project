# Plan: MANOJ-ADMIN-PROJECT-STORY-004 — Site Header & Navigation Shell

## Context / codebase fit

The repo currently only has one feature: an unrelated expense-entry tool
(`src/features/expenses/*`, `src/App.tsx`, `src/App.test.tsx` from STORY-001). There is no
existing marketing-site code, no router, and no `public/` runtime-config pattern to conform to.
This story adds a new, self-contained `src/features/site/` module (React + TS + Vitest/RTL,
matching the existing stack) and does **not** touch `src/App.tsx` / `src/App.test.tsx` /
`src/features/expenses/*` — reconciling how the new marketing site and the pre-existing
expense-entry root both get served from `main.tsx` is a cross-cutting integration decision that
no AC here asks for; it's flagged below for the reviewer rather than decided silently. All new
components are tested by rendering them directly (wrapped in `MemoryRouter` where routing is
involved), which fully exercises every AC without requiring that wiring.

Design tokens/components used below come from the approved design context and
`.arc/designs/figma-frame.json` (node `6:7` "header" subtree): ink (`#151212`) background,
88px-tall bar, 80px side padding; `logo-badge` (node `6:9`) is a 40×40 frame with
`cornerRadius: 20` (i.e. a full circle, not a "rounded square" as the prose summary called it —
following the JSON, which outranks the prose per the design-context rules) filled brand-red
(`#C82D25`), containing a Fraunces 700 italic 22px white "F" (node `6:10`); wordmark "Forno Rosso"
is Fraunces 600/24 white (node `6:11`). `nav-links` (`6:12`) is a row with `itemSpacing: 40`;
each `NavLink` frame has `itemSpacing: 4` between the Geist label and its underline bar. Active
label ("Home", `6:14`) is Geist **weight 600**, size 15, brand-red, with a 12×2 `cornerRadius:1`
brand-red bar (`6:15`) 4px below; inactive labels ("Our Menu" `6:17`) are Geist **weight 500**,
size 15, white, no underline. `header-cart` (`6:20`) has `itemSpacing: 12`; its delivery text
(`6:21`) is 80%-opacity white with the "30 mins" segment overridden to brand-green (`#2A7043`)
semibold — copy: "Estimated delivery: 30 mins".

## Flagged design-vs-AC conflicts (need reviewer sign-off, resolved as stated for this plan)

1. **Cart affordances vs. AC1/AC3.** The approved component map's header also includes a "Cart"
   text `NavLink` (`6:18`/`6:19`) and a `CartButton` icon pill with `count: 3` (`6:22`), grouped
   with the delivery text inside `HeaderCartSummary`/`header-cart` (`6:20`). AC1 only requires nav
   links for "Home" and "Our Menu" (no "Cart" link is named), and AC3 explicitly requires **no**
   cart item-count badge while the cart epic is unwired. The design's own `two-cart-affordances`
   open question is still `unreviewed` (no `resolution` block), so it isn't a confirmed decision I
   can rely on. Resolution used in this plan: **omit both the "Cart" `NavLink` and the
   `CartButton` entirely** for this story (a fake/static count would misrepresent real state, and
   showing a live-looking cart icon before there's any cart logic is exactly what AC3 is guarding
   against). `SiteHeader`'s right-hand cluster renders only the delivery-ETA text slot of
   `header-cart` (`6:21`). Both omitted pieces should be added back per the approved component map
   once the cart epic wires real state — flagged as follow-up work, not built here.
2. **AC5 (mobile 375px) vs. the confirmed `no-responsive-header-design` decision.** That decision
   is `resolution.decision: "confirmed"`: build the header for the ≥1440px desktop breakpoint
   only, and explicitly do **not** invent a hamburger/drawer or any collapsed-nav pattern not
   present in the Figma frame. AC5 asks for the header to "adapt to the smaller viewport without
   content overflow or broken layout" at 375px — which is exactly the mobile treatment the
   confirmed decision says is out of scope until a real mobile design exists. This plan does not
   invent a hamburger pattern. It only makes the existing desktop markup fluid (flex-based, no
   hard-coded 1440px-wide boxes) so nothing catastrophically breaks, and adds a regression test
   that no content is conditionally removed at 375px. It cannot fully satisfy AC5's intent of a
   genuinely adapted mobile layout without violating the confirmed decision. **This is called out
   as a blocking gap for the reviewer**: either accept "fluid-but-not-redesigned" now and re-open
   AC5 once a mobile design is supplied, or explicitly authorize inventing a conventional
   hamburger/drawer pattern now.
3. **AC2 ("environment variable or CMS field", "without requiring a code deploy") vs. this being a
   plain static Vite SPA with no backend/CMS.** A Vite build-time `import.meta.env.VITE_*` var is
   baked into the JS bundle at build time, so changing it *does* require a rebuild/redeploy — that
   would fail the "without a code deploy" half of AC2. Resolution used here: serve the value from
   a plain static JSON file, `public/site-config.json`, fetched by the client at runtime. This
   file ships next to (not inside) the JS bundle, so an operator can edit/replace it directly on
   the deployed static host without rebuilding any code — this is the closest honest analog to a
   "CMS field" available in this codebase today. Flagging this interpretation for reviewer
   sign-off since the ticket doesn't specify a real CMS or env-injection mechanism.
4. **AC4/AC5 are visual/layout assertions; this repo's only test tool is Vitest + jsdom.** jsdom
   does not run a real CSS layout engine, so there is no way to genuinely assert "legible", "no
   overflow", or "no broken layout" from a unit test — `offsetWidth`/`scrollWidth` are always 0 in
   jsdom regardless of CSS. The tests below for AC4/AC5 are the honest best-effort available
   (existence/no-conditional-hiding checks at each `window.innerWidth`); true visual verification
   needs a manual check in a real browser (`npm run dev`, resize to 1280px/375px) or a new e2e
   tool (e.g. Playwright), which is out of scope to add for this story unless the reviewer wants
   it. This is stated plainly rather than presenting the jsdom checks as if they prove the visual
   claim.

## Step 0 — Scaffolding (not tied to one AC)

- `package.json` — add `react-router-dom` (`^6.26.0`) to `dependencies`.
- `public/site-config.json` — `{ "deliveryEtaPrefix": "Estimated delivery:", "deliveryEtaValue": "30 mins" }`
  (matches the Figma default copy for node `6:21`; this is the file an operator edits at runtime).
- `src/features/site/siteConfig.ts` — `DEFAULT_SITE_CONFIG` constant with the same two fields.

## AC1 — Header shows logo, Home/Our Menu nav links, delivery-time indicator

**Failing test first** (`src/features/site/SiteHeader.test.tsx`):
- Render `<MemoryRouter><SiteHeader /></MemoryRouter>`.
- Assert `getByRole('link', { name: /forno rosso/i })` exists (brand logo, linking home).
- Assert `getByRole('link', { name: 'Home' })` and `getByRole('link', { name: 'Our Menu' })` exist.
- Assert text matching `/estimated delivery/i` is present and the rendered indicator contains the
  default value `"30 mins"`.

**Minimal code**:
- `src/features/site/BrandLogo.tsx` — `<Link to="/">` wrapping a 40×40 circular (`border-radius:
  50%`) brand-red (`#C82D25`) badge containing a Fraunces 700 italic 22px white "F", plus the
  Fraunces 600/24 white "Forno Rosso" wordmark (nodes `6:9`–`6:11`).
- `src/features/site/NavLink.tsx` — thin wrapper over react-router's `NavLink` taking
  `to`/`label`; renders Geist 15px text, computing active styling from the router's `isActive`:
  active = brand-red (`#C82D25`) weight 600 + a 12×2 `border-radius:1px` brand-red bar 4px below
  (`6:13`–`6:15`); inactive = white weight 500, no bar (`6:16`/`6:17`).
- `src/features/site/PrimaryNav.tsx` — `<nav>` with a flex row, `gap: 40px`, containing
  `<NavLink to="/" label="Home" />` and `<NavLink to="/menu" label="Our Menu" />` (`6:12`).
- `src/features/site/DeliveryIndicator.tsx` — takes `{ prefix, value }`; renders 80%-opacity white
  Geist text with `value` in brand-green (`#2A7043`) semibold (`6:21`).
- `src/features/site/SiteHeader.tsx` — `<header>` with ink (`#151212`) background, 88px height,
  80px left/right padding, `display:flex; justify-content:space-between; align-items:center`,
  rendering `<BrandLogo />`, `<PrimaryNav />`, and `<DeliveryIndicator prefix={DEFAULT_SITE_CONFIG.deliveryEtaPrefix} value={DEFAULT_SITE_CONFIG.deliveryEtaValue} />` (wired to live config in AC2).

**Files**: create `src/features/site/BrandLogo.tsx`, `NavLink.tsx`, `PrimaryNav.tsx`,
`DeliveryIndicator.tsx`, `SiteHeader.tsx`, `SiteHeader.test.tsx`, `siteConfig.ts`.

## AC2 — Delivery-time indicator is configurable without a code deploy

**Failing test first**:
1. `src/features/site/siteConfig.test.ts` — mock `global.fetch` to resolve with
   `{ deliveryEtaPrefix: "Ready for pickup in:", deliveryEtaValue: "45 mins" }`; call
   `loadSiteConfig()`; assert the resolved value equals the mocked payload, not
   `DEFAULT_SITE_CONFIG`. Second case: mock `fetch` to reject/404; assert `loadSiteConfig()`
   resolves to `DEFAULT_SITE_CONFIG` (graceful fallback, matching the Figma default copy).
2. Extend `SiteHeader.test.tsx` — mock `fetch` to return a custom payload as above; render
   `<SiteHeader />`; `await` and assert (`findByText`) the header now displays "Ready for pickup
   in: 45 mins" instead of the hardcoded default — proving the displayed value is sourced from the
   external file, not baked into the component.

**Minimal code**:
- `src/features/site/siteConfig.ts` — `loadSiteConfig(): Promise<SiteConfig>` does
  `fetch('/site-config.json')`, returns the parsed JSON on success, falls back to
  `DEFAULT_SITE_CONFIG` on any rejection/non-OK response; `useSiteConfig()` hook holds
  `DEFAULT_SITE_CONFIG` in state and replaces it once `loadSiteConfig()` resolves (`useEffect`).
- `src/features/site/SiteHeader.tsx` — swap the hardcoded `DEFAULT_SITE_CONFIG` props for
  `useSiteConfig()`'s return value.

**Files**: create `src/features/site/siteConfig.test.ts`; modify `siteConfig.ts`,
`SiteHeader.tsx`, `SiteHeader.test.tsx`.

## AC3 — No cart item-count badge while the cart epic is unwired

**Failing test first** (`SiteHeader.test.tsx`): render `<SiteHeader />`; assert
`queryByText(/cart/i)` and `queryByRole('img', { name: /cart/i })` are both absent from the
rendered header.

**Minimal code**: none beyond AC1 — per the flagged conflict-resolution above, `SiteHeader` never
renders a "Cart" `NavLink` or `CartButton` in this story, so this passes by construction. The test
exists to lock in that behavior so nobody adds a fake/static cart badge later without this test
failing.

**Files**: `SiteHeader.test.tsx` only.

## AC4 — Desktop (1280px): all nav links + delivery indicator visible and legible

**Failing test first** (`SiteHeader.test.tsx`): set `window.innerWidth = 1280` and dispatch a
`resize` event before rendering `<SiteHeader />`; assert the "Home" link, "Our Menu" link, and the
delivery-indicator text are all still present (no conditional hiding logic drops them below the
1440px design width).

**Minimal code**: none beyond AC1 — `SiteHeader`/`PrimaryNav`/`DeliveryIndicator` have no
width-conditional show/hide logic, so all elements render regardless of `window.innerWidth`; this
test locks that in. See flagged limitation #4 above: this cannot verify actual pixel legibility or
absence of overlap, only that the elements remain in the DOM/accessibility tree — a manual browser
check at 1280px is still needed before sign-off.

**Files**: `SiteHeader.test.tsx` only.

## AC5 — Mobile (375px): header adapts without overflow/broken layout

**Failing test first** (`SiteHeader.test.tsx`): set `window.innerWidth = 375` and dispatch
`resize`; assert the same three elements (Home, Our Menu, delivery indicator) are still present
(no conditional removal), and assert the header's root element's inline style does not hard-code a
1440px-wide box (proxy check that the layout is fluid, not a locked reproduction of the desktop
canvas).

**Minimal code**: author `SiteHeader`/`PrimaryNav`/`DeliveryIndicator` CSS with fluid sizing
(percentage/flex widths, `flex-wrap: wrap` on the nav row, no fixed pixel container widths) so the
existing desktop markup degrades gracefully instead of forcing horizontal scroll — without adding
any hamburger/drawer/collapsed-nav UI, per the confirmed "desktop-only" decision. See flagged
conflict #2: this cannot fully satisfy AC5's "adapts... without broken layout" intent, since a
genuinely adapted mobile layout is exactly what the confirmed decision defers. Needs reviewer
direction before this can be closed out for real.

**Files**: modify `SiteHeader.tsx`, `PrimaryNav.tsx`, `DeliveryIndicator.tsx` (fluid CSS); extend
`SiteHeader.test.tsx`.

## AC6 — Clicking "Home" or "Our Menu" navigates to the corresponding page

**Failing test first** (`src/features/site/routes.test.tsx`): render
`<MemoryRouter initialEntries={['/']}><SiteRoutes /></MemoryRouter>`; assert the `HomePage`
placeholder (`data-testid="home-page"`) is visible; click `getByRole('link', { name: 'Our Menu' })`;
assert the `OurMenuPage` placeholder (`data-testid="our-menu-page"`) is now visible and the home
placeholder is gone, and that the "Our Menu" link now carries the active styling (brand-red text)
while "Home" no longer does; click `getByRole('link', { name: 'Home' })`; assert navigation back to
the home placeholder.

**Minimal code**:
- `src/features/site/HomePage.tsx` — `<main data-testid="home-page"><h1>Home</h1></main>`
  placeholder; the rest of the home page (hero, delivery banner, featured grid, story section,
  footer) is other stories' scope and is not built here.
- `src/features/site/OurMenuPage.tsx` — `<main data-testid="our-menu-page"><h1>Our Menu</h1></main>`
  placeholder; actual menu content is a separate story.
- `src/features/site/Layout.tsx` — renders `<SiteHeader />` followed by react-router's `<Outlet />`,
  so the header persists across both routes.
- `src/features/site/routes.tsx` — exports `SiteRoutes`: a `<Routes>` with one `<Route element={<Layout />}>` wrapping `<Route path="/" element={<HomePage />} />` and `<Route path="/menu" element={<OurMenuPage />} />`.

**Files**: create `src/features/site/HomePage.tsx`, `OurMenuPage.tsx`, `Layout.tsx`, `routes.tsx`,
`routes.test.tsx`.

## Execution order

1. Step 0 scaffolding (`react-router-dom` dependency, `public/site-config.json`, `siteConfig.ts`
   defaults).
2. AC1 test → `BrandLogo`, `NavLink`, `PrimaryNav`, `DeliveryIndicator`, `SiteHeader`.
3. AC2 tests → `loadSiteConfig`/`useSiteConfig`, wire into `SiteHeader`.
4. AC3 test → confirm no cart affordances (should already pass by construction; written to lock
   in the behavior).
5. AC4 test → confirm no width-conditional hiding at 1280px (should already pass; written as a
   regression guard, with the jsdom-limitation caveat noted).
6. AC5 test + fluid-CSS pass → confirm no conditional hiding at 375px; flag the unresolved
   "genuine mobile adaptation" gap to the reviewer.
7. AC6 test → `HomePage`, `OurMenuPage`, `Layout`, `routes.tsx`.
8. Full `vitest run` pass; raise the four flagged conflicts (cart affordances, AC5 vs. confirmed
   decision, AC2's runtime-config interpretation, jsdom's visual-testing ceiling) plus the
   main.tsx/App.tsx wiring question with the reviewer before calling this done.
