# MANOJ-ADMIN-PROJECT-STORY-006 — Featured Menu Grid

## Codebase context

- Site pages live under `src/features/site/` (`HomePage.tsx`, `OurMenuPage.tsx`, `SiteHeader.tsx`,
  `PrimaryNav.tsx`, `NavLink.tsx`, `BrandLogo.tsx`, `DeliveryIndicator.tsx`, `Layout.tsx`,
  `useIsMobileViewport.ts`, `siteConfig.ts`), wired through `routes.tsx` → `SiteRoutes`, rendered by
  `App.tsx` inside a `BrowserRouter`. `/menu` already routes to `OurMenuPage` — no new route needed
  for this story.
- Styling convention across the whole feature is plain inline `style={{ ... }}` objects (no CSS
  files, no CSS-in-JS lib, no Tailwind) — every component in this plan follows that.
- Responsive behaviour convention (`SiteHeader.tsx` + `useIsMobileViewport.ts`, ≤640px breakpoint):
  a `useState` seeded from `window.innerWidth`, updated on a `resize` listener, driving different
  inline style values. Tests drive this by setting `window.innerWidth` then dispatching a `resize`
  `Event`, then asserting with `toHaveStyle`. `SiteHeader.test.tsx` is the reference test file for
  this pattern (1280px "desktop" case, 375px "mobile" case, and a "restores on resize back up"
  case). This plan reuses that exact pattern for the grid.
- Test stack: Vitest + `@testing-library/react` + `@testing-library/user-event`, jsdom environment,
  jest-dom matchers via `src/setupTests.ts`. Route-level integration tests (`routes.test.tsx`) render
  `SiteRoutes` inside a `MemoryRouter` and click through with `userEvent`.
- No image-asset precedent exists yet in the app (no `<img>` anywhere today). `public/site-config.json`
  is the only precedent for a same-origin static asset, fetched as `/site-config.json`. This plan
  follows that: copies the four featured-grid photos into `public/images/menu/` and references them
  as root-relative paths (e.g. `/images/menu/diavola.png`), the way Vite serves `public/`.
- No icon library or cart logic of any kind exists in the repo yet (`SiteHeader.test.tsx` has a test
  explicitly asserting no cart badge/link exists — confirmed by reading it).

## Design source

- Design context object (approved): `component_map` entries `6:54 featured-section`,
  `6:55` section heading, `6:59 featured-grid`, `6:60/6:72/6:84/6:96` the four `MenuItemCard`
  instances, `6:69` (+ 3 siblings) `Add to Order` button.
- Section crop: `.arc/designs/figma-section-6-54-featured-section.png`. Full-page composition:
  `.arc/designs/figma-frame.png`. Card photos: `.arc/designs/figma-asset-6-62/6-74/6-86/6-98-featured-grid.png`.
- Tokens used below: colours `ink #151212`, `brand_red #C82D25`, `off_white #FCFAF6`,
  `muted #6B6661`; type ramp `section-heading` (Fraunces 700/40/46), `eyebrow-label` (Geist 600/13,
  uppercase), `card-title` (Fraunces 600/18/22.19), `card-price` (Fraunces 700/18/22.19), `body-sm`
  (Geist 400/14/19.6), `button-label` (Geist 600/15/19.5); spacing `24` (grid gutter), `80`/`20`
  (section side padding desktop/mobile, matching `SiteHeader`'s existing 80/20 split); radius
  `card: 8`, `pill_full: 100` (Add to Order pill).
- Card content, verbatim from the approved design:
  - Diavola — $16.50 — "Spicy calabrian salami, house-pulled fresh mozzarella, san marzano tomato
    base, organic chili oil, fresh basil leaves." — `6-62`
  - Funghi Selvatici & Tartufo — $18.00 — "Roasted wild porcini and cremini mushrooms,
    truffle-infused olive oil, white mozzarella base, shaved pecorino." — `6-74`
  - Classic Margherita — $14.50 — "Imported San Marzano tomato sauce, fresh buffalo mozzarella,
    fragrant fresh basil, extra virgin olive oil." — `6-86`
  - Prosciutto Crudo e Rucola — $19.00 — "Prosciutto di Parma cured ham, fresh peppery wild
    arugula, shaved parmigiano-reggiano, balsamic glaze reduction." — `6-98`
  - Section heading: eyebrow "Chef Recommendations" (brand red, uppercase), heading "Popular
    Sourdough Pizzas" (Fraunces), 48×3px brand-red rule underneath, section background `#FCFAF6`.

## Open-question call-outs (read before implementing)

1. **`featured-grid-responsive-breakpoints` — confirmed, but the tablet pixel value is my own
   extrapolation.** The recorded decision confirms "4 cols desktop / 2 cols tablet / 1 col
   mobile (≤640px)" but names no tablet upper bound. Nothing else in the repo defines one either
   (`useIsMobileViewport` only has the single 640px cutoff). This plan picks **1024px** as the
   tablet/desktop split (so: ≤640 → 1 col, 641–1024 → 2 col, >1024 → 4 col). Flagging this number
   specifically so the reviewer can correct it if a different value was intended — it is not in the
   confirmed decision text.
2. **`menu-card-title-truncation` — marked `blocking: true` AND `resolution: deferred`.** This is
   still genuinely unresolved (not merely assumed), unlike the breakpoints question above. Per the
   `arc_assumption`, the plan below builds titles to wrap to 2 lines rather than truncate, but this
   must get an explicit reviewer decision before/while this task lands — it is called out again at
   the relevant task below, not silently treated as settled.
3. **`shared-button-component` — deliberate deviation, non-blocking.** The design proposes one
   shared `Button` (variant `primary`/`outline`/`dark`) reused by the Hero CTAs and every card's
   "Add to Order". The Hero is out of scope for this story and doesn't exist in code yet, so this
   plan does **not** build that generic component now (it would mean guessing at `primary`/`outline`
   styling nobody has asked for yet). Instead it builds a small `MenuItemCard`-local
   `AddToOrderLink`, styled to the `6:69` spec (dark pill, leading plus icon, `button-label` type).
   Whoever builds the Hero can extract the shared `Button` then, informed by both real call sites.
4. **`icon-library-choice` — deliberate deviation, non-blocking.** The design's assumption is to
   adopt `lucide-react` for all ~11 icons across the page. This story only needs one glyph (the
   leading "+" on "Add to Order"), so this plan adds a single small local inline-SVG plus icon
   instead of taking on a new dependency for one glyph. Left for whichever story next needs several
   icons (e.g. the Hero) to make the lucide-react call with fuller information.
5. **`menu-card-variable-height` — adopted as-is, non-blocking.** `MenuItemCard` is built as an
   auto-height flex column (image → growing text block → button), not a fixed 441px card, per the
   recorded assumption.

## Task 1 (AC1) — Featured pizza data + card content

**Files:** new `src/features/site/menuData.ts`, new `src/features/site/MenuItemCard.tsx`, new
`src/features/site/MenuItemCard.test.tsx`. New assets: copy
`.arc/designs/figma-asset-6-62-featured-grid.png` → `public/images/menu/diavola.png`,
`figma-asset-6-74-featured-grid.png` → `public/images/menu/funghi-selvatici-tartufo.png`,
`figma-asset-6-86-featured-grid.png` → `public/images/menu/classic-margherita.png`,
`figma-asset-6-98-featured-grid.png` → `public/images/menu/prosciutto-crudo-e-rucola.png`.

1. **Failing test** (`MenuItemCard.test.tsx`): render `<MenuItemCard item={diavolaFixture} />`
   inside a `MemoryRouter`; assert the name ("Diavola"), the full description text, the price
   ("$16.50"), and an `img` with `role=img` whose accessible name is "Diavola" and whose `src` is
   `/images/menu/diavola.png` are all present. Add a second case with the Funghi Selvatici &
   Tartufo fixture's long name to assert the title element is **not** styled with
   `textOverflow: "ellipsis"` / `whiteSpace: "nowrap"` (encodes the wrap-2-lines default from
   call-out #2 above, pending that question's real resolution).
2. **Minimal code:** `menuData.ts` exports a typed `FeaturedMenuItem` (`id`, `name`, `price`,
   `description`, `imageSrc`, `imageAlt`) and a `FEATURED_MENU_ITEMS` array with the four items
   listed in "Design source" above, `price` stored as the literal display string (e.g. `"$16.50"`)
   to avoid inventing currency-formatting logic nobody asked for. `MenuItemCard.tsx` renders an
   `<article>` (flex column, `borderRadius: 8`, background `#FFFFFF`) containing an `<img>`
   (`objectFit: "cover"`, fixed aspect box per the 302×220 image box in the design), an `<h3>` for
   the name (`card-title`: Fraunces 600/18, wrapping normally — no `nowrap`/ellipsis), a `<p>` for
   the description (`body-sm`: Geist 400/14, colour `muted #6B6661`), a price element
   (`card-price`: Fraunces 700/18), and the `AddToOrderLink` built in Task 2.

## Task 2 (AC2) — "Add to Order" navigates to the menu page, no cart logic

**Files:** new `src/features/site/PlusIcon.tsx` (inline SVG, ~16px, `stroke="currentColor"`); add
`AddToOrderLink` to `MenuItemCard.tsx` (co-located, not a separate shared `Button` — see call-out
#3); extend `MenuItemCard.test.tsx`; new `src/features/site/HomePage.test.tsx` for the
route-level check.

1. **Failing test** (`MenuItemCard.test.tsx`): assert `getByRole("link", { name: /add to order/i })`
   exists and has `href="/menu"`. Assert it renders as an `<a>` (via `react-router-dom`'s `Link`)
   with no `onClick` side effect wired — i.e. it is a plain navigation element, not a `<button>`.
2. **Failing test** (`HomePage.test.tsx`, integration, mirrors the existing `SiteHeader.test.tsx`
   "no cart badge" test): render `<SiteRoutes />` inside a `MemoryRouter` at `/`; click the "Add to
   Order" link for the Diavola card; assert `screen.getByTestId("our-menu-page")` appears and
   `screen.queryByTestId("home-page")` is gone (full navigation happened); assert no cart-related
   text, badge, or `role=button` with a cart accessible name appears anywhere before or after the
   click (there is no cart feature in the repo at all yet, so this test simply locks in that this
   story doesn't introduce one).
3. **Minimal code:** `AddToOrderLink` = `<Link to="/menu">` styled as a dark (`#151212`) full-width
   pill (`borderRadius: 100`, per `pill_full` token), `button-label` type (Geist 600/15, white),
   leading `<PlusIcon />`, label "Add to Order". No click handler, no cart import — satisfies "no
   cart logic triggered" by construction.

## Task 3 (AC3) — desktop (1280px) multi-column grid

**Files:** new `src/features/site/useFeaturedGridColumns.ts`, new `src/features/site/FeaturedGrid.tsx`,
new `src/features/site/FeaturedGrid.test.tsx`.

1. **Failing test** (`FeaturedGrid.test.tsx`): set `window.innerWidth = 1280`, dispatch a `resize`
   `Event` (same pattern as `SiteHeader.test.tsx`), render `<FeaturedGrid />` in a `MemoryRouter`;
   assert `screen.getByTestId("featured-grid")` has style `gridTemplateColumns: "repeat(4, 1fr)"`
   and `gap: "24px"`; assert all four card names from `FEATURED_MENU_ITEMS` are present.
2. **Minimal code:** `useFeaturedGridColumns.ts` mirrors `useIsMobileViewport.ts`'s
   `useState`+`resize`-listener shape, returning `1 | 2 | 4` from `window.innerWidth`
   (`<= 640 → 1`, `<= 1024 → 2`, else `4` — see call-out #1 for the 1024 value). `FeaturedGrid.tsx`
   maps `FEATURED_MENU_ITEMS` to `MenuItemCard`s inside a `data-testid="featured-grid"` `<div>` with
   `display: "grid"`, `gridTemplateColumns: repeat(${columns}, 1fr)`, `gap: 24`.

## Task 4 (AC4) — mobile (375px) single column, no overflow

**File:** extends `FeaturedGrid.test.tsx`; new `src/features/site/FeaturedSection.tsx` +
`FeaturedSection.test.tsx`; modify `src/features/site/HomePage.tsx`.

1. **Failing test** (`FeaturedGrid.test.tsx`): set `window.innerWidth = 375`, dispatch `resize`;
   assert `featured-grid` now has `gridTemplateColumns: "repeat(1, 1fr)"`; assert all four cards are
   still present (`queryAllByRole` for the 4 "Add to Order" links) — i.e. nothing was hidden to fit,
   it reflowed. Add a middle case at `window.innerWidth = 800` asserting `"repeat(2, 1fr)"`
   (tablet tier from call-out #1 — beyond the letter of AC4 but required by the confirmed
   responsive-breakpoints decision).
2. **Failing test** (`FeaturedSection.test.tsx`): render `<FeaturedSection />`; assert the eyebrow
   text "Chef Recommendations" and heading "Popular Sourdough Pizzas" are present; at
   `window.innerWidth = 375` assert the section wrapper's `paddingLeft`/`paddingRight` are `"20px"`
   (reusing the exact 80/20 desktop/mobile split `SiteHeader` already uses, via
   `useIsMobileViewport`); at `1280` assert `"80px"`. This is what prevents horizontal overflow at
   375px alongside the 1-column grid.
3. **Failing test** (`HomePage.test.tsx`, extends Task 2's file): render `<HomePage />` (or via
   `SiteRoutes` at `/`) and assert the featured-grid section (eyebrow text) is present on the home
   page — ties the component-level tests back to AC1/AC3/AC4's literal "home page" framing.
4. **Minimal code:** `FeaturedSection.tsx` renders a `<section>` background `#FCFAF6`, horizontal
   padding driven by `useIsMobileViewport()` (80 desktop / 20 mobile, matching `SiteHeader`), the
   eyebrow (`eyebrow-label` token, brand red, uppercase) + heading (`section-heading` token) + a
   static 48×3px `#C82D25` rule, then `<FeaturedGrid />`. `HomePage.tsx` renders `<FeaturedSection />`
   alongside its existing content (the pre-existing `CreateExpenseForm` toggle on `HomePage` is
   unrelated leftover from STORY-001 and out of scope to touch here — left as-is).

## Verification

- `npm test` (Vitest) for all new/changed files above.
- Manual check in the browser (`npm run dev`) at 1280px and 375px widths against
  `.arc/designs/figma-section-6-54-featured-section.png`, since jsdom assertions above only check
  the inline styles that *drive* the layout (grid-template-columns, padding, gap), not an actual
  rendered reflow.
