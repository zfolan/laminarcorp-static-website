# Laminar Apex design QA

## Sources and tested states

- Visual source of truth: `design-exports/swNgm.png` (1440 × 4600).
- Motion source of truth: `design-exports/h7gMU.png`.
- Application-alignment references: `../laminar-frontend-ui/docs/corporate-site-reference/screenshots/01-home-overview.png` (1675 × 1264), `04-rebalance-command-center.png`, `09-rebalance-trade-recommendations.png` (1631 × 1264), and `10-client-proposal-preview.png`.
- Final polished desktop capture: `design-exports/polish-desktop-full.png` (1425 × 6194 pixels from a 1440 × 900 CSS viewport at device scale 1).
- Reduced-motion capture: `design-exports/implementation-reduced-motion.png`.
- Mobile evidence: `design-exports/polish-mobile-hero.png`, `design-exports/polish-mobile-decision.png`, and `design-exports/implementation-request-mobile.png`.
- Same-input comparisons: `design-exports/qa-app-alignment-hero.png` and `design-exports/qa-app-alignment-decision.png` place the application reference at left and the polished marketing implementation at right. Both sides were normalized to 1050px height; source aspect ratios were retained rather than stretched.
- Browser viewports checked: 1440 × 900, 1024 × 768, and 390 × 844, plus the forced reduced-motion route `/?motion=reduce`.

## Comparison results

- Typography and hierarchy: Instrument Sans and IBM Plex Mono preserve the approved narrative/data contrast. Embedded product UI now uses the application's compact mono labels, denser data scale, and restrained weights while the marketing headline remains intentionally more editorial.
- Spacing and layout: the navigation, hero, workspace reveal, connected-context rail, decision stage, output handoff, trust strip, and closing statement preserve the Pencil composition. Product windows now adopt the application's 72px icon rail, breadcrumb/header strip, tighter queue density, straighter panels, and compact metric rows.
- Color and surfaces: the site now maps directly to the app's operational tokens: `#07090d` canvas, `#0c1118` panels, `#111923` raised surfaces, `#26313d` borders, a quieter `#5b8def` accent, `#668f79` success, and `#b28a54` review. Primary marketing actions use the app's powder-blue treatment instead of a saturated electric blue.
- Image quality and assets: the authoritative Laminar mark remains a local SVG and Lucide supplies consistent interface icons. No screenshot data or screenshot pixels are embedded in the marketing product visuals; all visible product records remain fictional React content.
- States and motion: the context rows converge on scroll, the desktop decision workspace moves through prioritize/review/approve states, and the approved record transitions into the proposal. At widths below 1024px and in reduced-motion mode, all three states render as a comprehensible linear narrative without parallax or long pinning.
- Responsiveness: desktop and tablet use the sticky stage at the requested threshold. Mobile uses queue-only and review-only reflows to retain legibility. Browser measurements confirm `scrollWidth === clientWidth` at desktop and mobile; controls and navigation remain inside the viewport.
- Accessibility: semantic landmarks and headings, associated form labels/errors, an accessible mobile disclosure button, visible `:focus-visible` treatment, practical tap targets, skip navigation, reduced-motion handling, and readable contrast are present. The request form has explicit success/error states and performs no network or storage calls.
- Copy and product data: launch copy matches the approved plan. Product records are fictional and defined locally.

## Iteration history

1. P1 layout — Motion's inline transform initially displaced the hero workspace because it collided with a CSS centering transform. Replaced transform-based centering with a calculated left edge; the final hero comparison shows the workspace aligned to the page grid.
2. P1 responsiveness — animated context/output elements and the desktop-oriented decision surface caused a 457px document width in the 375px mobile content viewport. Clipped the animated chapter overflow and introduced phase-specific mobile workspace reflow. Final browser measurement is 375px content width and 375px scroll width.
3. P2 reduced motion — MotionConfig disabled animation travel, but the landing page's layout selection still relied only on the operating-system preference. The forced QA mode is now included in the layout decision and renders three linear states with no sticky stage.
4. P2 application alignment — the initial product windows used a wide text sidebar, brighter blue states, larger cards, and more generic dashboard chrome than the current application. Rebuilt the product chrome around the app's 72px icon rail, breadcrumb strip, dense metrics, compact queue rows, quieter accent/status palette, and sharper panel geometry. The post-fix same-input comparisons are `qa-app-alignment-hero.png` and `qa-app-alignment-decision.png`.
5. P2 mobile product chrome — the desktop-derived workspace header could have crowded narrow screens after the rail refinement. Mobile now collapses the header to a 48px mark column plus breadcrumb, hides nonessential demo status, and keeps document width equal to client width (375px content viewport at the 390 × 844 browser setting).

## Remaining findings

- P3 intentional difference: full-page height is longer than the Pencil board because the implementation includes the specified sticky scroll distance, trust strip, and company/final CTA chapter. Focused section comparisons preserve the approved visual intent.
- No actionable P0, P1, or P2 fidelity, responsiveness, accessibility, or interaction findings remain.

final result: passed
