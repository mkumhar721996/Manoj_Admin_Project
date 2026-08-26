# STORY-009 — Legal Static Pages (Privacy Policy & Delivery Terms)

## Design decisions carried into this plan (from the approved design context)

- **`legal-page-content-undesigned` (blocking, resolved → `minimal-shell`)**: there is no Figma
  artboard or team-provided copy for either legal page — the only design trace is the two footer
  link labels. **This directly conflicts with the literal wording of AC1** ("the team-provided
  copy for that page is displayed"): no such copy exists yet. Per the recorded decision, this plan
  ships a minimal placeholder shell (H1 title + prose body paragraphs) so the routes exist and are
  visually consistent with the site, with real legal copy to be swapped in later. AC1 will be
  satisfied against placeholder copy, not final legal text.
- **`footer-scope-for-this-story` (blocking, resolved → `legal-row-only`)**: build only a minimal
  `SiteFooter` shell that hosts the copyright + legal links (`FooterLegalRow`, node 6:171). The
  `FooterBrand`, `Kitchen Hours` and `Pizzeria Location` columns (nodes 6:138, 6:151, 6:163) and the
  divider above them (node 6:170) belong to the full footer and are explicitly deferred to a
  separate footer story — they are not built here.
- **`legal-route-slugs` (non-blocking)**: routes are `/privacy-policy` and `/delivery-terms`,
  kebab-cased from the link labels, added alongside the existing `/` and `/menu` routes.
- **`link-affordance-undrawn` (non-blocking)**: the footer legal links (6:174/6:175) share the
  exact same style as the plain copyright text — Geist 400/12, `on-dark-translucent-60`
  (`rgba(255,255,255,0.60)`) — with no hover/underline state drawn. They render as real
  `react-router-dom` `Link`s (so they navigate) but keep that identical static styling, relying on
  the browser's default focus outline for keyboard accessibility.
- Tokens used: `ink` `#151212` (footer + legal-page background stays the page's default
  `white`/unstyled background, only the footer itself is `ink`), `on-dark-translucent-60`
  `rgba(255,255,255,0.60)` for footer copyright/links, Geist 400/12 for the legal row text,
  Fraunces 700 for legal-page `<h1>` titles, Geist 400/16 for legal-page body copy, `720`px
  `maxWidth` for the legal page content column (`LegalPageLayout`, per component_map node 6:175).

## Codebase fit

Static pages already follow the pattern in `src/features/site/OurMenuPage.tsx` (a
`<main data-testid="...">` shell) and are wired in `src/features/site/routes.tsx` inside the
`<Layout>` route so `SiteHeader` wraps every page. `Layout.tsx` currently renders only
`SiteHeader` + `<Outlet />`; the new `SiteFooter` is added there so it appears under every route,
including the two new legal pages. Styling convention throughout `src/features/site` is inline
`style` objects with literal hex colors and `fontFamily: "Geist, sans-serif"` /
`"Fraunces, serif"` strings (see `NavLink.tsx`, `BrandLogo.tsx`, `SiteHeader.tsx`) — new components
follow the same convention, no CSS-in-JS library or new dependency.

## AC1 — legal-page copy renders as readable text

**Failing tests first:**
- `src/features/site/PrivacyPolicyPage.test.tsx`: renders `<main data-testid="privacy-policy-page">`
  containing an `<h1>` with text "Privacy Policy" and at least one non-empty paragraph of body
  copy (assert visible text content is present, not asserting exact final legal wording since none
  exists yet).
- `src/features/site/DeliveryTermsPage.test.tsx`: same shape, `data-testid="delivery-terms-page"`,
  `<h1>Delivery Terms</h1>`, at least one non-empty body paragraph.

**Minimal code to pass:**
- `src/features/site/LegalPageLayout.tsx`: shared shell — `<main data-testid={testId}>` with
  `maxWidth: 720`, `<h1>` styled `fontFamily: "Fraunces, serif"`, `fontWeight: 700`, and a body
  wrapper styled `fontFamily: "Geist, sans-serif"`, `fontWeight: 400`, `fontSize: 16`, rendering
  `children` as the prose body. Props: `testId`, `title`, `children`.
- `src/features/site/PrivacyPolicyPage.tsx`: `<LegalPageLayout testId="privacy-policy-page" title="Privacy Policy">` wrapping placeholder prose paragraphs.
- `src/features/site/DeliveryTermsPage.tsx`: same pattern, `testId="delivery-terms-page"`, title
  "Delivery Terms", placeholder prose paragraphs.

**Files:**
- Create: `src/features/site/LegalPageLayout.tsx`, `src/features/site/PrivacyPolicyPage.tsx`, `src/features/site/DeliveryTermsPage.tsx`
- Create tests: `src/features/site/PrivacyPolicyPage.test.tsx`, `src/features/site/DeliveryTermsPage.test.tsx`

## AC2 — no accept/acknowledge interaction required

**Failing tests first (extend the two test files above):**
- In `PrivacyPolicyPage.test.tsx` and `DeliveryTermsPage.test.tsx`, add assertions that
  `screen.queryByRole("button")` and `screen.queryByRole("checkbox")` are both `null` — the page
  must be pure static text with no accept/acknowledge control.

**Minimal code to pass:**
- None beyond AC1's `LegalPageLayout`/page components — since they only render a heading and prose
  with no interactive controls, this passes as soon as AC1's implementation lands. This step is
  test-only, confirming the absence of any CTA is locked in by a test rather than left implicit.

**Files:**
- Modify tests: `src/features/site/PrivacyPolicyPage.test.tsx`, `src/features/site/DeliveryTermsPage.test.tsx`
- No additional production files.

## AC3 — footer links navigate to the corresponding legal page

**Failing tests first:**
- `src/features/site/FooterLegalLink.test.tsx`: renders a `react-router-dom` link with the given
  `label`/`to`, styled `fontFamily: "Geist, sans-serif"`, `fontWeight: 400`, `fontSize: 12`,
  `color: "rgba(255,255,255,0.60)"` (matches 6:174/6:175 exactly, no hover variant drawn).
- `src/features/site/FooterLegalRow.test.tsx`: renders the copyright text
  `"© 2026 Forno Rosso Pizzeria. All rights reserved."` styled with the same
  `rgba(255,255,255,0.60)` Geist 400/12 style, and two `FooterLegalLink`s ("Privacy Policy" →
  `/privacy-policy`, "Delivery Terms" → `/delivery-terms`) laid out with `gap: 24` in a row that is
  `justifyContent: "space-between"` against the copyright text.
- `src/features/site/SiteFooter.test.tsx`: renders `<footer data-testid="site-footer">` with
  `backgroundColor: "#151212"` (`ink`) containing the `FooterLegalRow` content.
- Extend `src/features/site/routes.test.tsx` with a new test mirroring the existing
  Home/Our Menu case: render `<SiteRoutes>` at `/`, click the footer's "Privacy Policy" link,
  assert `privacy-policy-page` testid and its `<h1>` appear and `home-page` is gone; then click
  "Delivery Terms" (now visible in the persistent footer) and assert `delivery-terms-page` appears.

**Minimal code to pass:**
- `src/features/site/FooterLegalLink.tsx`: thin `react-router-dom` `Link` wrapper, props
  `to`/`label`, always-static style (no active-state branching, per `link-affordance-undrawn`).
- `src/features/site/FooterLegalRow.tsx`: flex row, `justifyContent: "space-between"`,
  `alignItems: "center"`, rendering the copyright `<span>` on the left and a
  `display: "flex", gap: 24` wrapper with the two `FooterLegalLink`s on the right.
- `src/features/site/SiteFooter.tsx`: `<footer data-testid="site-footer" style={{ backgroundColor: "#151212", ... }}>` rendering `FooterLegalRow` (no `FooterBrand`/columns/divider — deferred per the `footer-scope-for-this-story` decision above).
- Modify `src/features/site/Layout.tsx`: render `<SiteFooter />` after `<Outlet />` so it appears
  on every route.
- Modify `src/features/site/routes.tsx`: add `<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />` and `<Route path="/delivery-terms" element={<DeliveryTermsPage />} />` inside the existing `<Layout>` route.

**Files:**
- Create: `src/features/site/FooterLegalLink.tsx`, `src/features/site/FooterLegalRow.tsx`, `src/features/site/SiteFooter.tsx`
- Modify: `src/features/site/Layout.tsx`, `src/features/site/routes.tsx`
- Create tests: `src/features/site/FooterLegalLink.test.tsx`, `src/features/site/FooterLegalRow.test.tsx`, `src/features/site/SiteFooter.test.tsx`
- Modify test: `src/features/site/routes.test.tsx`

## Explicitly out of scope (deferred by recorded decisions)

- `FooterBrand`, `SocialRow`/`SocialIconLink`, both `FooterColumn`s (Kitchen Hours, Pizzeria
  Location), and the `Divider` (node 6:170) — full footer content, deferred to a separate footer
  story per `footer-scope-for-this-story`.
- Real legal copy for either page — placeholder prose only, per `legal-page-content-undesigned`.
- Any hover/visited link styling for the footer legal links — none is drawn in the design.
