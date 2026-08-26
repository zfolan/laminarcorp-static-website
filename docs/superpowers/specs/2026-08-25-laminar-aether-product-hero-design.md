# Laminar Apex Aether Product Hero Design

## Problem

The current landing hero states “Know what needs you next,” but its static decision-workspace preview does not explain how Apex determines what needs attention or how an advisor carries that work forward. The old landing page communicated a complete strategy-to-implementation workflow, but its long scroll-controlled film is too heavy to reuse.

The replacement must make the product’s decision path understandable above the fold while preserving Laminar’s quiet, exact visual language. The Aether network must carry product meaning rather than act as decorative particles.

## Goals

- Keep “Know what needs you next” as the primary promise.
- Explain the product through the same four stages shown on the authenticated Home workspace.
- Let visitors inspect the stages directly through a restrained interactive Aether network.
- Preserve the selected Nexacore-inspired centered composition and visual depth without copying its branding, palette, or generic infrastructure narrative.
- Keep the page usable with reduced motion, keyboard navigation, touch input, or an unavailable canvas context.
- Replace only the current hero and its hero-specific product preview; preserve the landing page sections below it.

## Non-goals

- Rebuild the old six-stage scroll-controlled film.
- Enumerate every Apex workspace or capability in the hero.
- Explain authentication, administration, raw data editing, security policy maintenance, illustrations, bulk campaigns, or Ask Apex above the fold.
- Add stock imagery, video, 3D rendering, new state management, or a general-purpose visualization framework.
- Redesign the rest of the landing page in this change.

## Historical and product grounding

Git history contains two relevant directions:

- The old landing page led with “Portfolio strategy, carried through to implementation” and proved it with a six-stage household workflow.
- The current landing page leads with “Know what needs you next” and a static decision queue.

The new hero keeps the current priority-and-attention promise while restoring the old hero’s missing end-to-end clarity. The product breakdown is reduced to the four stages already presented on the authenticated Home workspace:

1. Book coverage
2. Priority queue
3. Decision review
4. Client action

This is a product abstraction, not a feature inventory. Detailed capabilities inform the stage language but remain in later landing-page sections or the authenticated app.

## Selected composition

The hero uses the approved Nexacore/Laminar composition:

- A compact floating navigation surface near the top edge.
- Centered eyebrow, headline, supporting sentence, and primary action.
- A dark horizon below the copy where the interactive field becomes the primary visual material.
- A deliberate transition from editorial promise to product evidence.

Laminar styling remains authoritative:

- Existing canvas, panel, border, platinum, pewter, and system-blue tokens.
- Instrument Sans for editorial language and IBM Plex Mono for stage labels and evidence.
- Restrained radii, hairline borders, minimal shadows, and blue used as a system cue.
- No purple color cycling, glass-card stack, rainbow gradient, bloom-heavy spotlight, or generic dashboard collage.

## Information architecture

### Hero promise

- Eyebrow: `ADVISOR OPERATING WORKSPACE`
- Heading: `Know what needs you next.`
- Supporting copy: Apex connects holdings coverage, a prioritized household, a reviewable recommendation, and client-ready action while keeping decision context attached.
- Primary action: `Request access`
- Secondary action: `Explore the workflow`

Final production copy may tighten wording, but it must preserve this meaning and must not introduce unsupported claims.

### Interactive stages

The default active stage is **Priority queue**, aligning the visual state with the headline.

#### 1. Book coverage

Purpose: establish the active advisor/client book as the boundary for downstream work.

- Title: `Know which client book is active.`
- Summary: show that coverage, holdings versions, accounts, and sources are connected before analysis begins.
- Evidence labels: `AUM + COVERAGE`, `VERSIONED HOLDINGS`, `ACTIVE BOOK BOUNDARY`.

#### 2. Priority queue

Purpose: explain how holdings become an advisor work queue.

- Title: `Find the households that need attention.`
- Summary: rank households using model drift, household status, and material impact.
- Evidence labels: `DRIFT-RANKED`, `AT RISK / REVIEW / ON TARGET`, `HOUSEHOLD CONTEXT`.

#### 3. Decision review

Purpose: show the professional review boundary before action.

- Title: `Review the recommendation in context.`
- Summary: compare allocation, models, cash, tax impact, proposed trades, and diagnostics before moving work forward.
- Evidence labels: `CURRENT VS TARGET`, `TRADE + CASH REVIEW`, `ADVISOR CONTROL`.

#### 4. Client action

Purpose: show what an approved decision can become without implying automatic execution.

- Title: `Carry the reviewed decision forward.`
- Summary: create a client proposal, custodian-ready orders, or a staged deployment plan while retaining rationale and history.
- Evidence labels: `CLIENT PROPOSAL`, `ORDER EXPORT`, `STAGED DEPLOYMENT`.

## Aether field interaction

The Aether field occupies the lower hero and visually connects the four stage nodes.

- Particles and connecting lines provide ambient depth.
- The pointer subtly brightens nearby connections, as in the existing Aether component.
- Stage nodes are semantic buttons rendered above the canvas; the canvas itself is not the interaction target.
- Local `activeStage` state starts on Priority queue and records the pinned selection.
- Hover or keyboard focus sets a temporary preview; pointer leave or blur restores the pinned stage.
- Click, tap, Enter, or Space updates the pinned stage.
- The detail card renders the temporary preview when present, otherwise the pinned stage.
- The pinned node uses a brighter system-blue point, restrained halo, and `aria-selected="true"`.
- The field does not auto-cycle stages.
- The network must remain sparse enough that labels and the detail surface dominate.

## Spotlight detail surface

The existing rectangular detail panel is replaced with one adapted `GlowCard` in `src/components/ui/spotlight-card.tsx`.

The production treatment deliberately narrows the supplied component:

- Blue glow only.
- One thin border and one localized pointer spotlight.
- Custom sizing to fill the hero’s detail region.
- No hue cycling, tilt, parallax, large outer bloom, or multiple simultaneous spotlight cards.
- The spotlight must use card-local pointer coordinates so the glow tracks correctly regardless of scroll position.
- The glow is decorative; stage content and selection do not depend on pointer movement.
- Spotlight CSS is defined once, not injected separately for every render.

The card contains only:

- Stage number and label.
- One short title.
- One short explanatory sentence.
- Up to three evidence labels.

## Responsive behavior

### Desktop

- Centered promise remains above the Aether field.
- Four stage buttons form one horizontal rail.
- The spotlight card sits above the rail and below the primary copy.
- Navigation retains the compact floating treatment.

### Mobile

- Navigation reduces to brand and primary action/menu treatment consistent with the existing header.
- Headline and supporting copy remain first in source and visual order.
- The Aether field occupies the middle/lower hero with reduced particle density.
- Four stages become a two-column control grid or compact stacked rail; all remain visible without horizontal scrolling.
- The spotlight card sits above the stage controls and uses normal document flow where necessary to avoid overlap.
- Evidence labels wrap rather than truncate.

## Accessibility and motion

- The hero is a labelled `section` with one page-level `h1`.
- Stage controls use buttons with a tablist/tab relationship or an equivalent button-group pattern with explicit selected state.
- Hover behavior is duplicated by focus; click behavior is duplicated by keyboard activation.
- Focus remains visibly styled using the existing system-blue focus treatment.
- The canvas is `aria-hidden` and never contains required information.
- With `prefers-reduced-motion: reduce`, particles render as a static field, Framer Motion entrance transitions are disabled, and the stage controls remain fully functional.
- If `canvas.getContext('2d')` is unavailable, the editorial copy, stage controls, and spotlight detail remain visible over the normal Laminar background.
- Text and controls maintain WCAG AA contrast against the dark canvas.

## Component and data design

Use the smallest concrete boundaries required by the selected design:

- `src/components/LaminarApexHero.tsx`
  - Owns the hero layout, selected-stage state, and stage interactions.
  - Renders the Aether canvas, editorial copy, stage controls, and spotlight detail.
- `src/components/ui/spotlight-card.tsx`
  - Provides the single pointer-reactive detail surface.
  - Accepts children and an optional class name; unsupported generic sizing and color variants are omitted unless an existing caller requires them.
- `src/data/landingContent.ts`
  - Stores the four stage labels, titles, summaries, and evidence labels with the existing landing-page content.

No context provider or external state manager is required. Selection is local hero state. No images or additional icons are required beyond the existing Lucide set.

## Landing-page cutover

- Replace the current `.hero` section and `HeroWorkspace` usage in `LandingPage` with `LaminarApexHero`.
- Preserve the existing `#platform`, decision, output, security, company, and footer sections.
- Remove hero-only scroll transforms and refs that become unused.
- Remove the `/aether-flow` demo route and its demo wrapper after the production hero uses the field.
- Remove or rename the generic Aether demo component rather than keeping a parallel deprecated implementation.
- Remove `HeroWorkspace` only if symbol references confirm it has no remaining caller; preserve other product-visual components.

## Verification

Permanent behavior checks:

- The home route renders the new heading, all four stage controls, and the default Priority queue content.
- Selecting Decision review updates the spotlight title and selected state.
- Keyboard focus exposes the same stage content as pointer hover.
- The existing request-access link remains correct.
- Existing landing anchors and sections remain present.

Runtime checks:

- Desktop and mobile browser verification of hierarchy, stage interaction, spotlight tracking, and horizontal overflow.
- Reduced-motion browser verification that the field is static and content remains interactive.
- Canvas-unavailable fallback verification.
- Project test, lint, build, TypeScript diagnostics, and `21st review` on changed UI paths.

## Acceptance criteria

- A first-time visitor can identify the four-stage Apex workflow without scrolling past the hero.
- The Aether network and stage controls communicate product structure rather than decorative motion.
- The spotlight card is clean, localized, and subordinate to the product message.
- All four stages work with pointer, keyboard, and touch input.
- Mobile preserves the same information without overlap or horizontal scrolling.
- Reduced-motion and canvas-unavailable states preserve all required information and controls.
- The existing landing-page sections and request-access flow continue to work.
