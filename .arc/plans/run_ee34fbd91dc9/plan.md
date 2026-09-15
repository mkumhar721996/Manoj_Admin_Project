# Plan: MANOJ-ADMIN-PROJECT-STORY-015 — Menu Catalog Data

## Codebase context

Frontend-only React 18 + TypeScript + Vite app (Vitest + Testing Library). Relevant existing code:

- `src/features/site/menuData.ts` — a hardcoded `FEATURED_MENU_ITEMS: FeaturedMenuItem[]` array (4
  pizzas: name, price, description, imageSrc, imageAlt — **no category field**). It backs the
  homepage's "Chef Recommendations" carousel (`FeaturedGrid.tsx` → `FeaturedSection.tsx` →
  `HomePage.tsx`) and is directly imported by `MenuItemCard.test.tsx`.
- `src/features/site/OurMenuPage.tsx` — currently just a placeholder (`<main
  data-testid="our-menu-page"><h1>Our Menu</h1></main>`) routed at `/menu`. A prior story
  explicitly deferred "actual menu content" to a separate story — this is that story.
- `src/features/site/MenuItemCard.tsx` — already renders name/description/price/image + an "Add to
  Order" link; takes an `item` prop shaped like `FeaturedMenuItem`. No changes needed here — it
  already satisfies AC3's display requirements, we just need to feed it catalog data.
- `src/features/site/siteConfig.ts` + `siteConfig.test.ts` — **the established pattern for an
  externalized data file**: `public/site-config.json` is fetched at runtime (`loadSiteConfig`),
  with an in-code default/fallback (`DEFAULT_SITE_CONFIG`) used on fetch failure, wrapped in a
  `useSiteConfig()` hook. `SiteHeader.test.tsx` shows the consumer-test convention: stub global
  `fetch` with `vi.stubGlobal`, render, then `await screen.findBy...()` once the async load
  resolves — no module mocking. This story follows the exact same pattern for the menu catalog:
  `public/menu-catalog.json` is the externalized data file, fetched by a new `menuCatalog.ts`
  loader/hook, tested the same way `siteConfig.ts`/`SiteHeader.test.tsx` are.
- `public/images/menu/*.png` — the 4 pizza images already exist and are reused as-is for the real
  catalog JSON content.

**Design decision (flagging for reviewer):** the homepage's `FeaturedGrid`/`menuData.ts` are left
untouched. All 4 ACs here are scoped to "the menu page" (`/menu` → `OurMenuPage`), not the
homepage's curated "Chef Recommendations" carousel, which is a different, smaller, hand-picked
selection. This does mean the 4 existing pizzas' data will exist in two places (`menuData.ts` for
the homepage carousel, `public/menu-catalog.json` for the full catalog page) — accepted as
out-of-scope duplication rather than refactoring the untouched homepage feature, per "stay
strictly within the ACs."

## Design

- `src/features/site/menuCatalog.ts` (new) — mirrors `siteConfig.ts`:
  - `export type MenuCatalogItem = { id: string; name: string; description: string; price: string; category: string; imageSrc: string; imageAlt: string }`
  - `export const DEFAULT_MENU_CATALOG: MenuCatalogItem[] = []`
  - `export async function loadMenuCatalog(): Promise<MenuCatalogItem[]>` — `fetch("/menu-catalog.json")`, returns `DEFAULT_MENU_CATALOG` on non-ok response or thrown error, otherwise the parsed JSON array.
  - `export function useMenuCatalog(): MenuCatalogItem[]` — same `useState`/`useEffect` shape as `useSiteConfig`.
- `src/features/site/groupMenuItemsByCategory.ts` (new) — pure function: `groupMenuItemsByCategory(items: MenuCatalogItem[]): { category: string; items: MenuCatalogItem[] }[]`, grouping in order of each category's first appearance in `items` (no alphabetical re-sort, no hardcoded category list — the data file is the only source of truth for which categories exist).
- `src/features/site/OurMenuPage.tsx` (rewrite) — calls `useMenuCatalog()`, passes result through `groupMenuItemsByCategory`, renders:
  ```
  <main data-testid="our-menu-page">
    <h1>Our Menu</h1>
    {groups.map(group => (
      <section key={group.category}>
        <h2>{group.category}</h2>
        <div data-testid="menu-grid">
          {group.items.map(item => <MenuItemCard key={item.id} item={item} />)}
        </div>
      </section>
    ))}
  </main>
  ```
  Zero items → `groups` is `[]` → no `<section>`s render, no special-casing needed. Keeps the
  existing `data-testid="our-menu-page"` root, which `HomePage.test.tsx` already asserts on after
  the "Add to Order" navigation — must not break that.
- `public/menu-catalog.json` (new) — the real externalized data file: the 4 existing pizzas (same
  ids/names/prices/descriptions/images as `menuData.ts`) each with `"category": "Pizza"`, e.g.:
  ```json
  [
    { "id": "diavola", "name": "Diavola", "description": "...", "price": "$16.50", "category": "Pizza", "imageSrc": "/images/menu/diavola.png", "imageAlt": "Diavola" },
    ...
  ]
  ```

## AC1 — All items in the catalog file are displayed on the menu page

**Failing test first** (`src/features/site/menuCatalog.test.ts`, new, modeled on `siteConfig.test.ts`):
- `vi.stubGlobal("fetch", ...)` resolving `{ ok: true, json: () => Promise.resolve([<2 sample items>]) }` → `loadMenuCatalog()` resolves to that exact array.
- Rejected fetch → resolves to `DEFAULT_MENU_CATALOG` (`[]`).
- `{ ok: false }` response → resolves to `DEFAULT_MENU_CATALOG`.

**Minimal code:** `src/features/site/menuCatalog.ts` as designed above.

**Failing test 2** (`src/features/site/OurMenuPage.test.tsx`, new, modeled on `SiteHeader.test.tsx`'s fetch-stubbing convention):
- Stub global `fetch` to resolve with a JSON array of e.g. 3 items across 2 categories.
- Render `<MemoryRouter><OurMenuPage /></MemoryRouter>`.
- For each stubbed item, `await screen.findByRole("heading", { name: item.name })` is present.

**Minimal code:** rewrite `src/features/site/OurMenuPage.tsx` to call `useMenuCatalog()` and render one `MenuItemCard` per item (grouping wired in AC2, but this test already requires the items to render somewhere on the page).

**Files:** create `src/features/site/menuCatalog.ts`, `menuCatalog.test.ts`, `OurMenuPage.test.tsx`; modify `src/features/site/OurMenuPage.tsx`.

## AC2 — A new item appears in the grid under its assigned category

**Failing test first** (`src/features/site/groupMenuItemsByCategory.test.ts`, new):
- Input: items in categories `["Pizza", "Pizza", "Salads"]` (in that order) → output is `[{ category: "Pizza", items: [...2] }, { category: "Salads", items: [...1] }]`, preserving first-seen category order and item order within each group.

**Minimal code:** `src/features/site/groupMenuItemsByCategory.ts` as designed above.

**Failing test 2** (`src/features/site/OurMenuPage.test.tsx`): stub fetch with 2 "Pizza" items plus one new item `{ ..., name: "Caesar Salad", category: "Salads" }`. Render `OurMenuPage`. Assert:
- `await screen.findByRole("heading", { name: "Salads" })` (the category heading) is present.
- The "Caesar Salad" item heading is present, and — using `within(screen.getByRole("heading", { name: "Salads" }).closest("section")!)` — scoped inside that same section (i.e. under its own category, not lumped under "Pizza").

**Minimal code:** wire `groupMenuItemsByCategory` into `OurMenuPage.tsx` per the Design section (category `<section>`/`<h2>` wrapper around each group's grid).

**Files:** create `groupMenuItemsByCategory.ts`, `groupMenuItemsByCategory.test.ts`; extend `OurMenuPage.test.tsx`; modify `OurMenuPage.tsx`.

## AC3 — Price, image, and description from the catalog file display correctly on the item card

**Failing test first** (extend `src/features/site/OurMenuPage.test.tsx`): stub fetch with one item with distinctive values, e.g. `{ id: "test-item", name: "Test Pizza", description: "A distinctive test description", price: "$99.99", category: "Pizza", imageSrc: "/images/menu/test-item.png", imageAlt: "Test Pizza" }`. Render `OurMenuPage`, then assert (after `await screen.findByRole("heading", { name: "Test Pizza" })`):
- `screen.getByText("A distinctive test description")` is present.
- `screen.getByText("$99.99")` is present.
- `screen.getByRole("img", { name: "Test Pizza" })` has `src="/images/menu/test-item.png"`.

**Minimal code:** none expected beyond AC1/AC2's wiring — `MenuItemCard` already renders these fields correctly (per its own existing unit tests); this test confirms the fetched-JSON → `useMenuCatalog` → `groupMenuItemsByCategory` → `MenuItemCard` pipeline passes the fields through unmodified. If it fails, the fix is in the data-passing in `OurMenuPage.tsx`, not in `MenuItemCard.tsx`.

**Files:** extend `OurMenuPage.test.tsx` only (no new files expected).

## AC4 — Zero items in the catalog file renders the menu page with no items in the grid

**Failing test first** (extend `src/features/site/OurMenuPage.test.tsx`): stub fetch to resolve `{ ok: true, json: () => Promise.resolve([]) }`. Render `OurMenuPage`. Assert:
- `screen.getByTestId("our-menu-page")` is present (page still renders, no crash).
- After allowing the async load to settle (e.g. `await screen.findByTestId("our-menu-page")` then a microtask flush, or asserting the state directly with `waitFor`), `screen.queryAllByRole("article")` has length 0 (no `MenuItemCard`s rendered — `MenuItemCard` renders an `<article>`).
- `screen.queryAllByTestId("menu-grid")` has length 0 (no category sections rendered either).

**Minimal code:** none expected — `groupMenuItemsByCategory([])` already returns `[]`, and `OurMenuPage`'s `.map` over zero groups renders nothing extra. This test is a regression guard confirming the empty-array path was never special-cased incorrectly.

**Files:** extend `OurMenuPage.test.tsx` only.

## Populating the real data file

After the tests above pass against stubbed fetches, populate `public/menu-catalog.json` with the
real production content (the 4 existing pizzas + `"category": "Pizza"` for each, reusing the
already-bundled `public/images/menu/*.png` assets and the same copy as `menuData.ts`). This isn't
independently covered by an automated test — following the existing `site-config.json` precedent,
no test in this codebase fetches the real public JSON file over HTTP in jsdom; the loader's fetch
behavior is verified via stubbed `fetch` in `menuCatalog.test.ts`/`OurMenuPage.test.tsx`, and the
real file's presence/shape is manually verified by running the dev server and viewing `/menu`.

## Test order (TDD)

1. `menuCatalog.test.ts` (fetch success/failure/not-ok) → implement `menuCatalog.ts`.
2. `groupMenuItemsByCategory.test.ts` (grouping/order) → implement `groupMenuItemsByCategory.ts`.
3. `OurMenuPage.test.tsx` AC1 case (all items render) → rewrite `OurMenuPage.tsx` to load + flat-render items.
4. `OurMenuPage.test.tsx` AC2 case (new category grouping) → extend `OurMenuPage.tsx` to wrap items in category `<section>`s via `groupMenuItemsByCategory`.
5. `OurMenuPage.test.tsx` AC3 case (field fidelity) → should pass against step 4's implementation; fix data-passing if not.
6. `OurMenuPage.test.tsx` AC4 case (empty array) → should pass against step 4's implementation; fix if the empty-list path was special-cased incorrectly.
7. Create real `public/menu-catalog.json` content; manually verify via `npm run dev` → `/menu`.
8. Full `vitest run` pass.

## Out of scope

- No changes to `src/features/site/menuData.ts`, `FeaturedGrid.tsx`, `FeaturedSection.tsx`, or
  `HomePage.tsx` — the homepage's curated carousel is a separate, smaller dataset and no AC here
  mentions the homepage.
- No changes to `MenuItemCard.tsx` (already satisfies field-display requirements) or its existing
  test file.
- No category filter/tab UI, no search, no sorting beyond "preserve first-seen order from the data
  file," no pagination, no admin/editing UI for the catalog file itself (the story is about the
  data file existing and being read, not about authoring tooling).
- No schema validation of the catalog JSON's shape at runtime (matches `siteConfig.ts`'s existing
  precedent of trusting the fetched JSON shape as-is).
