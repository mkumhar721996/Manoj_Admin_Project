# MANOJ-ADMIN-PROJECT-STORY-007 — Brand Story & Trust Content

## Scope

Build `story-section` (Figma node `6:108`) — the "Our Passion for the Perfect Crust" narrative,
its 3-item trust/feature list, and its two-photo image collage — and mount it on `HomePage`
after `FeaturedSection`. Everything else in the frame (header, hero, delivery banner, featured
grid, footer) is out of scope, already shipped, or covered by other stories.

## Codebase conventions this plan follows

- Section components are plain function components with inline `style` objects using literal
  design-token values (see `FeaturedSection.tsx`, `MenuItemCard.tsx`) — no CSS-in-JS library, no
  Tailwind.
- Responsive behaviour is done via small resize hooks (`useIsMobileViewport.ts`,
  640px breakpoint; `useFeaturedGridColumns.ts`) that both source `window.innerWidth` and
  re-render on `resize`. Tests stub `window.innerWidth`, dispatch `resize` inside `act`, and
  restore it in `afterEach`, then assert with `toHaveStyle`.
- Section data lives in a sibling `*Data.ts` module (`menuData.ts`) as typed constants, not
  inlined in JSX.
- Icons are **hand-authored inline SVGs** matching the target glyph (`PlusIcon.tsx` reproduces
  lucide's `plus` glyph by hand, `stroke="currentColor"`), not an added `lucide-react` dependency.
- Photographic assets are copied into `public/images/<section>/<name>.png` and referenced by
  absolute path from the data module (`imageSrc: "/images/menu/diavola.png"`).
- Every component gets a `data-testid` on its root and a colocated `<Name>.test.tsx`.

## Flagged conflicts / deviations from the recorded design context

1. **`icon-library-choice` open question vs. actual repo precedent.** The design's recorded
   assumption is to introduce `lucide-react` and wrap it in a shared `Icon(name)` component.
   That was never actually done — `PlusIcon.tsx` (shipped in STORY-006) is a hand-authored inline
   SVG instead. This plan follows the **actual repo precedent**, not the recorded assumption: it
   adds `StarIcon.tsx`, `ShieldIcon.tsx`, `CompassIcon.tsx` as hand-authored SVGs matching
   lucide's `star`/`shield`/`compass` glyphs, with no new dependency. Flagging this explicitly
   since it overrides a recorded (non-blocking) design assumption.
2. **`shared-section-heading-component` open question vs. actual repo precedent.** The design
   calls for one shared `SectionHeading` component reused by both the featured section and the
   story section. `FeaturedSection.tsx` never extracted one — its eyebrow/heading markup is
   inline. Extracting `SectionHeading` now would mean touching already-shipped,
   out-of-scope `FeaturedSection` code beyond this story's boundary. This plan renders the story
   heading markup inline inside `StorySection.tsx` (green eyebrow, no rule, per the design), the
   same way `FeaturedSection` does, and does **not** refactor `FeaturedSection`. If a shared
   `SectionHeading` is wanted, that's a separate follow-up story.
3. **Fixed 1440px two-column design vs. AC4 (1280px desktop, no overflow).** `story-section`
   is drawn as `80px padding | 600px text | 80px gap | 600px collage | 80px padding` = exactly
   1440px, with no reflow drawn between 641px and 1439px. AC4 requires the layout to use the
   available width **without overflow at 1280px**, which is 160px short of the fixed design's
   total. The recorded `story-section-responsive-breakpoints` decision only addresses the
   mobile (`≤640px`) stack, leaving this 641–1439px gap unresolved (its own resolution is
   `"deferred"`). Resolution used in this plan: implement the two-column layout with **fluid**
   CSS grid (`grid-template-columns: 1fr 1fr`, fixed `80px` gap and `80px` side padding) instead
   of literal `600px` columns, and size the collage images the same way (`1fr 1fr`, `16px` gap,
   `aspect-ratio` instead of a literal `292px` width). This preserves the designed proportions
   and gap/padding tokens exactly at ≥1440px while letting both columns compress fluidly at
   1280px, so nothing overflows. The literal `600px`/`292px` figures in the design are treated as
   the ≥1440px rendered size, not a hard minimum — consistent with how `FeaturedGrid` already
   uses `1fr` grid columns rather than literal `302px` card widths.
4. Non-blocking design assumptions taken as settled fact, per the design context: mobile
   (`≤640px`, reusing `useIsMobileViewport`) stacks text block first, then the image collage
   below it full-width (`story-section-responsive-breakpoints`, `assumed_option:
   stack-text-first`); alt text for the two photos is exactly `"A chef hand-stretching sourdough
   pizza dough over a floured countertop"` (6:134) and `"A wood-fired pizza baking inside a lit
   stone hearth oven"` (6:135) (`story-collage-alt-text`); the oven feature keeps the `compass`
   icon as designed (`story-icon-mismatch`).

## New files

- `src/features/site/storyData.ts` — narrative paragraph, the 3 feature-list entries
  (icon/title/description), and the 2 collage image entries (src/alt).
- `src/features/site/StarIcon.tsx`, `ShieldIcon.tsx`, `CompassIcon.tsx` — hand-authored SVGs.
- `src/features/site/FeatureListItem.tsx` — icon badge + title + description row.
- `src/features/site/FeatureList.tsx` — vertical stack of `FeatureListItem`.
- `src/features/site/StoryImageCollage.tsx` — the two photos.
- `src/features/site/StorySection.tsx` — the section shell (eyebrow, heading, paragraph,
  `FeatureList`, `StoryImageCollage`).
- `public/images/story/dough-stretching.png`, `public/images/story/wood-fired-oven.png` —
  copied from `.arc/designs/figma-asset-6-134-story-img-collage.png` and
  `figma-asset-6-135-story-img-collage.png` respectively.
- Matching `*.test.tsx` for each component above.

## Modified files

- `src/features/site/HomePage.tsx` — render `<StorySection />` after `<FeaturedSection />`.
- `src/features/site/HomePage.test.tsx` — assert the story section is present on `/`.

## Design tokens used (from the approved token set)

- Colors: `cream` `#F3EFE9` (section background), `brand_green` `#2A7043` (eyebrow), `ink`
  `#151212` (heading/titles), `muted` `#6B6661` (paragraph/description), `brand_red` `#C82D25`
  (icon badge fill), white icon glyphs (`currentColor` against the red badge).
- Type ramp: `eyebrow-label` (Geist 600 13/16.9, uppercase) for "The Sourdough Secret";
  `section-heading` (Fraunces 700 40/46) for "Our Passion for the Perfect Crust"; `body` (Geist
  400 16/25.6) for the narrative paragraph; `feature-title` (Fraunces 600 16/19.73) for each
  feature title; `body-xs` (Geist 400 13/18.2) for each feature description.
- Spacing: `96` top / `120` bottom padding, `80` side padding and column gap at ≥1440px (reduced
  to `20` side padding below 640px, matching `FeaturedSection`'s mobile padding precedent),
  `16` gap in the feature list and in the image collage, `12` gap between icon badge and text.
- Radii: `control` (16px) on both collage images (`object-fit: cover`); `control_lg` (18px) on
  the 36×36 circular icon badge (i.e. a full circle at that diameter).

## Test-first task list

### AC1 — narrative + all 3 trust claims visible on the home page

1. **Failing test** — `StorySection.test.tsx`: render `<StorySection />`, assert
   `screen.getByText(/the sourdough secret/i)`, `screen.getByRole("heading", { name: /our passion for the perfect crust/i })`,
   `screen.getByText(/ferment our proprietary sourdough mother starter for 48 hours/i)`, and the
   three claims via `screen.getByText(/100% imported san marzano tomatoes/i)`,
   `screen.getByText(/fior di latte & fresh mozzarella/i)`, `screen.getByText(/900°f stone hearth wood oven/i)`
   plus each one's description line.
2. **Minimal code** — add `storyData.ts` (narrative string + `STORY_FEATURES` array of
   `{ icon, title, description }`), `FeatureListItem.tsx`, `FeatureList.tsx`, and
   `StorySection.tsx` rendering the eyebrow/heading/paragraph/`FeatureList` with the tokens above.
3. **Files**: `storyData.ts`, `FeatureListItem.tsx` (+ `.test.tsx`), `FeatureList.tsx` (+
   `.test.tsx`), `StorySection.tsx`, `StorySection.test.tsx`.
4. **Integration** — extend `HomePage.test.tsx` with a test asserting
   `screen.getByTestId("story-section")` (or the heading text) is present when `SiteRoutes`
   renders `/`; wire it up by adding `<StorySection />` to `HomePage.tsx`.

### AC2 — at least one image accompanies the narrative

1. **Failing test** — `StoryImageCollage.test.tsx`: render `<StoryImageCollage />`, assert
   `screen.getByRole("img", { name: "A chef hand-stretching sourdough pizza dough over a floured countertop" })`
   and `screen.getByRole("img", { name: "A wood-fired pizza baking inside a lit stone hearth oven" })`
   both exist (covers "at least one image" and locks in the alt text from
   `story-collage-alt-text`).
2. **Minimal code** — add `STORY_IMAGES` entries to `storyData.ts` (`imageSrc`/`imageAlt` pairs
   pointing at the two copied PNGs) and `StoryImageCollage.tsx` rendering two `<img>` tags,
   `borderRadius: 16`, `objectFit: "cover"`.
3. **Files**: `storyData.ts` (extend), `StoryImageCollage.tsx`, `StoryImageCollage.test.tsx`,
   the two copied PNGs under `public/images/story/`; wire `StoryImageCollage` into
   `StorySection.tsx`.

### AC3 — legible, unclipped at a 320px mobile viewport

1. **Failing test** — in `StorySection.test.tsx`: stub `window.innerWidth = 320`, dispatch
   `resize` inside `act`, render, and assert `screen.getByTestId("story-section")` has
   `paddingLeft`/`paddingRight` `"20px"` and its grid wrapper has `gridTemplateColumns: "1fr"`
   (single column, text first). In `StoryImageCollage.test.tsx`, same viewport stub, assert both
   images are still present (`getAllByRole("img")` length `2`, none removed/hidden) and the
   collage's `gridTemplateColumns` is `"1fr"` (stacked vertically, full width) rather than side
   by side.
2. **Minimal code** — `StorySection.tsx` and `StoryImageCollage.tsx` both call
   `useIsMobileViewport()` and switch `gridTemplateColumns` (`"1fr 1fr"` → `"1fr"`) and side
   padding (`80`/`20`) accordingly; text column renders before the collage in DOM order in both
   modes so stacking naturally puts text first on mobile.
3. **Files**: `StorySection.tsx`, `StoryImageCollage.tsx` (both edited to add the hook), matching
   test files extended.

### AC4 — full available width, no overflow at 1280px desktop

1. **Failing test** — in `StorySection.test.tsx`: stub `window.innerWidth = 1280`, dispatch
   `resize`, assert `screen.getByTestId("story-section")` has `paddingLeft`/`paddingRight`
   `"80px"` and its grid wrapper has `gridTemplateColumns: "1fr 1fr"` and `columnGap`/`gap`
   `"80px"` (fluid columns, not literal `"600px 600px"`, per the flagged conflict-resolution
   above). In `StoryImageCollage.test.tsx`, same viewport, assert its `gridTemplateColumns` is
   `"1fr 1fr"` with `gap: "16px"` (not literal `292px` widths), so the two photos compress with
   the viewport instead of forcing horizontal overflow.
2. **Minimal code** — implement the desktop branch of both grids with `1fr` tracks (never a
   literal pixel column width), each image using `aspectRatio: "292 / 520"` so proportions match
   the design at any width without a hardcoded pixel size.
3. **Files**: `StorySection.tsx`, `StoryImageCollage.tsx` (same edits as AC3, covering both
   breakpoints), matching test files extended.

## Out of scope

Header, hero, delivery banner, featured grid/menu cards, footer, shared `Button`/`SectionHeading`
extraction, and all other `carried forward for continuity only` open questions from the design
context — none of these are touched by this plan.
