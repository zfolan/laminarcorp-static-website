# Laminar Aether Stage Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the marketing site with a single Aether stage page: empty field on load, three nodes that become reduced Households / Rebalance / Analytics frames, and Request access as an overlay.

**Architecture:** A `stageReducer` owns `scene` and `access`. `StagePage` is the only `/` view: Aether canvas behind chrome (wordmark + Request access), three nodes, one optional product frame, and an access overlay. Scene frames are static compositions over shared demo data. Nothing from the current landing UI is reused.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind 4, Vitest + Testing Library, `motion` for open/swap/close, 21st `dhileepkumargm/aether-flow-hero` for the particle field, existing Instrument Sans / IBM Plex Mono fonts.

**Spec:** `docs/superpowers/specs/2026-08-25-laminar-aether-stage-landing-design.md`

---

## File map

**Create**

- `src/types/stage.ts` — `SceneId`, `AccessStatus`, `StageState`
- `src/lib/stageState.ts` — reducer + escape helper
- `src/lib/stageState.test.ts`
- `src/lib/requestAccess.ts` — replace: name/firm/email validation + `submitRequestAccess`
- `src/lib/requestAccess.test.ts`
- `src/data/stageBook.ts` — one fictional book used by all three frames
- `src/data/stageBook.test.ts`
- `src/pages/StagePage.tsx` — the site
- `src/pages/StagePage.test.tsx` — behavior tests from the spec
- `src/components/stage/AetherCanvas.tsx`
- `src/components/stage/StageChrome.tsx` — wordmark + Request access control
- `src/components/stage/StageNodes.tsx`
- `src/components/stage/ProductFrame.tsx` — caption + scrollable frame shell
- `src/components/stage/scenes/HouseholdsFrame.tsx`
- `src/components/stage/scenes/RebalanceFrame.tsx`
- `src/components/stage/scenes/AnalyticsFrame.tsx`
- `src/components/stage/AccessOverlay.tsx`

**Modify**

- `src/App.tsx` — `/` → `StagePage`; drop `/request-access` and `SiteHeader`
- `src/App.test.tsx` — routes only: `/` stage, 404
- `src/index.css` — keep tokens/fonts; delete old landing CSS; add stage layout
- `src/pages/NotFoundPage.tsx` — copy that does not reference the old landing
- `src/index.html` — title/description
- `src/test/setup.ts` — `prefers-reduced-motion` support in `matchMedia`

**Delete (do not restyle)**

- `src/pages/LandingPage.tsx`
- `src/pages/RequestAccessPage.tsx`
- `src/components/LaminarApexHero.tsx` and `LaminarApexHero.test.tsx` if present
- `src/components/ProductVisuals.tsx`
- `src/components/SiteHeader.tsx`
- `src/components/SiteFooter.tsx`
- `src/components/SectionHeading.tsx`
- `src/components/ui/spotlight-card.tsx` and test if present
- `src/components/ui/aether-flow-hero.tsx` and `demo.tsx` if present (reinstall Aether into `components/stage`)
- `src/data/landingContent.ts`
- `src/types/content.ts` after request-access types move
- `src/components/BrandMark.tsx` after wordmark lives in `StageChrome`

**Keep**

- `src/hooks/usePageMeta.ts`
- `src/main.tsx` font imports
- `public/laminar-mark.svg`

**Commit rule:** after each task, `git add` only that task’s files, then `committer -y`. Do not pass `-a`.

---

### Task 1: Stage state reducer

**Files:**
- Create: `src/types/stage.ts`
- Create: `src/lib/stageState.ts`
- Test: `src/lib/stageState.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { initialStageState, reduceStage, type StageAction } from './stageState'

const apply = (...actions: StageAction[]) =>
  actions.reduce(reduceStage, initialStageState)

describe('reduceStage', () => {
  it('starts with no scene and closed access', () => {
    expect(initialStageState).toEqual({
      scene: 'none',
      access: 'closed',
      accessError: null,
    })
  })

  it('opens, swaps, and closes scenes', () => {
    expect(apply({ type: 'open-scene', scene: 'households' }).scene).toBe('households')
    expect(apply(
      { type: 'open-scene', scene: 'households' },
      { type: 'open-scene', scene: 'rebalance' },
    ).scene).toBe('rebalance')
    expect(apply(
      { type: 'open-scene', scene: 'analytics' },
      { type: 'close-scene' },
    ).scene).toBe('none')
  })

  it('keeps the scene when access opens and closes', () => {
    const state = apply(
      { type: 'open-scene', scene: 'households' },
      { type: 'open-access' },
    )
    expect(state.scene).toBe('households')
    expect(state.access).toBe('open')
    expect(apply(
      { type: 'open-scene', scene: 'households' },
      { type: 'open-access' },
      { type: 'close-access' },
    )).toEqual({ scene: 'households', access: 'closed', accessError: null })
  })

  it('moves access through submitting, success, and error', () => {
    expect(apply({ type: 'open-access' }, { type: 'submit-access' }).access).toBe('submitting')
    expect(apply(
      { type: 'open-access' },
      { type: 'submit-access' },
      { type: 'access-success' },
    ).access).toBe('success')
    const failed = apply(
      { type: 'open-access' },
      { type: 'submit-access' },
      { type: 'access-error', message: 'Could not send your request. Try again.' },
    )
    expect(failed.access).toBe('error')
    expect(failed.accessError).toBe('Could not send your request. Try again.')
  })

  it('Escape closes access first, then the scene', () => {
    expect(apply(
      { type: 'open-scene', scene: 'rebalance' },
      { type: 'open-access' },
      { type: 'escape' },
    )).toEqual({ scene: 'rebalance', access: 'closed', accessError: null })
    expect(apply(
      { type: 'open-scene', scene: 'rebalance' },
      { type: 'escape' },
    ).scene).toBe('none')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/stageState.test.ts`

Expected: FAIL — `stageState` is not defined.

- [ ] **Step 3: Write minimal implementation**

`src/types/stage.ts`:

```ts
export type SceneId = 'households' | 'rebalance' | 'analytics'
export type AccessStatus = 'closed' | 'open' | 'submitting' | 'success' | 'error'

export type StageState = {
  scene: SceneId | 'none'
  access: AccessStatus
  accessError: string | null
}
```

`src/lib/stageState.ts`:

```ts
import type { AccessStatus, SceneId, StageState } from '../types/stage'

export type StageAction =
  | { type: 'open-scene'; scene: SceneId }
  | { type: 'close-scene' }
  | { type: 'open-access' }
  | { type: 'close-access' }
  | { type: 'submit-access' }
  | { type: 'access-success' }
  | { type: 'access-error'; message: string }
  | { type: 'escape' }

export const initialStageState: StageState = {
  scene: 'none',
  access: 'closed',
  accessError: null,
}

export const reduceStage = (state: StageState, action: StageAction): StageState => {
  switch (action.type) {
    case 'open-scene':
      return { ...state, scene: action.scene }
    case 'close-scene':
      return { ...state, scene: 'none' }
    case 'open-access':
      return { ...state, access: 'open', accessError: null }
    case 'close-access':
      return { ...state, access: 'closed', accessError: null }
    case 'submit-access':
      return { ...state, access: 'submitting', accessError: null }
    case 'access-success':
      return { ...state, access: 'success', accessError: null }
    case 'access-error':
      return { ...state, access: 'error', accessError: action.message }
    case 'escape':
      if (state.access !== 'closed') return { ...state, access: 'closed', accessError: null }
      if (state.scene !== 'none') return { ...state, scene: 'none' }
      return state
  }
}

export type { AccessStatus, SceneId, StageState }
```

- [ ] **Step 4: Run tests and make sure they pass**

Run: `npx vitest run src/lib/stageState.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/stage.ts src/lib/stageState.ts src/lib/stageState.test.ts
committer -y
```

---

### Task 2: Request access validation and submit

**Files:**
- Modify: `src/lib/requestAccess.ts` (replace contents)
- Create: `src/lib/requestAccess.test.ts`
- Delete later: `src/types/content.ts` role/workflow fields — stop importing them now

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it, vi, afterEach } from 'vitest'
import { submitRequestAccess, validateRequestAccess } from './requestAccess'

afterEach(() => vi.restoreAllMocks())

describe('validateRequestAccess', () => {
  it('requires name, firm, and a valid email', () => {
    expect(validateRequestAccess({ name: '', email: '', firm: '' })).toEqual({
      name: 'Enter your name.',
      email: 'Enter a valid work email.',
      firm: 'Enter your firm name.',
    })
    expect(validateRequestAccess({ name: 'Nolan', email: 'nolan@example.com', firm: 'Northstar' })).toEqual({})
  })

  it('does not mention role', () => {
    expect(validateRequestAccess({ name: 'Nolan', email: 'bad', firm: 'Northstar' })).toEqual({
      email: 'Enter a valid work email.',
    })
  })
})

describe('submitRequestAccess', () => {
  it('POSTs JSON and resolves on ok', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
    await submitRequestAccess({ name: 'Nolan', email: 'nolan@example.com', firm: 'Northstar' })
    expect(fetchSpy).toHaveBeenCalledWith('/api/request-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Nolan', email: 'nolan@example.com', firm: 'Northstar' }),
    })
  })

  it('throws a retryable message when the request fails', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    await expect(
      submitRequestAccess({ name: 'Nolan', email: 'nolan@example.com', firm: 'Northstar' }),
    ).rejects.toThrow('Could not send your request. Try again.')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/requestAccess.test.ts`

Expected: FAIL on role-less shape and/or `submitRequestAccess`.

- [ ] **Step 3: Write minimal implementation**

Replace `src/lib/requestAccess.ts`:

```ts
export type RequestAccessForm = {
  name: string
  email: string
  firm: string
}

export type RequestAccessFormErrors = Partial<Record<keyof RequestAccessForm, string>>

export const validateRequestAccess = (form: RequestAccessForm): RequestAccessFormErrors => {
  const errors: RequestAccessFormErrors = {}
  if (!form.name.trim()) errors.name = 'Enter your name.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid work email.'
  if (!form.firm.trim()) errors.firm = 'Enter your firm name.'
  return errors
}

export const REQUEST_ACCESS_ERROR = 'Could not send your request. Try again.'

export const submitRequestAccess = async (form: RequestAccessForm): Promise<void> => {
  const response = await fetch('/api/request-access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name.trim(),
      email: form.email.trim(),
      firm: form.firm.trim(),
    }),
  })
  if (!response.ok) throw new Error(REQUEST_ACCESS_ERROR)
}
```

- [ ] **Step 4: Run tests and make sure they pass**

Run: `npx vitest run src/lib/requestAccess.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/requestAccess.ts src/lib/requestAccess.test.ts
committer -y
```

---

### Task 3: Shared demo book

**Files:**
- Create: `src/data/stageBook.ts`
- Test: `src/data/stageBook.test.ts`

One fictional book. Readable names. Chen Family is the household used by Rebalance and Analytics so the tour is one book. Numbers follow the Apex screenshots (allocation bars, At Risk, CAD/USD, capital gain) without copying UUID ids.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { stageBook, STAGE_CAPTIONS } from './stageBook'

describe('stageBook', () => {
  it('is one book: five households, all used by library, Chen used by the other scenes', () => {
    expect(stageBook.households).toHaveLength(5)
    expect(stageBook.households.every((row) => row.status === 'At Risk')).toBe(true)
    expect(stageBook.featured.name).toBe('Chen Family')
    expect(stageBook.featured.aum).toBe(stageBook.households[0].aum)
    expect(stageBook.rebalance.household).toBe('Chen Family')
    expect(stageBook.analytics.household).toBe('Chen Family')
  })

  it('exposes one-line captions', () => {
    expect(STAGE_CAPTIONS.households).toBe('The book, and who needs attention.')
    expect(STAGE_CAPTIONS.rebalance).toBe('Propose the trades, with tax in view.')
    expect(STAGE_CAPTIONS.analytics).toBe('Tax and allocation in one place.')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/stageBook.test.ts`

Expected: FAIL — module missing.

- [ ] **Step 3: Write the data module**

```ts
import type { SceneId } from '../types/stage'

export type SleeveWeights = { equity: number; fixedIncome: number; cash: number }

export type HouseholdRow = {
  name: string
  accounts: number
  aum: number
  drift: number
  status: 'At Risk'
  target: SleeveWeights
  current: SleeveWeights
}

export type TradeRow = {
  ticker: string
  name: string
  action: 'BUY' | 'SELL'
  qty: number
  tradeValue: number
  capitalGain: number
}

export type AccountGroup = {
  type: string
  value: number
  trades: TradeRow[]
}

export const STAGE_CAPTIONS: Record<SceneId, string> = {
  households: 'The book, and who needs attention.',
  rebalance: 'Propose the trades, with tax in view.',
  analytics: 'Tax and allocation in one place.',
}

const chen: HouseholdRow = {
  name: 'Chen Family',
  accounts: 5,
  aum: 3_340_000,
  drift: 0.494,
  status: 'At Risk',
  target: { equity: 0.80, fixedIncome: 0.19, cash: 0.01 },
  current: { equity: 0.306, fixedIncome: 0.604, cash: 0.091 },
}

export const stageBook = {
  strip: { atRisk: 5, households: 5, totalAum: 8_390_000 },
  households: [
    chen,
    {
      name: 'Rivera Household',
      accounts: 4,
      aum: 1_500_000,
      drift: 0.274,
      status: 'At Risk' as const,
      target: { equity: 0.80, fixedIncome: 0.19, cash: 0.01 },
      current: { equity: 0.526, fixedIncome: 0.261, cash: 0.213 },
    },
    {
      name: 'Patel Family',
      accounts: 5,
      aum: 2_000_000,
      drift: 0.228,
      status: 'At Risk' as const,
      target: { equity: 0.80, fixedIncome: 0.19, cash: 0.01 },
      current: { equity: 0.572, fixedIncome: 0.403, cash: 0.025 },
    },
    {
      name: 'Okoye Trust',
      accounts: 3,
      aum: 1_060_000,
      drift: 0.322,
      status: 'At Risk' as const,
      target: { equity: 0.80, fixedIncome: 0.19, cash: 0.01 },
      current: { equity: 0.488, fixedIncome: 0.512, cash: 0 },
    },
    {
      name: 'Berg Holdings',
      accounts: 4,
      aum: 490_000,
      drift: 0.20,
      status: 'At Risk' as const,
      target: { equity: 0.80, fixedIncome: 0.19, cash: 0.01 },
      current: { equity: 1, fixedIncome: 0, cash: 0 },
    },
  ],
  featured: chen,
  rebalance: {
    household: 'Chen Family',
    current: chen.current,
    target: chen.target,
    tradeImpact: { equity: 1_650_000, fixedIncome: -1_380_000, cash: -42_000 },
    accounts: [
      {
        type: 'RRSP',
        value: 237_800,
        trades: [
          { ticker: 'ZCS', name: 'BMO Short Corporate Bond ETF', action: 'SELL' as const, qty: -3144, tradeValue: -43_859, capitalGain: 12 },
          { ticker: 'XLV', name: 'Health Care Select Sector SPDR', action: 'BUY' as const, qty: 49, tradeValue: 9_702, capitalGain: 0 },
          { ticker: 'AAPL', name: 'Apple', action: 'BUY' as const, qty: 12, tradeValue: 5_144, capitalGain: 0 },
        ],
      },
      {
        type: 'CAD TAXABLE',
        value: 102_699,
        trades: [
          { ticker: 'DYN6004', name: 'Dynamic Power American Growth', action: 'SELL' as const, qty: -32263, tradeValue: -32_263, capitalGain: 0 },
          { ticker: 'BN', name: 'Brookfield', action: 'BUY' as const, qty: 87, tradeValue: 5_066, capitalGain: 0 },
        ],
      },
    ] satisfies AccountGroup[],
  },
  analytics: {
    household: 'Chen Family',
    total: chen.aum,
    sleeves: {
      equity: { value: 1_022_000, weight: chen.current.equity, target: chen.target.equity },
      fixedIncome: { value: 2_017_000, weight: chen.current.fixedIncome, target: chen.target.fixedIncome },
      cash: { value: 304_000, weight: chen.current.cash, target: chen.target.cash },
      offModel: { value: 110_000, weight: 0.033 },
    },
    drift: chen.drift,
    sectors: [
      { name: 'Other', current: 0.145, model: 0.329, drift: -0.184 },
      { name: 'Utilities', current: 0.156, model: 0.056, drift: 0.10 },
      { name: 'Health Care', current: 0.071, model: 0, drift: 0.071 },
      { name: 'Information Technology', current: 0.13, model: 0.076, drift: 0.054 },
    ],
    currency: { cad: 0.917, usd: 0.083, cadValue: 3_063_000, usdValue: 277_000 },
  },
}
```

- [ ] **Step 4: Run tests and make sure they pass**

Run: `npx vitest run src/data/stageBook.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/stageBook.ts src/data/stageBook.test.ts
committer -y
```

---

### Task 4: Stage page empty shell

First load only: Aether placeholder, wordmark (not a link), Request access button, three nodes, no product frame, no header, no `/request-access`.

**Files:**
- Create: `src/components/stage/StageChrome.tsx`
- Create: `src/components/stage/StageNodes.tsx`
- Create: `src/pages/StagePage.tsx`
- Create: `src/pages/StagePage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css` (add `.stage-page` full viewport; do not restyle old landing classes for this)
- Modify: `src/hooks/usePageMeta.ts` — no change unless needed

- [ ] **Step 1: Write the failing test**

`src/pages/StagePage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { StagePage } from './StagePage'
import { STAGE_CAPTIONS } from '../data/stageBook'

const renderStage = () => render(
  <MemoryRouter>
    <StagePage />
  </MemoryRouter>,
)

describe('StagePage first load', () => {
  it('shows wordmark, request access, and three nodes with no scene', () => {
    renderStage()
    expect(screen.getByText('LAMINAR')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /laminar/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Request access' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Households' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Rebalance' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Analytics' })).toBeInTheDocument()
    expect(screen.queryByText(STAGE_CAPTIONS.households)).not.toBeInTheDocument()
    expect(screen.queryByText(STAGE_CAPTIONS.rebalance)).not.toBeInTheDocument()
    expect(screen.queryByText(STAGE_CAPTIONS.analytics)).not.toBeInTheDocument()
  })
})
```

Also add to `src/App.test.tsx` (replace the old landing assertions that will break — if the file still expects the old hero, rewrite the `/` case now):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

const renderAt = (path: string) => {
  window.history.pushState({}, '', path)
  return render(<App />)
}

describe('public routes', () => {
  it('renders the stage at / with no request-access route', () => {
    renderAt('/')
    expect(screen.getByRole('button', { name: 'Households' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Platform' })).not.toBeInTheDocument()
  })

  it('renders a recovery route for unknown paths', () => {
    renderAt('/missing-page')
    expect(screen.getByRole('link', { name: /return home/i })).toHaveAttribute('href', '/')
  })
})
```

Remove the old landing / request-access tests from `src/App.test.tsx` in this task so `npx vitest run` is not blocked by dead UI.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/StagePage.test.tsx`

Expected: FAIL — `StagePage` missing.

- [ ] **Step 3: Write minimal implementation**

`StageChrome.tsx`:

```tsx
export const StageChrome = ({ onRequestAccess }: { onRequestAccess: () => void }) => (
  <div className="stage-chrome">
    <p className="stage-wordmark">
      <img src="/laminar-mark.svg" alt="" width={28} height={28} />
      <span>LAMINAR</span>
    </p>
    <button type="button" className="stage-access-trigger" onClick={onRequestAccess}>
      Request access
    </button>
  </div>
)
```

`StageNodes.tsx`:

```tsx
import type { SceneId } from '../../types/stage'

const NODES: { id: SceneId; label: string }[] = [
  { id: 'households', label: 'Households' },
  { id: 'rebalance', label: 'Rebalance' },
  { id: 'analytics', label: 'Analytics' },
]

type Props = {
  scene: SceneId | 'none'
  onSelect: (id: SceneId) => void
}

export const StageNodes = ({ scene, onSelect }: Props) => (
  <div className="stage-nodes">
    {NODES.map((node) => {
      const state = scene === 'none' ? 'idle' : scene === node.id ? 'active' : 'quieter'
      return (
        <button
          key={node.id}
          type="button"
          className={`stage-node stage-node--${node.id} stage-node--${state}`}
          aria-pressed={scene === node.id}
          onClick={() => onSelect(node.id)}
        >
          {node.label}
        </button>
      )
    })}
  </div>
)
```

`StagePage.tsx`:

```tsx
import { useReducer } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { initialStageState, reduceStage } from '../lib/stageState'
import { StageChrome } from '../components/stage/StageChrome'
import { StageNodes } from '../components/stage/StageNodes'

export const StagePage = () => {
  const [state, dispatch] = useReducer(reduceStage, initialStageState)
  usePageMeta({
    title: 'Laminar Apex',
    description: 'Portfolio operations for advisors: household books, rebalances, and tax-aware analytics.',
  })

  return (
    <div className="stage-page">
      <StageChrome onRequestAccess={() => dispatch({ type: 'open-access' })} />
      <StageNodes scene={state.scene} onSelect={(scene) => dispatch({ type: 'open-scene', scene })} />
    </div>
  )
}
```

`App.tsx` — drop `SiteHeader` and `/request-access`:

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { StagePage } from './pages/StagePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  )
}

const RoutedApp = () => {
  const forceReducedMotion = new URLSearchParams(window.location.search).get('motion') === 'reduce'
  return (
    <MotionConfig reducedMotion={forceReducedMotion ? 'always' : 'user'}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <main id="main-content">
        <Routes>
          <Route path="/" element={<StagePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </MotionConfig>
  )
}

export default App
```

Add to `src/index.css` (keep `:root` tokens, skip-link, fonts; do not keep `.apex-hero` etc. for new work):

```css
.stage-page {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background: var(--canvas);
}
.stage-chrome {
  position: absolute;
  z-index: 6;
  top: 20px;
  right: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}
.stage-chrome > * { pointer-events: auto; }
.stage-wordmark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
}
.stage-access-trigger {
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--border-strong);
  border-radius: 5px;
  background: transparent;
  color: var(--platinum);
  cursor: pointer;
}
.stage-nodes {
  position: absolute;
  z-index: 5;
  inset: 0;
  pointer-events: none;
}
.stage-node {
  pointer-events: auto;
  position: absolute;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(12, 17, 24, 0.72);
  color: var(--platinum);
  cursor: pointer;
}
.stage-node--households { top: 38%; left: 12%; }
.stage-node--rebalance { top: 28%; right: 14%; }
.stage-node--analytics { bottom: 22%; left: 42%; }
.stage-node--quieter { opacity: 0.45; }
.stage-node--active { border-color: var(--blue-bright); }
@media (max-width: 767px) {
  .stage-nodes { inset: auto 16px 20px; display: flex; gap: 8px; }
  .stage-node { position: static; flex: 1; }
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/pages/StagePage.test.tsx src/App.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/stage/StageChrome.tsx src/components/stage/StageNodes.tsx src/pages/StagePage.tsx src/pages/StagePage.test.tsx src/App.tsx src/App.test.tsx src/index.css
committer -y
```

---

### Task 5: Open, swap, and close scenes

**Files:**
- Create: `src/components/stage/ProductFrame.tsx`
- Create: `src/components/stage/scenes/HouseholdsFrame.tsx` (minimal title + caption first; full layout in Task 6)
- Create: `src/components/stage/scenes/RebalanceFrame.tsx` (minimal)
- Create: `src/components/stage/scenes/AnalyticsFrame.tsx` (minimal)
- Modify: `src/pages/StagePage.tsx`
- Modify: `src/pages/StagePage.test.tsx`

- [ ] **Step 1: Extend StagePage tests**

```tsx
it('opens, swaps, and closes product scenes', async () => {
  const user = userEvent.setup()
  renderStage()
  await user.click(screen.getByRole('button', { name: 'Households' }))
  expect(screen.getByText(STAGE_CAPTIONS.households)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Households' })).toHaveAttribute('aria-pressed', 'true')

  await user.click(screen.getByRole('button', { name: 'Rebalance' }))
  expect(screen.queryByText(STAGE_CAPTIONS.households)).not.toBeInTheDocument()
  expect(screen.getByText(STAGE_CAPTIONS.rebalance)).toBeInTheDocument()

  await user.keyboard('{Escape}')
  expect(screen.queryByText(STAGE_CAPTIONS.rebalance)).not.toBeInTheDocument()
})

it('closes when the open frame is clicked', async () => {
  const user = userEvent.setup()
  renderStage()
  await user.click(screen.getByRole('button', { name: 'Analytics' }))
  await user.click(screen.getByRole('button', { name: 'Close Analytics preview' }))
  expect(screen.queryByText(STAGE_CAPTIONS.analytics)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/StagePage.test.tsx`

Expected: FAIL — captions not rendered.

- [ ] **Step 3: Implement frame shell and wire StagePage**

`ProductFrame.tsx` — the whole frame is the close control (spec: frames are not interactive). Put `overflow: auto` on `.product-frame`.

```tsx
import type { ReactNode } from 'react'
import type { SceneId } from '../../types/stage'
import { STAGE_CAPTIONS } from '../../data/stageBook'

const labels: Record<SceneId, string> = {
  households: 'Households',
  rebalance: 'Rebalance',
  analytics: 'Analytics',
}

export const ProductFrame = ({
  scene,
  children,
  onClose,
}: {
  scene: SceneId
  children: ReactNode
  onClose: () => void
}) => (
  <div className="product-stage">
    <p className="product-caption">{STAGE_CAPTIONS[scene]}</p>
    <button type="button" className="product-frame" aria-label={`Close ${labels[scene]} preview`} onClick={onClose}>
      {children}
    </button>
  </div>
)
```

Minimal scene components (full UI in later tasks) must include recognizable copy from `stageBook` so later tests can query it. For this task they can render `{stageBook.featured.name}` / `'Rebalance'` heading / analytics household name.

Wire `StagePage`: if `state.scene !== 'none'`, render `ProductFrame` with the matching scene component. `onClose` → `{ type: 'close-scene' }`. `useEffect` for `keydown` Escape → `{ type: 'escape' }`.

Add CSS: `.product-stage` centered, max-width ~960px, z-index 4; `.product-frame` dark panel, max-height calc(100svh - 220px), overflow auto; `.product-caption` above the frame.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/pages/StagePage.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/stage/ProductFrame.tsx src/components/stage/scenes src/pages/StagePage.tsx src/pages/StagePage.test.tsx src/index.css
committer -y
```

---

### Task 6: Households frame

**Files:**
- Modify: `src/components/stage/scenes/HouseholdsFrame.tsx`
- Modify: `src/pages/StagePage.test.tsx`

- [ ] **Step 1: Write assertions against the real library cut**

```tsx
it('renders the reduced household library', async () => {
  const user = userEvent.setup()
  renderStage()
  await user.click(screen.getByRole('button', { name: 'Households' }))
  expect(screen.getByText('At Risk')).toBeInTheDocument()
  expect(screen.getByText('Chen Family')).toBeInTheDocument()
  expect(screen.getByText('Rivera Household')).toBeInTheDocument()
  expect(screen.queryByText('Upload CSV')).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /rebalance households/i })).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run to verify fail** if the minimal frame lacks rows.

- [ ] **Step 3: Implement HouseholdsFrame**

Render `stageBook.strip` (At Risk count, household count, total AUM) and five rows: name, Target vs Current EQ/FI/Cash as text (e.g. `EQ 80% / 31%`), AUM, drift %, `At Risk`. No action buttons. Use IBM Plex Mono on numbers (`font-family: 'IBM Plex Mono', monospace`). Quiet borders, no glow.

Formatters in this file:

```ts
const money = (value: number) =>
  value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, '')}M` : `$${Math.round(value / 1000)}k`
const pct = (value: number) => `${(value * 100).toFixed(1).replace(/\.0$/, '')}%`
```

- [ ] **Step 4: Tests pass**

Run: `npx vitest run src/pages/StagePage.test.tsx`

- [ ] **Step 5: Commit** (`HouseholdsFrame.tsx`, tests, any CSS)

---

### Task 7: Rebalance frame

**Files:**
- Modify: `src/components/stage/scenes/RebalanceFrame.tsx`
- Modify: `src/pages/StagePage.test.tsx`

- [ ] **Step 1: Test**

```tsx
it('renders the reduced rebalance workspace', async () => {
  const user = userEvent.setup()
  renderStage()
  await user.click(screen.getByRole('button', { name: 'Rebalance' }))
  expect(screen.getByText('RRSP')).toBeInTheDocument()
  expect(screen.getByText('CAD TAXABLE')).toBeInTheDocument()
  expect(screen.getByText('ZCS')).toBeInTheDocument()
  expect(screen.getAllByText('SELL').length).toBeGreaterThan(0)
  expect(screen.getAllByText('BUY').length).toBeGreaterThan(0)
  expect(screen.queryByText('Review & validate')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Fail, then implement**

Show current → target for Equity / FI / Cash, trade impact, then two account groups with ticker, BUY/SELL, qty, trade value, capital gain. No 15-column sheet, no Review toolbar.

- [ ] **Step 3: Tests pass, commit**

---

### Task 8: Analytics frame

**Files:**
- Modify: `src/components/stage/scenes/AnalyticsFrame.tsx`
- Modify: `src/pages/StagePage.test.tsx`

- [ ] **Step 1: Test**

```tsx
it('renders the reduced household overview', async () => {
  const user = userEvent.setup()
  renderStage()
  await user.click(screen.getByRole('button', { name: 'Analytics' }))
  expect(screen.getByText('Chen Family')).toBeInTheDocument()
  expect(screen.getByText(/sector allocation drift/i)).toBeInTheDocument()
  expect(screen.getByText(/currency exposure/i)).toBeInTheDocument()
  expect(screen.getByText('CAD')).toBeInTheDocument()
  expect(screen.getByText('USD')).toBeInTheDocument()
  expect(screen.queryByText('Whole Book')).not.toBeInTheDocument()
  expect(screen.queryByText('Add note')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Implement**

Summary strip: total, equity, FI, cash, off-model, model drift. Two panels: sector allocation drift (four sectors with current/model/drift), currency exposure CAD/USD. No scope toggle, no model editors.

- [ ] **Step 3: Tests pass, commit**

---

### Task 9: Access overlay

**Files:**
- Create: `src/components/stage/AccessOverlay.tsx`
- Modify: `src/pages/StagePage.tsx`
- Modify: `src/pages/StagePage.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
it('validates the access form in the overlay without leaving the page', async () => {
  const user = userEvent.setup()
  renderStage()
  await user.click(screen.getByRole('button', { name: 'Households' }))
  await user.click(screen.getByRole('button', { name: 'Request access' }))
  expect(screen.getByRole('dialog', { name: 'Request access' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Send request' }))
  expect(screen.getByText('Enter your name.')).toBeInTheDocument()
  expect(screen.getByText(STAGE_CAPTIONS.households)).toBeInTheDocument()
})

it('shows confirmation on success and keeps the scene', async () => {
  const user = userEvent.setup()
  vi.spyOn(window, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
  renderStage()
  await user.click(screen.getByRole('button', { name: 'Request access' }))
  await user.type(screen.getByLabelText(/^name/i), 'Nolan Patel')
  await user.type(screen.getByLabelText(/email/i), 'nolan@example.com')
  await user.type(screen.getByLabelText(/^firm/i), 'Northstar Advisory')
  await user.click(screen.getByRole('button', { name: 'Send request' }))
  expect(await screen.findByText(/request received/i)).toBeInTheDocument()
})

it('keeps the form and shows a retryable error when submit fails', async () => {
  const user = userEvent.setup()
  vi.spyOn(window, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
  renderStage()
  await user.click(screen.getByRole('button', { name: 'Request access' }))
  await user.type(screen.getByLabelText(/^name/i), 'Nolan Patel')
  await user.type(screen.getByLabelText(/email/i), 'nolan@example.com')
  await user.type(screen.getByLabelText(/^firm/i), 'Northstar Advisory')
  await user.click(screen.getByRole('button', { name: 'Send request' }))
  expect(await screen.findByText('Could not send your request. Try again.')).toBeInTheDocument()
  expect(screen.getByLabelText(/^name/i)).toBeInTheDocument()
})
```

Add `vi` import and `afterEach(() => vi.restoreAllMocks())`.

- [ ] **Step 2: Fail, then implement AccessOverlay**

Dialog: `role="dialog"` `aria-modal="true"` `aria-labelledby`. Fields name, firm, email with `aria-invalid` and `aria-describedby` on errors. Submit calls `validateRequestAccess`; if empty errors, `dispatch({ type: 'submit-access' })` then `submitRequestAccess`; success/error actions. Sending state: button disabled, text `Sending`. Success: replace fields with “Request received.” plus a Close button. Backdrop click and Escape close via `close-access` (Escape already on StagePage). No toasts. No role field.

`StagePage` renders overlay when `state.access !== 'closed'`.

- [ ] **Step 3: Tests pass, commit**

---

### Task 10: Aether canvas

**Files:**
- Create: `src/components/stage/AetherCanvas.tsx`
- Modify: `src/pages/StagePage.tsx`
- Modify: `src/pages/StagePage.test.tsx`
- Possibly: `package.json` after `21st add`

- [ ] **Step 1: Tests for fallback and a11y (not particle beauty)**

```tsx
it('keeps the aether field decorative and still works when canvas context is missing', () => {
  renderStage()
  const field = document.querySelector('[data-aether-field]')
  expect(field).toHaveAttribute('aria-hidden', 'true')
})
```

`src/test/setup.ts` already stubs `getContext` to `null`, so the still-field fallback is what tests run.

- [ ] **Step 2: Install the 21st field, then wrap it**

Run: `21st add dhileepkumargm/aether-flow-hero`

Expected: component lands under `src/components/ui/`. Do not keep its demo headline or CTA. Move/adapt the particle implementation into `AetherCanvas.tsx`. Delete the 21st demo file if it appears (`src/components/ui/demo.tsx`).

`AetherCanvas` props:

```ts
type Props = {
  dimmed: boolean
  reducedMotion: boolean
  onEmptyPointerDown: () => void
}
```

Behavior:

- Full-viewport, `position: absolute; inset: 0; z-index: 0`
- `aria-hidden="true"` `data-aether-field`
- `pointer-events: auto` so empty-field click can close a scene (`onEmptyPointerDown` → `close-scene` when `scene !== 'none'`). Nodes and chrome sit above and must not trigger this.
- `dimmed` when a scene is open: wrap with `opacity: 0.45` (CSS), do not pause the simulation unless `reducedMotion`
- `reducedMotion` or failed `getContext`: render a still dark gradient field, no rAF loop
- Cursor reaction only when motion is allowed and context exists

If the 21st component includes a hero headline, do not render it.

- [ ] **Step 3: Wire into StagePage behind chrome**

`onEmptyPointerDown` → `dispatch({ type: 'close-scene' })`. `dimmed={state.scene !== 'none'}`.

- [ ] **Step 4: Tests pass**

Run: `npx vitest run src/pages/StagePage.test.tsx`

- [ ] **Step 5: Commit** including any new 21st dependency in `package.json` / lockfile, `AetherCanvas.tsx`, and removal of unused 21st demo files.

---

### Task 11: Motion and reduced motion

**Files:**
- Modify: `src/pages/StagePage.tsx` / `ProductFrame.tsx` / `StageNodes.tsx` / `AetherCanvas.tsx`
- Modify: `src/pages/StagePage.test.tsx`
- Modify: `src/test/setup.ts` if `matchMedia` must honor `prefers-reduced-motion`

- [ ] **Step 1: Test reduced-motion usability**

```tsx
it('still opens scenes when reduced motion is forced', async () => {
  const user = userEvent.setup()
  window.history.pushState({}, '', '/?motion=reduce')
  render(
    <MemoryRouter initialEntries={['/?motion=reduce']}>
      <StagePage />
    </MemoryRouter>,
  )
  await user.click(screen.getByRole('button', { name: 'Households' }))
  expect(screen.getByText(STAGE_CAPTIONS.households)).toBeInTheDocument()
})
```

Inside `StagePage`, `reducedMotion` is true when `useReducedMotion()` from `motion/react` is true or `useLocation().search` contains `motion=reduce`. Pass that boolean to `AetherCanvas` and to `MotionConfig` wrapping the stage.

- [ ] **Step 2: Implement motion**

Use `motion` layout:

- Open: hide the active node label. Animate `ProductFrame` with `initial={{ opacity: 0, scale: 0.92 }}` `animate={{ opacity: 1, scale: 1 }}` using `transformOrigin` from the clicked node’s viewport position (measure the node with `getBoundingClientRect` on click and store `originX` / `originY` on stage local state). This is the “node becomes the scene” motion without sharing `layoutId` across trees.
- Swap: `AnimatePresence mode="wait"` so the current frame exits (scale toward its node) before the next enters. Never show two frames stacked.
- Close: reverse of open.
- Form overlay: `opacity` only, 180ms. Aether stays.
- `reducedMotion`: `MotionConfig reducedMotion="always"` already in App when `motion=reduce`; also pass `reducedMotion` to `AetherCanvas` to freeze particles. Instant cuts: `transition={{ duration: 0 }}`.

- [ ] **Step 3: Tests pass, commit**

---

### Task 12: 404, meta, delete old landing

**Files:**
- Modify: `src/pages/NotFoundPage.tsx`
- Modify: `src/index.html`
- Modify: `src/App.test.tsx`
- Delete: files listed in the file map

- [ ] **Step 1: Update 404 copy and test**

NotFound heading: `This page is not the stage.` (or `Page not found.`) Link: `Return home` → `/`. Do not mention “needs you next” or Platform.

`index.html` title: `Laminar Apex`. Description: same as `usePageMeta` on StagePage.

- [ ] **Step 2: Delete disposable landing files**

Delete every file in the Delete list. Grep for `LandingPage`, `RequestAccessPage`, `landingContent`, `SiteHeader`, `ProductVisuals`, `LaminarApexHero`, `BrandMark`, `content.ts`. Fix remaining imports. `src/types/content.ts` goes away; request-access types live in `src/lib/requestAccess.ts` only.

- [ ] **Step 3: Full test run**

Run: `npx vitest run`

Expected: PASS. No tests for old hero, request-access route, or Platform nav.

Run: `npx tsc -b --pretty false`

Expected: no type errors.

- [ ] **Step 4: Commit the deletion + 404 + html meta**

---

### Task 13: Visual QA against the spec

Not a screenshot assertion of particles.

- [ ] **Step 1: Run the app**

Run: `npm run dev`

Check desktop:

- Empty Aether, three nodes, wordmark, Request access only
- Click Households → library strip + rows, caption, other nodes quieter
- Swap to Rebalance and Analytics
- Click frame / empty field / Escape closes
- Request access overlay; invalid / success (mock) / failed submit
- Reduced motion: `/?motion=reduce`

Check mobile (~390px):

- Nodes low on the field, thumb-sized
- Frame scrolls inside the stage, page itself does not
- Form full width

- [ ] **Step 2: Fix any layout bugs that violate the spec** (nodes crowding the center on mobile, header remnants, glow on product frames). Re-run `npx vitest run`.

- [ ] **Step 3: Commit polish if needed**

---

## Self-review

**Spec coverage**

| Spec requirement | Task |
| --- | --- |
| One page, `/` is the stage | 4, 12 |
| Aether Flow Hero field, always on, dim when scene open | 10, 11 |
| Canvas fallback / aria-hidden | 10 |
| Wordmark not a link; Request access control | 4 |
| Three nodes in the field | 4 |
| Empty first load | 4 |
| Node becomes the scene; swap; collapse | 5, 11 |
| Captions with scenes only | 5 |
| Households / Rebalance / Analytics reduced frames + shared book | 3, 6–8 |
| Frames not live controls | 6–8 |
| Request access overlay, 3 fields, success/error | 2, 9 |
| Escape closes access then scene | 1, 5, 9 |
| Keyboard nodes | 4 (buttons) |
| Reduced motion | 11 |
| Mobile node row, frame scroll | 4 CSS, 13 |
| No `/request-access`, delete old landing | 4, 12 |
| Tests listed in spec | 4, 5, 9, 11 |

**Type names (locked):** `SceneId`, `AccessStatus`, `StageState`, `StageAction`, `reduceStage`, `initialStageState`, `RequestAccessForm`, `validateRequestAccess`, `submitRequestAccess`, `REQUEST_ACCESS_ERROR`, `stageBook`, `STAGE_CAPTIONS`.
