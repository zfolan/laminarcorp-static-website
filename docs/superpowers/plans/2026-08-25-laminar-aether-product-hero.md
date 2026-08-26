# Laminar Aether Product Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static Laminar Apex landing hero with an accessible four-stage product overview driven by the real Aether network and one restrained spotlight detail card.

**Architecture:** `LaminarApexHero` owns local pinned/preview stage state and the canvas lifecycle. Static stage content remains in the existing typed `landingContent` module, while a focused `GlowCard` UI primitive handles only card-local pointer spotlight coordinates. `LandingPage` supplies the existing reduced-motion decision and keeps every section below the hero unchanged.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v4, existing CSS tokens, Motion reduced-motion state, Lucide React, Vitest, Testing Library.

---

## File map

- Create `src/components/LaminarApexHero.tsx` — production hero layout, stage interactions, and Aether canvas lifecycle.
- Create `src/components/LaminarApexHero.test.tsx` — reduced-motion canvas behavior and canvas-unavailable fallback.
- Create `src/components/ui/spotlight-card.tsx` — single local-coordinate spotlight surface.
- Create `src/components/ui/spotlight-card.test.tsx` — local pointer-coordinate contract.
- Modify `src/types/content.ts` — typed four-stage hero content contract.
- Modify `src/data/landingContent.ts` — approved workflow wording and evidence labels.
- Modify `src/pages/LandingPage.tsx` — replace the static hero workspace and delete obsolete hero-scroll calculations.
- Modify `src/components/ProductVisuals.tsx` — remove `HeroWorkspace` and the now-unused compact workspace branch.
- Modify `src/App.tsx` — remove the temporary `/aether-flow` route.
- Modify `src/App.test.tsx` — replace the demo-route check with observable production-hero interactions.
- Modify `src/index.css` — floating header treatment, production hero, spotlight, workflow controls, responsive behavior, and obsolete hero-style deletion.
- Delete `src/components/ui/aether-flow-hero.tsx` — obsolete generic demo implementation.
- Delete `src/components/ui/demo.tsx` — obsolete demo wrapper.
- Modify `package.json` and `package-lock.json` through `npm uninstall framer-motion` — remove the demo-only dependency; the application continues using the existing `motion` package.

Execution must preserve unrelated staged/user changes. Before each commit, confirm the execution worktree contains only the task’s intended changes. Use the repository-required `committer` command rather than a manual `git commit`.

---

### Task 1: Add the clean spotlight card

**Files:**
- Create: `src/components/ui/spotlight-card.test.tsx`
- Create: `src/components/ui/spotlight-card.tsx`

- [ ] **Step 1: Write the failing local-coordinate test**

Create `src/components/ui/spotlight-card.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GlowCard } from './spotlight-card'

describe('GlowCard', () => {
  it('tracks the pointer in card-local coordinates and resets on leave', () => {
    render(<GlowCard><span>Decision detail</span></GlowCard>)
    const card = screen.getByText('Decision detail').parentElement
    expect(card).not.toBeNull()

    vi.spyOn(card!, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: 40,
      left: 100,
      top: 40,
      right: 500,
      bottom: 240,
      width: 400,
      height: 200,
      toJSON: () => ({}),
    })

    fireEvent.pointerMove(card!, { clientX: 180, clientY: 95 })
    expect(card!.style.getPropertyValue('--spotlight-x')).toBe('80px')
    expect(card!.style.getPropertyValue('--spotlight-y')).toBe('55px')

    fireEvent.pointerLeave(card!)
    expect(card!.style.getPropertyValue('--spotlight-x')).toBe('50%')
    expect(card!.style.getPropertyValue('--spotlight-y')).toBe('50%')
  })
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npm test -- src/components/ui/spotlight-card.test.tsx
```

Expected: FAIL because `./spotlight-card` does not exist.

- [ ] **Step 3: Implement the minimum spotlight primitive**

Create `src/components/ui/spotlight-card.tsx`:

```tsx
import type { CSSProperties, PointerEvent, ReactNode } from 'react'

type SpotlightStyle = CSSProperties & {
  '--spotlight-x': string
  '--spotlight-y': string
}

type GlowCardProps = {
  children: ReactNode
  className?: string
}

const centeredSpotlight: SpotlightStyle = {
  '--spotlight-x': '50%',
  '--spotlight-y': '50%',
}

export const GlowCard = ({ children, className = '' }: GlowCardProps) => {
  const updateSpotlight = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`)
  }

  const resetSpotlight = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--spotlight-x', '50%')
    event.currentTarget.style.setProperty('--spotlight-y', '50%')
  }

  return (
    <div
      className={`spotlight-card ${className}`}
      style={centeredSpotlight}
      onPointerMove={updateSpotlight}
      onPointerLeave={resetSpotlight}
    >
      {children}
    </div>
  )
}
```

Do not copy the supplied global `document.pointermove` listener, hue map, size map, per-instance `<style>`, or nested glow element. One card-local gradient is the entire required contract.

- [ ] **Step 4: Run the spotlight test and verify GREEN**

Run:

```bash
npm test -- src/components/ui/spotlight-card.test.tsx
```

Expected: 1 test passes with no warnings.

- [ ] **Step 5: Commit the isolated task**

After confirming no unrelated changes are present in the execution worktree, run:

```bash
committer -a -y -b -o
```

Expected commit intent: `feat(ui): add local spotlight card`.

---

### Task 2: Build the typed interactive product hero

**Files:**
- Create: `src/components/LaminarApexHero.test.tsx`
- Create: `src/components/LaminarApexHero.tsx`
- Modify: `src/App.test.tsx:11-47`
- Modify: `src/test/setup.ts:23`
- Modify: `src/types/content.ts:19-49`
- Modify: `src/data/landingContent.ts:9-14`
- Modify: `src/pages/LandingPage.tsx:1-69`

- [ ] **Step 1: Replace the demo assertion with a failing production interaction test**

Delete the `/aether-flow` test from `src/App.test.tsx` and insert this test after the landing-page anchor test:

```tsx
  it('previews and pins the four-stage advisor workflow', async () => {
    const user = userEvent.setup()
    renderAt('/')

    const priority = screen.getByRole('tab', { name: /priority queue/i })
    const coverage = screen.getByRole('tab', { name: /book coverage/i })
    const decision = screen.getByRole('tab', { name: /decision review/i })
    const action = screen.getByRole('tab', { name: /client action/i })

    expect(screen.getAllByRole('tab')).toHaveLength(4)
    expect(priority).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: 'Find the households that need attention.' })).toBeInTheDocument()

    await user.hover(decision)
    expect(screen.getByRole('heading', { name: 'Review the recommendation in context.' })).toBeInTheDocument()
    await user.unhover(decision)
    expect(screen.getByRole('heading', { name: 'Find the households that need attention.' })).toBeInTheDocument()

    await user.click(action)
    expect(action).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: 'Carry the reviewed decision forward.' })).toBeInTheDocument()

    coverage.focus()
    expect(screen.getByRole('heading', { name: 'Know which client book is active.' })).toBeInTheDocument()
    coverage.blur()
    expect(screen.getByRole('heading', { name: 'Carry the reviewed decision forward.' })).toBeInTheDocument()
  })
```

Create `src/components/LaminarApexHero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LaminarApexHero } from './LaminarApexHero'

const canvasContext = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
}

afterEach(() => vi.restoreAllMocks())

describe('LaminarApexHero canvas', () => {
  it('draws one static field without scheduling animation for reduced motion', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(canvasContext as unknown as CanvasRenderingContext2D)
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame')

    render(<MemoryRouter><LaminarApexHero reducedMotion /></MemoryRouter>)

    expect(canvasContext.arc).toHaveBeenCalled()
    expect(requestFrame).not.toHaveBeenCalled()
  })

  it('keeps the complete workflow available when canvas is unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    render(<MemoryRouter><LaminarApexHero reducedMotion={false} /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Know what needs you next.' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(4)
  })
})
```

Make the existing canvas mock spy-compatible in `src/test/setup.ts`:

```ts
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  writable: true,
  value: vi.fn(() => null),
})
```

- [ ] **Step 2: Run both tests and verify RED**

Run:

```bash
npm test -- src/App.test.tsx src/components/LaminarApexHero.test.tsx
```

Expected: FAIL because `LaminarApexHero` and the four stage controls do not exist.

- [ ] **Step 3: Add the typed stage contract and approved content**

Insert before `LandingContent` in `src/types/content.ts`:

```ts
export type HeroStageId = 'coverage' | 'priority' | 'decision' | 'action'

export type HeroStage = {
  id: HeroStageId
  label: string
  action: string
  title: string
  description: string
  evidence: [string, string, string]
}
```

Extend `LandingContent['hero']` to:

```ts
  hero: {
    eyebrow: string
    title: string
    description: string
    stages: HeroStage[]
  }
```

Replace the `hero` object in `src/data/landingContent.ts` with:

```ts
  hero: {
    eyebrow: 'ADVISOR OPERATING WORKSPACE',
    title: 'Know what needs you next.',
    description: 'From holdings coverage to a prioritized household, a reviewable recommendation, and client-ready action—Apex keeps the decision context attached.',
    stages: [
      {
        id: 'coverage',
        label: '01 / BOOK COVERAGE',
        action: 'Confirm the data',
        title: 'Know which client book is active.',
        description: 'Apex anchors downstream work to one selected advisor book with clear holdings coverage, version, account, and source context.',
        evidence: ['AUM + COVERAGE', 'VERSIONED HOLDINGS', 'ACTIVE BOOK BOUNDARY'],
      },
      {
        id: 'priority',
        label: '02 / PRIORITY QUEUE',
        action: 'Find what needs review',
        title: 'Find the households that need attention.',
        description: 'A ranked work queue turns book-level holdings into clear review priorities using model drift, household status, and material impact.',
        evidence: ['DRIFT-RANKED', 'AT RISK / REVIEW / ON TARGET', 'HOUSEHOLD CONTEXT'],
      },
      {
        id: 'decision',
        label: '03 / DECISION REVIEW',
        action: 'Resolve the recommendation',
        title: 'Review the recommendation in context.',
        description: 'Compare allocation, models, cash, tax impact, proposed trades, and diagnostics before professional judgment moves the work forward.',
        evidence: ['CURRENT VS TARGET', 'TRADE + CASH REVIEW', 'ADVISOR CONTROL'],
      },
      {
        id: 'action',
        label: '04 / CLIENT ACTION',
        action: 'Carry the work forward',
        title: 'Carry the reviewed decision forward.',
        description: 'Turn the validated recommendation into a client proposal, custodian-ready orders, or a staged deployment plan without losing rationale or history.',
        evidence: ['CLIENT PROPOSAL', 'ORDER EXPORT', 'STAGED DEPLOYMENT'],
      },
    ],
  },
```

- [ ] **Step 4: Implement the complete hero and Aether field**

Create `src/components/LaminarApexHero.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { landingContent } from '../data/landingContent'
import type { HeroStageId } from '../types/content'
import { GlowCard } from './ui/spotlight-card'

type LaminarApexHeroProps = {
  reducedMotion: boolean
}

type Particle = {
  x: number
  y: number
  directionX: number
  directionY: number
  size: number
}

const defaultStage: HeroStageId = 'priority'

export const LaminarApexHero = ({ reducedMotion }: LaminarApexHeroProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeStage, setActiveStage] = useState<HeroStageId>(defaultStage)
  const [previewStage, setPreviewStage] = useState<HeroStageId | null>(null)
  const displayedStage = landingContent.hero.stages.find((stage) => stage.id === (previewStage ?? activeStage))!

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let animationFrame: number | undefined
    let particles: Particle[] = []
    const pointer: { x: number | null; y: number | null } = { x: null, y: null }

    const initialize = () => {
      canvas.width = canvas.clientWidth || window.innerWidth
      canvas.height = canvas.clientHeight || window.innerHeight
      const count = Math.min(105, Math.max(42, Math.floor((canvas.width * canvas.height) / 14500)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: canvas.height * (0.42 + Math.random() * 0.56),
        directionX: Math.random() * 0.16 - 0.08,
        directionY: Math.random() * 0.12 - 0.06,
        size: Math.random() * 1.5 + 0.7,
      }))
    }

    const draw = (advance: boolean) => {
      context.clearRect(0, 0, canvas.width, canvas.height)

      for (let first = 0; first < particles.length; first += 1) {
        const particle = particles[first]
        if (advance) {
          particle.x += particle.directionX
          particle.y += particle.directionY
          if (particle.x < 0 || particle.x > canvas.width) particle.directionX *= -1
          if (particle.y < canvas.height * 0.38 || particle.y > canvas.height) particle.directionY *= -1
        }

        for (let second = first + 1; second < particles.length; second += 1) {
          const peer = particles[second]
          const distance = Math.hypot(particle.x - peer.x, particle.y - peer.y)
          if (distance >= 118) continue

          const nearPointer = pointer.x !== null
            && pointer.y !== null
            && Math.hypot(particle.x - pointer.x, particle.y - pointer.y) < 150
          const opacity = (1 - distance / 118) * (nearPointer ? 0.62 : 0.32)
          context.strokeStyle = nearPointer
            ? `rgba(168, 197, 226, ${opacity})`
            : `rgba(91, 141, 180, ${opacity})`
          context.lineWidth = nearPointer ? 1 : 0.7
          context.beginPath()
          context.moveTo(particle.x, particle.y)
          context.lineTo(peer.x, peer.y)
          context.stroke()
        }

        context.fillStyle = 'rgba(131, 169, 204, 0.75)'
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
      }
    }

    const animate = () => {
      draw(true)
      animationFrame = window.requestAnimationFrame(animate)
    }

    const resize = () => {
      initialize()
      draw(false)
    }

    const movePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
    }

    const clearPointer = () => {
      pointer.x = null
      pointer.y = null
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    canvas.addEventListener('pointermove', movePointer)
    canvas.addEventListener('pointerleave', clearPointer)
    resize()

    if (!reducedMotion) animationFrame = window.requestAnimationFrame(animate)

    return () => {
      resizeObserver.disconnect()
      canvas.removeEventListener('pointermove', movePointer)
      canvas.removeEventListener('pointerleave', clearPointer)
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame)
    }
  }, [reducedMotion])

  return (
    <section className="apex-hero" aria-labelledby="hero-title">
      <canvas ref={canvasRef} className="apex-hero__field" aria-hidden="true" />
      <div className="apex-hero__veil" aria-hidden="true" />

      <div className="apex-hero__copy">
        <p className="eyebrow">{landingContent.hero.eyebrow}</p>
        <h1 id="hero-title">{landingContent.hero.title}</h1>
        <p>{landingContent.hero.description}</p>
        <div className="apex-hero__actions">
          <Link className="button" to="/request-access">Request access <ArrowRight size={16} /></Link>
          <a className="text-link" href="#hero-workflow">Explore the workflow <ArrowDown size={15} /></a>
        </div>
      </div>

      <div className="apex-hero__workflow" id="hero-workflow">
        <GlowCard className="apex-hero__detail">
          <div className="apex-hero__detail-topline">
            <span>{displayedStage.label}</span>
            <span>PRODUCT OVERVIEW</span>
          </div>
          <h2>{displayedStage.title}</h2>
          <p>{displayedStage.description}</p>
          <div className="apex-hero__evidence">
            {displayedStage.evidence.map((item) => <span key={item}>{item}</span>)}
          </div>
        </GlowCard>

        <div className="apex-hero__stage-line" aria-hidden="true" />
        <div className="apex-hero__stages" role="tablist" aria-label="Advisor workflow stages">
          {landingContent.hero.stages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              role="tab"
              aria-selected={stage.id === activeStage}
              className={`apex-hero__stage ${stage.id === activeStage ? 'is-active' : ''}`}
              onMouseEnter={() => setPreviewStage(stage.id)}
              onMouseLeave={() => setPreviewStage(null)}
              onFocus={() => setPreviewStage(stage.id)}
              onBlur={() => setPreviewStage(null)}
              onClick={() => {
                setActiveStage(stage.id)
                setPreviewStage(null)
              }}
            >
              <span>{stage.label}</span>
              <strong>{stage.action}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Replace only the landing hero**

In `src/pages/LandingPage.tsx`:

1. Replace the Lucide import with:

```ts
import { ArrowUpRight, ClipboardCheck, History, ShieldCheck } from 'lucide-react'
```

2. Keep `motion`, `useMotionValueEvent`, `useReducedMotion`, `useScroll`, and `useTransform`; remove only hero-specific motion calculations.
3. Replace the `ProductVisuals` import with:

```ts
import { ApexDecisionWorkspace, ContextFlow, OutputFlow } from '../components/ProductVisuals'
import { LaminarApexHero } from '../components/LaminarApexHero'
```

4. Delete `heroRef`, `heroProgress`, `heroCopyY`, `workspaceY`, and `workspaceOpacity`.
5. Replace the complete hero section currently spanning `LandingPage.tsx:52-65` with:

```tsx
      <LaminarApexHero reducedMotion={reduceMotion} />
```

Keep `contextRef`, `decisionRef`, `outputRef`, their transforms, and all sections beginning with `#platform` unchanged.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run:

```bash
npm test -- src/components/ui/spotlight-card.test.tsx src/components/LaminarApexHero.test.tsx src/App.test.tsx
```

Expected: all focused tests pass. The existing Motion reduced-motion test may print its current informational warning; no new warning or error is acceptable.

- [ ] **Step 7: Commit the isolated task**

After confirming no unrelated changes are present in the execution worktree, run:

```bash
committer -a -y -b
```

Expected commit intent: `feat(landing): add interactive Aether product hero`.

---

### Task 3: Apply the approved Laminar/Nexacore visual treatment

**Files:**
- Modify: `src/index.css:45-55`
- Modify: `src/index.css:68-109`
- Modify: `src/index.css:304-337`

- [ ] **Step 1: Restyle the existing header as a compact floating surface**

Replace the `.site-header` and `.site-header__inner` rules with:

```css
.site-header { position: sticky; z-index: 50; top: 0; height: 72px; padding-top: 10px; background: var(--canvas); }
.site-header__inner { width: min(920px, calc(100vw - 48px)); height: 52px; padding: 0 8px 0 16px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(51, 64, 77, .82); border-radius: 8px; background: rgba(12, 17, 24, .9); box-shadow: 0 16px 42px rgba(0, 0, 0, .28); backdrop-filter: blur(18px); }
```

Do not change `SiteHeader.tsx`; the existing semantic header, navigation, mobile toggle, and links remain authoritative.

- [ ] **Step 2: Replace the obsolete hero CSS with the production hero and spotlight rules**

Delete `.hero` through `.hero-workspace`, plus the hero-only selectors from `.hero-queue` through `.hero-table__row b`. The existing combined heading rule includes two live decision-workspace selectors, so preserve those as the first rule below. Insert this complete block after `.data-label--blue`:

```css
.decision-queue h3, .review-panel h3 { margin: 5px 0 0; font-size: 20px; font-weight: 500; letter-spacing: -.025em; }
.apex-hero { position: relative; min-height: 920px; overflow: clip; border-bottom: 1px solid var(--border-quiet); background: radial-gradient(circle at 50% 72%, rgba(50, 83, 119, .11), transparent 35%), var(--canvas); }
.apex-hero__field { position: absolute; z-index: 1; inset: 0; width: 100%; height: 100%; }
.apex-hero__veil { position: absolute; z-index: 2; inset: 0; background: linear-gradient(180deg, rgba(7, 9, 13, .98) 0, rgba(7, 9, 13, .76) 31%, rgba(7, 9, 13, .08) 58%, rgba(7, 9, 13, .72) 100%); pointer-events: none; }
.apex-hero__copy { position: relative; z-index: 4; width: min(800px, calc(100% - 48px)); margin: 0 auto; padding-top: clamp(78px, 9vw, 112px); text-align: center; }
.apex-hero__copy .eyebrow { display: inline-flex; align-items: center; gap: 9px; }
.apex-hero__copy .eyebrow::before { width: 5px; height: 5px; border-radius: 50%; background: var(--blue-bright); box-shadow: 0 0 0 5px rgba(131, 169, 204, .08); content: ''; }
.apex-hero h1 { margin: 18px 0 16px; font-size: clamp(58px, 6.8vw, 92px); font-weight: 500; line-height: .91; letter-spacing: -.06em; text-wrap: balance; }
.apex-hero__copy > p:not(.eyebrow) { max-width: 660px; margin: 0 auto; color: var(--pewter); font-size: 16px; line-height: 1.58; }
.apex-hero__actions { margin-top: 26px; display: flex; align-items: center; justify-content: center; gap: 20px; }
.apex-hero__workflow { position: absolute; z-index: 5; right: 5%; bottom: 30px; left: 5%; min-height: 310px; scroll-margin-top: 82px; }
.spotlight-card { --spotlight-x: 50%; --spotlight-y: 50%; position: relative; overflow: hidden; border: 1px solid var(--border); border-radius: 7px; background: radial-gradient(220px at var(--spotlight-x) var(--spotlight-y), rgba(91, 141, 239, .12), transparent 72%), rgba(10, 16, 23, .94); box-shadow: 0 22px 60px rgba(0, 0, 0, .38); backdrop-filter: blur(14px); }
.spotlight-card::before { position: absolute; inset: -1px; padding: 1px; border-radius: inherit; background: radial-gradient(180px at var(--spotlight-x) var(--spotlight-y), rgba(168, 197, 226, .9), transparent 72%); content: ''; pointer-events: none; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; }
.apex-hero__detail { position: absolute; left: 50%; bottom: 96px; width: min(560px, calc(100% - 32px)); min-height: 128px; padding: 17px 19px; transform: translateX(-50%); }
.apex-hero__detail-topline { display: flex; align-items: center; justify-content: space-between; color: var(--blue-bright); font: 500 8px/1 'IBM Plex Mono', monospace; letter-spacing: .12em; }
.apex-hero__detail-topline span:last-child { color: var(--muted); }
.apex-hero__detail h2 { margin: 13px 0 7px; font-size: 22px; font-weight: 500; letter-spacing: -.025em; }
.apex-hero__detail > p { margin: 0; color: var(--pewter); font-size: 12px; line-height: 1.55; }
.apex-hero__evidence { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 13px; }
.apex-hero__evidence span { padding: 5px 7px; border: 1px solid var(--border); border-radius: 3px; color: #82909d; font: 500 7px/1 'IBM Plex Mono', monospace; letter-spacing: .05em; }
.apex-hero__evidence span:first-child { color: var(--blue-bright); border-color: #3a536f; background: rgba(37, 61, 85, .22); }
.apex-hero__stage-line { position: absolute; right: 5%; bottom: 39px; left: 5%; height: 1px; background: linear-gradient(90deg, var(--border-quiet), #3b5168 48%, var(--border-quiet)); }
.apex-hero__stages { position: absolute; right: 0; bottom: 8px; left: 0; display: grid; grid-template-columns: repeat(4, 1fr); }
.apex-hero__stage { position: relative; min-height: 64px; padding: 20px 8px 0; border: 0; color: #66727f; background: transparent; cursor: pointer; text-align: center; transition: color 180ms ease; }
.apex-hero__stage::before { position: absolute; top: -2px; left: 50%; width: 8px; height: 8px; border: 1px solid #536475; border-radius: 50%; background: #0a0e14; content: ''; transform: translateX(-50%); transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease, scale 180ms ease; }
.apex-hero__stage:hover, .apex-hero__stage:focus-visible, .apex-hero__stage.is-active { color: var(--platinum); }
.apex-hero__stage:hover::before, .apex-hero__stage:focus-visible::before { border-color: var(--blue-bright); scale: 1.3; }
.apex-hero__stage.is-active::before { border-color: #a8c5e2; background: var(--blue-bright); box-shadow: 0 0 0 7px rgba(131, 169, 204, .1), 0 0 18px rgba(131, 169, 204, .45); }
.apex-hero__stage span { display: block; font: 500 8px/1 'IBM Plex Mono', monospace; letter-spacing: .11em; }
.apex-hero__stage strong { display: block; margin-top: 8px; font-size: 11px; font-weight: 600; }
```

- [ ] **Step 3: Replace mobile hero rules**

Inside `@media (max-width: 760px)`, delete the old `.hero*`, `.hero-workspace*`, `.hero-queue*`, `.hero-summary*`, and `.hero-table*` rules. Add:

```css
  .site-header { height: 64px; padding-top: 8px; }
  .site-header__inner { width: calc(100vw - 20px); height: 48px; padding-left: 12px; }
  .apex-hero { min-height: 930px; }
  .apex-hero__copy { width: calc(100% - 32px); padding-top: 62px; }
  .apex-hero h1 { font-size: clamp(50px, 14vw, 62px); overflow-wrap: anywhere; }
  .apex-hero__copy > p:not(.eyebrow) { font-size: 14px; }
  .apex-hero__actions { align-items: stretch; flex-direction: column; gap: 8px; }
  .apex-hero__actions .button, .apex-hero__actions .text-link { justify-content: space-between; }
  .apex-hero__workflow { right: 12px; bottom: 16px; left: 12px; min-height: 420px; }
  .apex-hero__detail { bottom: 136px; width: 100%; min-height: 174px; }
  .apex-hero__detail-topline { font-size: 7px; }
  .apex-hero__detail h2 { font-size: 21px; }
  .apex-hero__stage-line { display: none; }
  .apex-hero__stages { grid-template-columns: repeat(2, 1fr); gap: 5px; bottom: 0; }
  .apex-hero__stage { min-height: 58px; padding: 11px 7px; border-left: 2px solid var(--border); background: rgba(8, 12, 17, .76); text-align: left; }
  .apex-hero__stage::before { display: none; }
  .apex-hero__stage.is-active { border-left-color: var(--blue-bright); background: rgba(17, 25, 35, .9); }
  .apex-hero__stage span { font-size: 7px; }
  .apex-hero__stage strong { margin-top: 6px; font-size: 10px; }
```

Keep the existing mobile navigation dropdown, chapter, decision, output, trust, company, footer, request-access, and not-found rules unchanged.

- [ ] **Step 4: Run static checks**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands exit 0 with no TypeScript or ESLint errors.

- [ ] **Step 5: Browser-verify desktop and mobile layout**

Launch `npm run dev` through the process manager and inspect `/` at:

- Desktop: `1440 × 900`
- Mobile: `390 × 844`

Verify:

- Floating header stays readable and does not cover the hero heading.
- One spotlight card is visible; no duplicate bloom or rainbow color appears.
- Four stage controls remain visible without horizontal scrolling.
- Evidence labels wrap inside the card.
- Body `scrollWidth` equals viewport width at both sizes.

- [ ] **Step 6: Commit the isolated visual task**

After confirming no unrelated changes are present in the execution worktree, run:

```bash
committer -a -y -b -o
```

Expected commit intent: `style(landing): polish Aether workflow hero`.

---

### Task 4: Remove the obsolete demo and hero workspace

**Files:**
- Modify: `src/App.tsx:1-47`
- Modify: `src/App.test.tsx:30-47`
- Modify: `src/components/ProductVisuals.tsx:16-27,123-143`
- Modify: `src/index.css`
- Delete: `src/components/ui/aether-flow-hero.tsx`
- Delete: `src/components/ui/demo.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Confirm symbol references before deletion**

Use the TypeScript language server’s References operation on:

- `HeroWorkspace` in `src/components/ProductVisuals.tsx`
- `AetherFlowHero` in `src/components/ui/aether-flow-hero.tsx`
- `DemoOne` in `src/components/ui/demo.tsx`

Expected after Task 2: `HeroWorkspace` has only its declaration; `AetherFlowHero` is referenced only by `demo.tsx`; `DemoOne` is referenced only by the temporary route.

- [ ] **Step 2: Remove the temporary route**

In `src/App.tsx`, delete:

```ts
import DemoOne from './components/ui/demo'
```

and:

```tsx
<Route path="/aether-flow" element={<DemoOne />} />
```

The existing wildcard route then handles `/aether-flow` like any removed path.

- [ ] **Step 3: Remove `HeroWorkspace` and compact workspace support**

Delete the entire `HeroWorkspace` export from `src/components/ProductVisuals.tsx`.

Replace `WorkspaceChrome` with:

```tsx
const WorkspaceChrome = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="workspace">
    <div className="workspace__bar">
      <div className="workspace__mark"><img src="/laminar-mark.svg" alt="" /></div>
      <div className="workspace__identity">
        <span>HOUSEHOLDS</span><i>/</i><strong>{title}</strong>
      </div>
      <span>APEX · DEMO WORKSPACE</span>
    </div>
    {children}
  </div>
)
```

Delete the complete `.workspace--compact` and `.workspace--compact .workspace__body` rules, plus the mobile `.workspace--compact .workspace__body` rule. No remaining JSX uses the compact class after `HeroWorkspace` is removed.

- [ ] **Step 4: Delete demo files and dependency**

Delete:

```text
src/components/ui/aether-flow-hero.tsx
src/components/ui/demo.tsx
```

Run:

```bash
npm uninstall framer-motion
```

Expected: `framer-motion` disappears from `package.json`; `motion` remains because `App`, `LandingPage`, and `ProductVisuals` still import `motion/react`.

- [ ] **Step 5: Run the full verification set**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected:

- 0 failed tests.
- 0 ESLint errors.
- Production build exits 0.
- The existing Motion reduced-motion informational message may remain; no new warning is introduced.

- [ ] **Step 6: Commit the isolated cleanup**

After confirming no unrelated changes are present in the execution worktree, run:

```bash
committer -a -y -b -o
```

Expected commit intent: `chore(landing): remove Aether demo path`.

---

### Task 5: Verify accessibility, motion, and final visual quality

**Files:**
- Modify only if verification finds a concrete defect.

- [ ] **Step 1: Run final automated checks from a clean process state**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all commands exit 0; Vitest reports no failures.

- [ ] **Step 2: Check TypeScript workspace diagnostics**

Run the language server Diagnostics operation for `*`.

Expected: no workspace diagnostics.

- [ ] **Step 3: Verify the production behavior in a real browser**

At desktop `1440 × 900`:

- Confirm Priority queue is selected on initial load.
- Hover Decision review and confirm the spotlight title previews `Review the recommendation in context.`.
- Move the pointer away and confirm Priority queue returns.
- Click Client action and confirm it remains pinned after hovering another stage.
- Move the pointer across the Aether field and confirm only nearby connections brighten.
- Move across the spotlight card and confirm the border glow tracks within the card rather than using viewport coordinates.

At mobile `390 × 844`:

- Tap all four stages.
- Confirm the card never overlaps the headline or stage controls.
- Confirm no horizontal scrolling.
- Confirm the request-access action remains reachable.

- [ ] **Step 4: Verify reduced motion and fallback**

Open `/?motion=reduce` and confirm:

- The Aether field is static.
- Stage preview and pinning still work.
- No entrance animation delays required content.

The `LaminarApexHero` unit test provides the canvas-unavailable proof; do not add a browser-only test hook.

- [ ] **Step 5: Run the project-aware UI review**

Run:

```bash
21st review src/components/LaminarApexHero.tsx src/components/ui/spotlight-card.tsx src/pages/LandingPage.tsx src/index.css
```

Apply only safe, deterministic findings. Hardcoded system-blue canvas RGBA values are acceptable because the Canvas 2D API cannot consume the stylesheet variables directly without runtime parsing; do not add a token-parsing abstraction for four fixed draw colors.

- [ ] **Step 6: Perform the required minimality review**

Confirm:

- No second hero state store or context provider exists.
- No new dependency was added.
- The spotlight has no unused colors, sizes, global listeners, or per-instance style injection.
- The hero contains exactly four product stages.
- The temporary route, wrapper, generic Aether copy, and obsolete workspace are gone.
- Validation, cleanup, keyboard access, touch access, reduced motion, and canvas fallback remain intact.

If verification required fixes, rerun Steps 1–5 and commit only those fixes with the repository-required `committer` command.
