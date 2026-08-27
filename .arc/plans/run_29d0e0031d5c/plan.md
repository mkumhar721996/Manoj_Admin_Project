# MANOJ-ADMIN-PROJECT-STORY-008 — Footer & Business Info

## Scope
Build the approved footer design (Figma node `6:136`, crop `.arc/designs/figma-section-6-136-footer.png`)
onto every site page via `Layout.tsx` (mirrors how `SiteHeader` is already mounted there), and add the
two static legal pages it links to. No new design work — this plan only wires the already-approved
composition into code, following the existing `src/features/site/*` conventions (function components,
inline `style` objects with literal hex/px values, `useIsMobileViewport` for the single mobile/desktop
breakpoint, `data-testid` on structural containers, colocated `*.test.tsx`).

## Design tokens/copy used (from `design-context.json` + `figma-frame.json` node `6:136` subtree)
- Footer container: `bg-dark` `#151212`, desktop padding `80px` left/right, `80px` top, `48px` bottom
  (json `x:-692..748,y:1860`, `paddingLeft/Right:80, paddingTop:80, paddingBottom:48, itemSpacing:64`).
- Business-info row (`footer-cols`, node `6:137`): 3 columns, `space-between`, full 1280px content width.
  - `FooterBrandColumn` (`6:138`): compact `BrandLogo` (36px red badge, `Fraunces` 700 italic 18px "F";
    wordmark `Fraunces` 600 22px) + description paragraph (`Geist` 400 14px, `text-on-dark-muted-60`)
    + `SocialRow` (`6:144`).
  - `SocialIconButton` (`6:145/6:147/6:149`): 36px circle, 7% white fill, radius 18, icon centered.
  - `FooterInfoColumn` "Kitchen Hours" (`6:151`): title `Fraunces` 600 16px, uppercase, white full-opacity;
    3× `FooterScheduleRow` (`6:154/6:157/6:160`): day line `Geist` 400 14px white 100%, hours line `Geist`
    400 14px white 60%.
  - `FooterInfoColumn` "Pizzeria Location" (`6:163`): same title style; `FooterAddressBlock` (`6:166`,
    `Geist` 400 14px, 60% white, 2-line wrap) + `FooterContactLines` (`6:167`: "Delivery:" line 100% white,
    "Email:" line 60% white, both `Geist` 400 14px).
- `Divider` (`6:170`): 1px hairline, `border-hairline-on-dark` `rgba(255,255,255,0.12)`, full width.
- `FooterBottomBar` (`6:171`): copyright (`Geist` 400 12px, 60% white) + `FooterLegalLinks` (`6:173`:
  "Privacy Policy" / "Delivery Terms", `Geist` 400 12px, 60% white, 24px gap), row `space-between`,
  vertically centered.
- Mobile/desktop breakpoint: reuse the codebase's existing single breakpoint (`useIsMobileViewport`,
  `≤640px`) and the `80px ⇄ 20px` side-padding pattern already established in `SiteHeader.tsx` and
  `FeaturedSection.tsx`, verified at the same 375px/1280px viewports the existing tests use.

## Flagged conflicts between the approved design and the acceptance criteria (not silently resolved)

1. **AC5 vs. `social-link-destinations` assumption.** AC5 requires that clicking a footer social icon
   navigates to "the corresponding social media profile." The approved design explicitly has no real
   Instagram/Facebook/Twitter URLs anywhere in the Figma file and records the assumption
   `href="#"` as a placeholder. No real profile URL exists in this codebase or design either, and I
   will not fabricate one (per the "never guess URLs" rule). **Resolution for this plan:** `SocialIconButton`
   will render a real `<a>` with `target="_blank" rel="noopener noreferrer"` whose `href` is sourced from
   config (see below) — the *mechanism* AC5 describes (a link that navigates on click) is fully built and
   tested, but the destination will remain the placeholder `"#"` until real profile URLs are supplied via
   `site-config.json`. This is a known, flagged gap, not a scope cut.
2. **AC2 vs. `legal-link-destinations` assumption.** Same placeholder-`href` assumption is recorded for
   the legal links, but here the destinations are internal app pages we control (not third-party URLs),
   so nothing is "guessed." This plan fully resolves AC2 by adding real `/privacy-policy` and
   `/delivery-terms` routes/pages and pointing `FooterLegalLinks` at them instead of `#`.
3. **`footer-business-info-data-source` open question is `blocking: true` but `resolution.decision: "deferred"`** —
   no final call has been made between static hardcoded copy and a future CMS/admin backend. This plan
   proceeds with the recorded `arc_assumption` (static/config-driven copy, no backend) because that is
   the only unblocked option today, and implements it by **extending the existing `siteConfig.ts` /
   `public/site-config.json` mechanism** (already used for the header's delivery ETA) with the footer's
   hours/address/contact/social fields, rather than hardcoding literals inline in JSX. This keeps the
   same seam the codebase already has for "content that might move to a backend later" without building
   any new infrastructure, and can be revisited without a component rewrite if the deferred decision
   later lands on `cms-driven`. Flagging this choice explicitly since it's a step beyond the literal
   `static-props` wording (constants in code) — it reuses the fetch-with-fallback pattern instead.
4. **`icon-set-source` assumption (Lucide) does not match this codebase.** No `lucide-react` dependency
   exists anywhere in `package.json`/the tree; the codebase's actual convention (`PlusIcon.tsx`) is a
   hand-rolled inline SVG per icon. This plan follows the codebase's real convention instead of adding a
   new dependency for three icons: `InstagramIcon.tsx`, `FacebookIcon.tsx`, `TwitterIcon.tsx` alongside
   `PlusIcon.tsx`, matching its props/shape (`width`, `height`, `stroke="currentColor"`, `aria-hidden`).
5. **`footer-responsive-layout` assumption** (columns stack vertically on mobile; bottom bar stacks to
   two centered lines) is adopted as-is — it doesn't conflict with any AC and is the only way to satisfy
   AC3 (375px, no clipping) given the 3-column desktop layout.
6. `Divider` (`6:170`) is trivial (a single 1px hairline used once) and will be inlined inside
   `SiteFooter.tsx` rather than becoming its own exported component/file — no test or reuse needs it in
   isolation, so a dedicated component would be an unused abstraction.

## Files

New:
- `src/features/site/InstagramIcon.tsx`, `FacebookIcon.tsx`, `TwitterIcon.tsx`
- `src/features/site/SocialIconButton.tsx`, `SocialIconButton.test.tsx`
- `src/features/site/FooterBrandColumn.tsx`
- `src/features/site/FooterScheduleRow.tsx`
- `src/features/site/FooterInfoColumn.tsx`
- `src/features/site/FooterAddressBlock.tsx`
- `src/features/site/FooterContactLines.tsx`
- `src/features/site/FooterLegalLinks.tsx`
- `src/features/site/FooterBottomBar.tsx`
- `src/features/site/SiteFooter.tsx`, `SiteFooter.test.tsx`
- `src/features/site/PrivacyPolicyPage.tsx`
- `src/features/site/DeliveryTermsPage.tsx`

Modified:
- `src/features/site/siteConfig.ts` (+ `siteConfig.test.ts`) — extend `SiteConfig`/`DEFAULT_SITE_CONFIG`
  with footer fields.
- `public/site-config.json` — add the same footer fields with the literal Figma copy as values.
- `src/features/site/BrandLogo.tsx` (+ `BrandLogo.test.tsx` if one doesn't exist yet — none found, so add
  it) — add an optional compact-size variant for footer reuse.
- `src/features/site/Layout.tsx` — render `<SiteFooter />` after `<Outlet />`.
- `src/features/site/routes.tsx` (+ `routes.test.tsx`) — add `/privacy-policy`, `/delivery-terms` routes.
- `src/features/site/HomePage.test.tsx` — add the AC1 assertion that footer content is visible on the
  home page.

## `siteConfig` extension (shape)

```ts
export type SiteConfig = {
  deliveryEtaPrefix: string;
  deliveryEtaValue: string;
  footerDescription: string;
  kitchenHours: { day: string; hours: string }[];
  pizzeriaAddress: string;
  deliveryPhone: string;
  contactEmail: string;
  socialLinks: { instagram: string; facebook: string; twitter: string };
};
```
`DEFAULT_SITE_CONFIG` gets the literal Figma copy (e.g. `kitchenHours: [{day: "Monday - Thursday", hours:
"12:00 PM - 10:00 PM"}, ...]`, `pizzeriaAddress: "842 Rione Monti, Sourdough Avenue, Suite 100"`,
`deliveryPhone: "(555) 392-7677"`, `contactEmail: "ciao@fornorosso.pizza"`, `socialLinks` all `"#"`
placeholders per the flagged conflict above). `public/site-config.json` mirrors the same values.

## Test-first plan per acceptance criterion

### AC1 — footer shows kitchen hours, location, contact info, and social links on the home page
1. **Failing test** — `SiteFooter.test.tsx`: render `<SiteFooter />` in a `MemoryRouter`; assert
   `screen.getByRole("heading", {name: "Kitchen Hours"})` and `"Pizzeria Location"` exist; each of the 3
   schedule day/hours pairs is present as text; the address text and both "Delivery:"/"Email:" lines are
   present; 3 links with accessible names `Instagram`, `Facebook`, `Twitter` exist (`getByRole("link")`).
   Also add a `siteConfig.test.ts` case asserting `DEFAULT_SITE_CONFIG` contains the new footer fields
   with the literal Figma values.
2. **Failing test** — `HomePage.test.tsx`: add a case rendering `<HomePage />` (or, if footer isn't
   mounted there directly, `<SiteRoutes>` at `/` as the other route tests already do) and assert
   `screen.getByRole("heading", {name: "Kitchen Hours"})` is visible, proving the footer renders when the
   home page loads (not just in isolation).
3. **Minimal code**: implement `SocialIconButton`/icons, `FooterScheduleRow`, `FooterInfoColumn`,
   `FooterAddressBlock`, `FooterContactLines`, `FooterBrandColumn`, `SiteFooter` composing them with the
   `useSiteConfig()` values (mirrors `SiteHeader`'s use of `useSiteConfig`); wire `<SiteFooter />` into
   `Layout.tsx`.
4. **Files**: all "New" files above except the legal pages/routes; `siteConfig.ts`, `site-config.json`,
   `Layout.tsx`, `HomePage.test.tsx`.

### AC2 — clicking a legal link navigates to the corresponding static page
1. **Failing test** — `routes.test.tsx`: render `<SiteRoutes>` at `/`, `user.click` the `Privacy Policy`
   link, assert `screen.getByTestId("privacy-policy-page")` and its `h1` appear (mirrors the existing
   Our-Menu navigation test); repeat for `Delivery Terms` → `delivery-terms-page`.
2. **Minimal code**: `PrivacyPolicyPage.tsx` / `DeliveryTermsPage.tsx`, each a `<main data-testid="...">`
   with an `<h1>`, matching `OurMenuPage.tsx`'s shape exactly; `FooterLegalLinks.tsx` renders
   `react-router-dom` `Link`s to `/privacy-policy` and `/delivery-terms` (not `#`, per flagged conflict
   #2 above) styled per the `6:174`/`6:175` tokens (12px `Geist`, 60% white, 24px gap).
3. **Files**: `PrivacyPolicyPage.tsx`, `DeliveryTermsPage.tsx`, `FooterLegalLinks.tsx`, `FooterBottomBar.tsx`,
   `routes.tsx`, `routes.test.tsx`.

### AC3 — mobile viewport (375px): footer content legible, not clipped
1. **Failing test** — `SiteFooter.test.tsx`: set `window.innerWidth = 375` + dispatch `resize` (same
   pattern as `SiteHeader.test.tsx`/`FeaturedSection.test.tsx`); assert the footer root has
   `paddingLeft`/`paddingRight` of `"20px"`; assert the `footer-cols` container's computed
   `flexDirection` is `"column"` (stacked, per the `footer-responsive-layout` assumption) and that every
   AC1 text/link assertion above still passes (nothing gets `display: none`d or truncated) at this width.
2. **Minimal code**: `SiteFooter` uses `useIsMobileViewport()` to toggle side padding `80→20` and the
   `footer-cols`/`footer-bottom` `flexDirection` `row→column` (with `gap` for stacked spacing), exactly
   mirroring the existing `SiteHeader`/`FeaturedSection` responsive pattern.
3. **Files**: `SiteFooter.tsx`, `SiteFooter.test.tsx`.

### AC4 — desktop viewport (1280px): footer uses available width, no overflow
1. **Failing test** — `SiteFooter.test.tsx`: set `window.innerWidth = 1280` + dispatch `resize`; assert
   `paddingLeft`/`paddingRight` are `"80px"` and the `footer-cols` container's `flexDirection` is `"row"`
   with `justifyContent: "space-between"` (matching Figma's full 1280px content width, 3-column
   `space-between` layout, node `6:137`).
2. **Minimal code**: same `useIsMobileViewport` branch as AC3 (default/desktop branch).
3. **Files**: `SiteFooter.tsx`, `SiteFooter.test.tsx`.

### AC5 — clicking a footer social link navigates to the social profile
1. **Failing test** — `SocialIconButton.test.tsx`: render `<SocialIconButton icon="instagram" href="https://example.test/instagram" label="Instagram" />`; assert `getByRole("link", {name: "Instagram"})` has
   `href="https://example.test/instagram"`, `target="_blank"`, `rel="noopener noreferrer"`. Add a
   `SiteFooter.test.tsx` case asserting the 3 social links' `href`s come from `useSiteConfig().socialLinks`
   (stub `fetch` to return custom `socialLinks`, same pattern as `SiteHeader.test.tsx`'s config-override
   test), proving they're config-driven and not hardcoded.
2. **Minimal code**: `SocialIconButton` renders an `<a>` (not a `<button>`) with the above attributes;
   `SocialRow`/`FooterBrandColumn` read `href`s from `config.socialLinks`.
3. **Files**: `SocialIconButton.tsx`, `SocialIconButton.test.tsx`, `FooterBrandColumn.tsx`,
   `SiteFooter.test.tsx`, `siteConfig.ts`.
   **Caveat (see flagged conflict #1):** with real destinations unset, `config.socialLinks` defaults to
   `"#"`; the AC's "navigated to profile" outcome is only fully exercised once real profile URLs are
   supplied in `site-config.json` — the plan builds and tests the complete, correct mechanism for that.

## Out of scope
- Any CMS/admin backend for footer content (blocked/deferred decision — see conflict #3).
- Real social profile URLs (no source of truth exists — see conflict #1).
- Real legal copy/content for the Privacy Policy and Delivery Terms pages beyond a placeholder
  heading, matching how `OurMenuPage.tsx` is currently just a heading — filling in real legal text is a
  separate content task, not implied by any AC here (ACs only require that the link *navigates* to the
  page).
