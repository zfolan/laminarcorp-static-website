# Laminar website

Single-page React, TypeScript and Vite marketing site for Laminar’s household-first portfolio management and implementation workflow.

## Development

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm run test
npm run build
npm run lint
```

Use the local URL printed by Vite. Production output is written to `dist/`.

## Content and presentation

- `src/pages/StagePage.tsx` composes the logo-led opening and five sections: Households → Analytics → Rebalance → Proposals → Implementation.
- `src/data/stageBook.ts` owns the main copy and synthetic portfolio, proposal and deployment examples. The detailed holdings and trade tables are labeled excerpts, not complete ledgers or working product controls.
- `src/components/stage/scenes/` contains the product illustrations; the sibling `laminar-frontend-ui` repository is their visual reference, not a runtime dependency.
- `src/index.css` and `.21st/design.json` define the existing dark visual language and durable design decisions. Preserve the animated logo’s geometry and static reduced-motion fallback.
- `/#households`, `/#analytics`, `/#rebalance`, `/#proposals` and `/#implementation` link directly to workflow stages. `/?motion=reduce` forces the static presentation; OS reduced-motion preferences are also respected.
- Reloading returns to the top and clears the section hash while preserving query parameters. Opening a section link directly or using the workflow navigation still goes to that section.
- Page/social metadata lives in `index.html`, the `StagePage` metadata call and `public/laminar-social.svg`.

## Demo requests

All Request a Demo buttons open the same native modal form. Submission sends a JSON `POST /api/request-access` with trimmed `name`, `email` and `firm` fields. The existing endpoint and internal access identifiers are intentionally retained.

This repository does **not** implement that endpoint. Production hosting must supply it; frontend success/error checks using intercepted responses do not establish real lead delivery. Do not replace a missing service with a fake success or send invented test leads to the live endpoint.

## Verification

Vitest covers form validation, retry and stale-response behavior, scroll-hint navigation, illustration aggregate consistency, routing and canvas behavior. The jsdom dialog shim does not prove browser focus isolation: verify native keyboard interaction, focus restoration and responsive layouts in Chromium as well. Check the site at desktop, tablet and narrow phone widths, with motion enabled and reduced.
