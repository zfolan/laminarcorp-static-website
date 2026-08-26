# Laminar Aether Stage Landing Page

## Problem

The current marketing site is a long, theatrical landing page. It does not look like Laminar, it reuses a pile of custom scroll choreography, and it fails as a simple product introduction for portfolio managers.

The product (laminar-frontend-ui, Laminar Apex) is a dark operational workspace: household library, rebalance trades, tax-aware analytics. The marketing site should feel like that product sitting in a distinctive field — not a generic SaaS narrative and not a replay of the existing repo.

## Goals

- Replace the marketing site with **one page**.
- Visual language is [Aether Flow Hero](https://21st.dev/@dhileepkumargm/components/aether-flow-hero): full-viewport flowing particles, cursor-reactive, dark.
- The page **is** a product overview: click Households, Rebalance, or Analytics in the Aether and a reduced product scene takes the center.
- Stay minimal. No extra marketing sections, no sticky-scroll film, no feature grids.
- Start from scratch. Do not adapt, restyle, or keep existing landing components, copy, or visuals in this repo.
- Convert with a short **Request access** form that never leaves the page.

## Non-goals

- Reusing `LandingPage`, `LaminarApexHero`, `ProductVisuals`, sticky decision chapters, old copy, or any prior hero experiment in this repo.
- Embedding or authenticating against `laminar-frontend-ui`.
- Live household data, runnable rebalances, or interactive controls inside the product frames.
- Additional scenes (Models, Data Viewer, Security Placement, Bulk Trades, and so on).
- A second marketing route, a standalone request-access page, sign-in, pricing, blog, or about.
- Stock photography, 3D product shots, or a shader that replaces the product.

## Audience and job

Visitor: a portfolio manager or advisor evaluating Laminar.

Job of the page: make the product recognizable in under a minute, let them inspect three surfaces, and let them request access without leaving the field.

## Visual language

### Aether

The canvas is the Aether Flow Hero field: interactive light particles that weave and react to the cursor. It is always present, always behind the UI, never a static wallpaper.

When a product scene is open, the field **dims slightly** so the frame can be read. It does not pause or disappear.

If the particle system cannot run (no WebGL, failed canvas), show a still dark field. Nodes, wordmark, form, and scenes must still work.

### Product frames

Reduced frames match the **real app**, not a marketing illustration of a dashboard:

- Dark canvas, quiet panels, hairline borders.
- Instrument Sans for interface copy; IBM Plex Mono for metrics, tickers, percents, AUM.
- Allocation as Target vs Current EQ / FI / Cash.
- Status language from the product: At Risk, Buy, Sell, Hold, drift percents, capital gain.
- No sidebar, no 52px utility bar, no app navigation chrome.

Aether may glow. The frames must not: they stay operational and quiet so they read as Laminar sitting in the field.

### Chrome

Almost nothing besides the field:

- **Wordmark** top-left: Laminar (product mark, not a slogan, not a link).
- **Request access** top-right: one quiet control, not a node.
- **Three nodes** in the Aether: Households, Rebalance, Analytics.

No headline in the empty center. No header bar. No footer. Copy arrives only with a scene.

## Page composition

First load: full-viewport Aether, empty center, three labeled nodes, wordmark, Request access.

That is the whole site. `/` is the stage. Request access is overlay state, not a URL. A 404 exists only so unknown paths don’t show a blank Vite page.

## Interaction

Selected approach: **the node becomes the scene**.

### Nodes

Three labeled elements live in the Aether around the empty center. They are part of the field (not a tab strip). States: idle, quieter (when another scene is open), and active (the one that opened).

They must look clickable without bouncing or looping attention animations.

### Open

Click a node. That node expands / travels into the center and resolves into its reduced product frame. A single line of copy fades in with the frame. The other two nodes remain, quieter.

### Swap

Click a different node. The current frame collapses toward its node; the newly clicked node expands into the center. Do not stack two dashboards or crossfade full frames as if they were slides.

### Close

Click the open frame, or the empty Aether around it, or press Escape. The frame collapses back into its node. Caption leaves. Empty field returns.

### Request access

Opens a light overlay on the Aether. Does not use the node-expand interaction. Closing it restores the previous stage state (empty or whichever scene was open).

### Keyboard

- Tab reaches nodes, Request access, and form fields when the overlay is open.
- Enter / Space on a node opens or swaps that scene.
- Escape closes the form if open; otherwise closes the scene if open.

## Product scenes

Static compositions on **shared demo data** (one fictional book so the three scenes feel like the same households). Readable household names, not raw UUIDs. Layout and metrics follow the live app screenshots from `alpha.dev.laminarapex.com` (Household Library, Rebalance workspace, Household Overview).

Nothing inside a frame is a real control: no sort, no Rebalance button, no upload, no model editor.

### Households

Source: Household Library.

Keep:

- A compact story strip: At Risk count, household count, total AUM.
- Four or five rows: household name, Target vs Current EQ/FI/Cash, AUM, drift, At Risk.

Drop: sidebar, search, IA filters, action clusters (Rebalance / Overview / Holdings / Note), full-book scroll.

Caption (one line): the book, and who needs attention.

### Rebalance

Source: household rebalance workspace.

Keep:

- Allocation strip: Equity / Fixed Income / Cash with current → target and trade impact.
- One or two account groups (e.g. RRSP and a taxable account).
- A short trade list: ticker, Buy/Sell, qty, trade value, capital gain.

Drop: 15-column sheet, Review toolbar, zoom, undo/redo, every account in the household.

Caption (one line): propose the trades, with tax in view.

### Analytics

Source: Household Overview.

Keep:

- Summary strip: total value, equity, fixed income, cash, off-model, model drift.
- Two panels: sector allocation drift, and currency exposure (CAD / USD).

Drop: Household / Whole Book scope toggle, account and model assignment editors, notes, full holdings table.

Caption (one line): tax and allocation in one place.

## Motion

- **Idle:** particles flow; nodes rest in the field; wordmark and Request access stay still.
- **Open / swap / close:** as above. Should feel like the field giving you the product, not a modal.
- **Form:** fade the overlay; Aether stays.
- **Reduced motion:** freeze particles (still field is enough). Open, swap, and close become instant cuts. The page remains fully usable.

## Structure

Greenfield UI in this marketing repo. Do not import the advisor app.

Units:

| Unit | Job | Depends on |
| --- | --- | --- |
| Aether canvas | Always-on field; cursor reaction; dim when a scene is open; still-field fallback | Nothing |
| Nodes | Three labeled targets; idle / quieter / active | Stage (reports clicks) |
| Stage | Empty vs one open scene; open / swap / close | Nodes, scene frames |
| Scene frames | Households / Rebalance / Analytics compositions | Shared demo data |
| Access | Quiet control + overlay form | Stage (must not destroy scene state) |

State:

- `scene`: `none` \| `households` \| `rebalance` \| `analytics`
- `access`: `closed` \| `open` \| `submitting` \| `success` \| `error`

## Request access

Fields: **name**, **firm**, **email** only. No role dropdown.

- Validate inline in the overlay (empty fields, invalid email). Do not flash the rest of the page.
- Submit stays on this page. Button shows a brief sending state.
- Success: overlay switches to a short confirmation. Aether and scene remain underneath. Close returns to the stage.
- Failure: form remains with one clear error and retry. No toast over the Aether.

Submit to the site’s access-request backend. There is no separate request-access route.

## Mobile

Same site, not a second information architecture.

- Aether still fills the viewport.
- Wordmark and Request access stay in the corners.
- Nodes sit **low on the field** (row or short stack), thumb-reachable, not crowding the empty center.
- An open scene uses the space above the nodes.
- If a reduced frame is taller than the stage, **the frame scrolls**, not the whole page.
- Form overlay is the same three fields, full width.
- No hamburger, no extra routes.

## Testing

Test behavior, not whether particles look correct.

- First load: no scene open.
- Node click opens the matching frame; another node swaps; click-off and Escape close.
- Request access validates name / firm / email; success and error stay in the overlay.
- Reduced motion: usable without expansion animation.
- Keyboard can reach nodes, open/close, and complete the form.

Do not screenshot-assert the particle field.

## Constraints

- Visual center of gravity is Aether Flow Hero (`dhileepkumargm/aether-flow-hero`), adapted to Laminar, not copied as a generic template landing.
- Product truth comes from `laminar-frontend-ui` / Apex screens, not from previous marketing copy in this repo.
- Existing files in this repo are disposable for the landing experience. Implementation replaces them; it does not restyle them.
- Accessibility: visible focus, labeled nodes and form fields, Escape/backdrop close, form errors tied to fields (`aria-invalid`), particle canvas ignored by assistive tech (`aria-hidden` on the decorative field).
