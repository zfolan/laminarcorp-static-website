import type { CSSProperties, ReactNode } from 'react'
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { demoAnalytics, demoDeployment, demoHouseholdQueue, exceptionQueue, proposedTrades } from '../data/samplePortfolio'
import { STORY_DURATION, storyFrameBounds, storyMoments } from '../data/storyMoments'
import { film } from './filmTokens'

const pageBounds = [...storyFrameBounds]
const pageCenters = pageBounds.slice(0, -1).map((start, index) => (start + pageBounds[index + 1]) / 2)
const transitionFrames = 30
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }
const mono: CSSProperties = { fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.055em' }
const label: CSSProperties = { ...mono, color: film.muted, fontSize: 10, lineHeight: 1.2, textTransform: 'uppercase' }

const mix = (frame: number, input: number[], output: number[]) => interpolate(frame, input, output, {
  ...clamp,
  easing: Easing.inOut(Easing.cubic),
})

const layerMotion = (frame: number, index: number) => {
  const start = pageBounds[index]
  const end = pageBounds[index + 1]
  const entryStart = start
  const entryEnd = start + transitionFrames
  const exitStart = end - transitionFrames
  const hasEntry = index > 0
  const hasExit = index < pageBounds.length - 2
  return {
    opacity: hasEntry && hasExit
      ? interpolate(frame, [entryStart, entryEnd, exitStart, end], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) })
      : hasEntry
        ? interpolate(frame, [entryStart, entryEnd], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
        : hasExit
          ? interpolate(frame, [exitStart, end], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) })
          : 1,
    translateX: hasEntry && hasExit
      ? interpolate(frame, [entryStart, entryEnd, exitStart, end], [72, 0, 0, -54], { ...clamp, easing: Easing.inOut(Easing.cubic) })
      : hasEntry
        ? interpolate(frame, [entryStart, entryEnd, end], [72, 0, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) })
        : hasExit
          ? interpolate(frame, [0, exitStart, end], [0, 0, -54], { ...clamp, easing: Easing.inOut(Easing.cubic) })
          : 0,
    translateY: hasEntry && hasExit
      ? interpolate(frame, [entryStart, entryEnd, exitStart, end], [12, 0, 0, -8], { ...clamp, easing: Easing.inOut(Easing.cubic) })
      : hasEntry
        ? interpolate(frame, [entryStart, entryEnd, end], [12, 0, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) })
        : hasExit
          ? interpolate(frame, [0, exitStart, end], [0, 0, -8], { ...clamp, easing: Easing.inOut(Easing.cubic) })
          : 0,
    scale: hasEntry && hasExit
      ? interpolate(frame, [entryStart, entryEnd, exitStart, end], [.992, 1, 1, .994], { ...clamp, easing: Easing.inOut(Easing.cubic) })
      : hasEntry
        ? interpolate(frame, [entryStart, entryEnd, end], [.992, 1, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })
        : hasExit
          ? interpolate(frame, [0, exitStart, end], [1, 1, .994], { ...clamp, easing: Easing.inOut(Easing.cubic) })
          : 1,
    clipLeft: hasEntry ? interpolate(frame, [entryStart, entryEnd], [100, 0], { ...clamp, easing: Easing.bezier(.22, 1, .36, 1) }) : 0,
    clipRight: hasExit ? interpolate(frame, [exitStart, end], [0, 100], { ...clamp, easing: Easing.bezier(.64, 0, .78, 0) }) : 0,
  }
}

const sceneReveal = (frame: number, index: number, delay = 0, duration = 24) => interpolate(
  frame,
  [pageBounds[index] + delay, pageBounds[index] + delay + duration],
  [0, 1],
  { ...clamp, easing: Easing.bezier(.16, 1, .3, 1) },
)

const narrativeReveal = (frame: number, index: number, delay = 0, duration = 22) => interpolate(
  frame,
  [pageBounds[index] + delay, pageBounds[index] + delay + duration],
  [0, 1],
  { ...clamp, easing: Easing.bezier(.16, 1, .3, 1) },
)

const narrativeMotion = (frame: number, index: number) => {
  const start = pageBounds[index]
  const end = pageBounds[index + 1]
  const entry = index === 0 ? 1 : interpolate(frame, [start + 5, start + 21], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
  const exit = index === pageBounds.length - 2 ? 1 : interpolate(frame, [end - 36, end - 18], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) })
  return {
    opacity: Math.min(entry, exit),
    x: (1 - entry) * 32 - (1 - exit) * 24,
    y: (1 - entry) * 8 - (1 - exit) * 5,
  }
}

const boundaryPulse = (frame: number) => Math.max(...pageBounds.slice(1, -1).map((boundary) => interpolate(
  frame,
  [boundary - transitionFrames, boundary, boundary + transitionFrames],
  [0, 1, 0],
  { ...clamp, easing: Easing.inOut(Easing.cubic) },
)))

const tone = (status: string) => status === 'Ready' || status === 'On target'
  ? film.green
  : status === 'At risk'
    ? film.red
    : film.amber

const activePage = (frame: number) => {
  const nextBoundary = pageBounds.findIndex((bound, index) => index > 0 && frame < bound)
  return nextBoundary === -1 ? 5 : nextBoundary - 1
}

const Metric = ({ name, value, color = film.text }: { name: string; value: string; color?: string }) => (
  <div style={{ minWidth: 0 }}>
    <div style={label}>{name}</div>
    <div style={{ ...mono, marginTop: 8, color, fontSize: 17, whiteSpace: 'nowrap' }}>{value}</div>
  </div>
)

const Status = ({ children }: { children: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: tone(children), ...mono, fontSize: 9 }}>
    <i style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />{children.toUpperCase()}
  </span>
)

const Screen = ({ frame, index, children }: { frame: number; index: number; children: ReactNode }) => {
  const motion = layerMotion(frame, index)
  return (
    <section style={{ position: 'absolute', inset: '54px 0 0', overflow: 'hidden', opacity: motion.opacity, translate: `${motion.translateX}px ${motion.translateY}px`, scale: motion.scale, clipPath: `inset(0 ${motion.clipRight}% 0 ${motion.clipLeft}%)`, transformOrigin: '50% 30%', pointerEvents: 'none' }}>
      {children}
    </section>
  )
}

const flowLabels = [
  ['HOUSEHOLD', 'ANALYSIS'],
  ['ANALYSIS', 'REBALANCE'],
  ['REBALANCE', 'REVIEW'],
  ['REVIEWED TRADES', 'TRANCHES'],
  ['TRANCHES', 'EXPORT'],
] as const

const DecisionField = ({ frame, compact }: { frame: number; compact: boolean }) => {
  const travel = interpolate(frame, [0, STORY_DURATION], [0, compact ? -80 : -180], clamp)
  const opacity = interpolate(frame, [0, 80, STORY_DURATION - 80, STORY_DURATION], [.18, .38, .38, .16], clamp)
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity, pointerEvents: 'none' }}>
      {[18, 31, 44, 57, 70, 83].map((top, index) => (
        <div key={top} style={{ position: 'absolute', top: `${top}%`, left: compact ? '-12%' : '-4%', width: compact ? '124%' : '108%', height: 1, background: `linear-gradient(90deg, transparent, ${index % 2 ? film.border : film.blue} 18%, ${film.border} 82%, transparent)`, translate: `${travel * (index % 2 ? .65 : 1)}px 0` }}>
          <span style={{ position: 'absolute', left: `${20 + index * 11}%`, top: -2, width: compact ? 30 : 52, height: 4, background: index < 3 ? film.blue : film.strong }} />
          <span style={{ position: 'absolute', left: `${62 + index * 3}%`, top: -1, width: 3, height: 3, borderRadius: '50%', background: index === 3 ? film.amber : film.blueBright }} />
        </div>
      ))}
    </div>
  )
}

const DecisionTransition = ({ frame }: { frame: number }) => (
  <>
    {pageBounds.slice(1, -1).map((boundary, index) => {
      const opacity = interpolate(frame, [boundary - 26, boundary - 15, boundary + 15, boundary + 26], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) })
      const leftClip = interpolate(frame, [boundary - 26, boundary - 3], [100, 0], { ...clamp, easing: Easing.bezier(.22, 1, .36, 1) })
      const rightClip = interpolate(frame, [boundary + 3, boundary + 26], [0, 100], { ...clamp, easing: Easing.bezier(.64, 0, .78, 0) })
      const sweep = interpolate(frame, [boundary - 26, boundary + 26], [34, -34], { ...clamp, easing: Easing.inOut(Easing.cubic) })
      const labelOpacity = interpolate(frame, [boundary - 12, boundary - 4, boundary + 4, boundary + 12], [0, 1, 1, 0], clamp)
      return (
        <div key={boundary} style={{ position: 'absolute', zIndex: 50, inset: '48px 0 0 64px', overflow: 'hidden', opacity, clipPath: `inset(0 ${rightClip}% 0 ${leftClip}%)`, background: `linear-gradient(110deg, ${film.canvas}, #0b121a 56%, ${film.panel})`, pointerEvents: 'none' }}>
          {[0, 1, 2, 3].map((row) => (
            <div key={row} style={{ position: 'absolute', top: `${28 + row * 14}%`, left: '-15%', width: '130%', height: row === 0 ? 18 : 12, borderBlock: `1px solid ${row === 2 ? film.amber : film.border}`, background: row === 0 ? `${film.blue}18` : `${film.raised}e8`, translate: `${sweep * (row % 2 ? -.7 : 1)}px 0` }}>
              <span style={{ position: 'absolute', left: `${18 + row * 13}%`, top: '50%', width: `${22 - row * 2}%`, height: 2, translate: '0 -50%', background: row === 2 ? film.amber : row === 3 ? film.green : film.blueBright, opacity: .72 }} />
            </div>
          ))}
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: labelOpacity }}>
            <div style={{ minWidth: 330, padding: '18px 24px', borderInline: `1px solid ${film.strong}`, textAlign: 'center', background: `${film.canvas}e8` }}>
              <div style={{ ...mono, color: film.muted, fontSize: 8 }}>ONE HOUSEHOLD · ONE CONTINUOUS DECISION</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 13, marginTop: 9, ...mono, fontSize: 11 }}><span style={{ color: film.text }}>{flowLabels[index][0]}</span><span style={{ color: film.blueBright }}>→</span><span style={{ color: film.blueBright }}>{flowLabels[index][1]}</span></div>
            </div>
          </div>
        </div>
      )
    })}
  </>
)

const PageHeader = ({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail: string; action?: string }) => (
  <header style={{ minHeight: 104, padding: '28px 34px 20px', borderBottom: `1px solid ${film.border}`, display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 28 }}>
    <div><div style={{ ...label, color: film.blueBright }}>{eyebrow}</div><h2 style={{ margin: '9px 0 0', fontSize: 31, fontWeight: 500, letterSpacing: '-0.035em' }}>{title}</h2><p style={{ margin: '7px 0 0', color: film.muted, fontSize: 12 }}>{detail}</p></div>
    {action && <div style={{ padding: '10px 14px', border: `1px solid ${film.strong}`, background: film.raised, ...mono, fontSize: 9 }}>{action}</div>}
  </header>
)

const HouseholdScreen = ({ frame }: { frame: number }) => {
  const selected = interpolate(frame, [68, 82], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
  const lift = interpolate(frame, [69, 74, 80, 88], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) })
  const selectedScale = 1 + lift * .01
  return (
    <Screen frame={frame} index={0}>
      <PageHeader eyebrow="HOUSEHOLDS / PRIORITY QUEUE" title="Household Library" detail="Review households by material drift and move directly into analysis." action="HIGHEST DRIFT ↓" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', margin: '16px 34px', border: `1px solid ${film.border}`, background: film.border, gap: 1 }}>
        {[['At risk', '04', film.red], ['Review', '03', film.amber], ['On target', '07', film.green], ['Households', '14', film.text]].map(([name, value, color]) => <div key={name} style={{ padding: '17px 19px', background: film.raised }}><Metric name={name} value={value} color={color} /></div>)}
      </div>
      <div style={{ margin: '0 34px', border: `1px solid ${film.border}`, background: film.panel }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .5fr .65fr 1.05fr .45fr .55fr', padding: '12px 16px', borderBottom: `1px solid ${film.border}`, ...label }}><span>Household</span><span>Accounts</span><span>Value</span><span>Current → target</span><span>Drift</span><span>Status</span></div>
        {demoHouseholdQueue.map((household, index) => {
          const rowReveal = sceneReveal(frame, 0, 14 + index * 5, 18)
          return (
          <div key={household.name} style={{ position: 'relative', zIndex: index === 0 ? 2 : 1, isolation: index === 0 ? 'isolate' : undefined, display: 'grid', gridTemplateColumns: '1.2fr .5fr .65fr 1.05fr .45fr .55fr', minHeight: 63, padding: '0 16px', alignItems: 'center', opacity: rowReveal, translate: `0 ${12 * (1 - rowReveal) - (index === 0 ? lift * 2.5 : 0)}px`, scale: index === 0 ? selectedScale : 1, borderBottom: `1px solid ${film.border}`, background: index === 0 ? `linear-gradient(90deg, rgba(84,135,182,${.05 + selected * .13}), rgba(84,135,182,${.015 + selected * .035}) 62%, ${film.panel})` : film.panel, transformOrigin: '50% 50%', boxShadow: index === 0 ? `0 0 0 ${lift * 8}px ${film.panel}, 0 ${lift * 10}px ${lift * 28}px rgba(0,0,0,${lift * .34}), inset 0 0 0 1px rgba(84,135,182,${selected * .72})` : undefined }}>
            <div><strong style={{ fontSize: 13, fontWeight: 500 }}>{household.name}</strong>{index === 0 ? <div style={{ position: 'relative', height: 10, marginTop: 5, ...mono, fontSize: 8 }}><span style={{ position: 'absolute', inset: 0, color: film.muted, opacity: 1 - selected }}>OPEN HOUSEHOLD</span><span style={{ position: 'absolute', inset: 0, color: film.blueBright, opacity: selected }}>SELECTED FOR ANALYSIS</span></div> : <div style={{ ...mono, marginTop: 5, color: film.muted, fontSize: 8 }}>OPEN HOUSEHOLD</div>}</div>
            <span style={{ ...mono, fontSize: 11 }}>{household.accounts}</span><span style={{ ...mono, fontSize: 11 }}>{household.value}</span><span style={{ ...mono, fontSize: 10, color: film.muted }}>{household.current} <b style={{ color: film.blueBright }}>→</b> {household.target}</span><span style={{ ...mono, color: tone(household.status), fontSize: 11 }}>{household.drift}</span><Status>{household.status}</Status>
          </div>
        )})}
      </div>
    </Screen>
  )
}

const BarCompare = ({ current, target, reveal = 1 }: { current: number; target: number; reveal?: number }) => (
  <div style={{ display: 'grid', gap: 6 }}>
    <div style={{ width: `${current * reveal}%`, height: 5, background: '#9aa6b2' }} />
    <div style={{ width: `${target * reveal}%`, height: 5, background: film.blue }} />
  </div>
)

const AnalyticsScreen = ({ frame }: { frame: number }) => {
  const panelReveal = sceneReveal(frame, 1, 16, 26)
  const currencyReveal = sceneReveal(frame, 1, 36, 28)
  return (
  <Screen frame={frame} index={1}>
    <PageHeader eyebrow="HOUSEHOLDS / ANALYTICS" title="Household Analytics" detail="Allocation, exposure, currency, and model alignment across the selected household." action="HOUSEHOLD SCOPE" />
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr repeat(4, .7fr)', margin: '16px 34px 0', border: `1px solid ${film.border}`, background: film.border, gap: 1 }}>
      {[['Total value', demoAnalytics.value], ['Holdings', demoAnalytics.holdings], ['Equity', demoAnalytics.equity], ['Fixed income', demoAnalytics.fixedIncome], ['Cash', demoAnalytics.cash]].map(([name, value], index) => <div key={name} style={{ padding: '16px 18px', background: index === 0 ? film.raised : film.panel }}><Metric name={name} value={value} color={index === 2 ? film.blueBright : index === 3 ? film.amber : index === 4 ? film.green : film.text} /></div>)}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1.42fr .72fr', gap: 12, margin: '12px 34px' }}>
      <div style={{ border: `1px solid ${film.border}`, background: film.panel }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${film.border}`, fontSize: 13 }}><span>Allocation drift</span><span style={{ ...label }}><b style={{ color: '#9aa6b2' }}>CURRENT</b> · <b style={{ color: film.blueBright }}>MODEL</b></span></div>
        {demoAnalytics.drift.map((row, index) => <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '.7fr 1.5fr .28fr .28fr .34fr', gap: 14, alignItems: 'center', padding: '14px 16px', borderBottom: `1px solid ${film.border}`, opacity: sceneReveal(frame, 1, 18 + index * 5, 20), translate: `${12 * (1 - sceneReveal(frame, 1, 18 + index * 5, 20))}px 0` }}><span style={{ fontSize: 11 }}>{row.label}</span><BarCompare current={row.current * 2} target={row.target * 2} reveal={panelReveal} /><span style={{ ...mono, fontSize: 10 }}>{row.current}%</span><span style={{ ...mono, color: film.blueBright, fontSize: 10 }}>{row.target}%</span><span style={{ ...mono, color: row.difference.startsWith('+') ? film.amber : film.red, fontSize: 10 }}>{row.difference}</span></div>)}
      </div>
      <div style={{ border: `1px solid ${film.border}`, background: film.panel, padding: 17 }}>
        <div style={{ fontSize: 13, paddingBottom: 14, borderBottom: `1px solid ${film.border}` }}>Currency exposure</div>
        <div style={{ display: 'flex', width: `${currencyReveal * 100}%`, height: 8, marginTop: 22, overflow: 'hidden' }}>{demoAnalytics.currency.map((item, index) => <span key={item.label} style={{ width: `${item.value}%`, flex: '0 0 auto', background: index === 0 ? '#9aa6b2' : film.blue }} />)}</div>
        {demoAnalytics.currency.map((item, index) => <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: `1px solid ${film.border}`, ...mono, fontSize: 11 }}><span style={{ color: index === 0 ? '#b6c0ca' : film.blueBright }}>■ {item.label}</span><span>{item.value}%</span></div>)}
        <div style={{ marginTop: 18, padding: '14px', border: `1px solid ${film.amber}66`, background: `${film.amber}0d`, ...mono, color: film.amber, fontSize: 9 }}>REVIEW · CURRENCY REQUIREMENT</div>
      </div>
    </div>
  </Screen>
  )
}

const AllocationRow = ({ name, current, impact, projected, target, color }: { name: string; current: string; impact: string; projected: string; target: string; color: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '.65fr 1fr .9fr 1fr 1fr', alignItems: 'center', minHeight: 47, padding: '0 16px', borderBottom: `1px solid ${film.border}`, ...mono, fontSize: 10 }}>
    <strong style={{ color, fontFamily: 'Instrument Sans, sans-serif', fontSize: 12, letterSpacing: 0 }}>{name}</strong><span>CURRENT <b style={{ color }}>{current}</b></span><span>IMPACT <b>{impact}</b></span><span>PROJECTED <b style={{ color: film.green }}>{projected}</b></span><span>TARGET <b>{target}</b></span>
  </div>
)

const RebalanceScreen = ({ frame }: { frame: number }) => (
  <Screen frame={frame} index={2}>
    <PageHeader eyebrow="HOUSEHOLDS / REBALANCE" title="Rebalance Command Center" detail="Prepare and review account-aware changes across the household." action="RUN COMPLETE · READY" />
    <div style={{ margin: '15px 34px 0', border: `1px solid ${film.border}`, background: film.panel }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr .8fr', gap: 1, background: film.border }}>
        {[['Equity model', 'Balanced equity'], ['Fixed-income model', 'Core income'], ['Household target', '72 / 25 / 3']].map(([name, value]) => <div key={name} style={{ padding: '13px 16px', background: film.raised }}><Metric name={name} value={value} /></div>)}
      </div>
      <AllocationRow name="Equity" current="68%" impact="+4%" projected="72%" target="72%" color={film.blueBright} />
      <AllocationRow name="Fixed income" current="28%" impact="−3%" projected="25%" target="25%" color={film.amber} />
      <AllocationRow name="Cash" current="4%" impact="−1%" projected="3%" target="3%" color={film.green} />
    </div>
    <div style={{ margin: '12px 34px', border: `1px solid ${film.border}`, background: film.panel }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: `1px solid ${film.border}` }}><span style={{ fontSize: 13 }}>Proposed trades</span><span style={{ ...mono, color: film.muted, fontSize: 9 }}>04 TRADES · 04 ACCOUNTS</span></div>
      <TradeRows compact frame={frame} start={pageBounds[2] + 20} />
    </div>
  </Screen>
)

const TradeRows = ({ compact = false, frame, start = 0 }: { compact?: boolean; frame?: number; start?: number }) => (
  <div>
    <div style={{ display: 'grid', gridTemplateColumns: '.5fr .55fr 1fr .65fr 1.15fr .5fr', padding: '10px 14px', background: film.raised, ...label }}><span>Action</span><span>Security</span><span>Account</span><span>Value</span><span>Reason</span><span>Status</span></div>
    {proposedTrades.map((trade, index) => {
      const reveal = frame === undefined ? 1 : interpolate(frame, [start + index * 6, start + 18 + index * 6], [0, 1], { ...clamp, easing: Easing.bezier(.16, 1, .3, 1) })
      return <div key={`${trade.ticker}-${trade.account}`} style={{ display: 'grid', gridTemplateColumns: '.5fr .55fr 1fr .65fr 1.15fr .5fr', minHeight: compact ? 39 : 48, padding: '0 14px', alignItems: 'center', opacity: reveal, translate: `${18 * (1 - reveal)}px 0`, borderBottom: `1px solid ${film.border}`, background: trade.status === 'Review' ? `${film.amber}08` : 'transparent', ...mono, fontSize: 9 }}><span style={{ color: trade.side === 'Buy' ? film.green : film.red }}>{trade.side.toUpperCase()}</span><strong>{trade.ticker}</strong><span>{trade.account}</span><span>{trade.amount}</span><span style={{ color: film.muted }}>{trade.reason}</span><Status>{trade.status}</Status></div>
    })}
  </div>
)

const ReviewScreen = ({ frame }: { frame: number }) => {
  const approval = sceneReveal(frame, 3, 58, 24)
  return (
  <Screen frame={frame} index={3}>
    <PageHeader eyebrow="REBALANCE / DECISION REVIEW" title="Review the recommendation" detail="Resolve material exceptions before the proposed trades move forward." action="02 REQUIRE REVIEW" />
    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 12, margin: '18px 34px' }}>
      <div style={{ border: `1px solid ${film.border}`, background: film.panel }}>
        <div style={{ padding: '15px 17px', borderBottom: `1px solid ${film.border}`, display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13 }}>Exception review</span><span style={{ ...label }}>CONTEXT RETAINED</span></div>
        {exceptionQueue.map((item, index) => {
          const reveal = sceneReveal(frame, 3, 20 + index * 8, 20)
          return <div key={item.title} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', alignItems: 'center', gap: 12, minHeight: 70, padding: '0 17px', opacity: reveal, translate: `${15 * (1 - reveal)}px 0`, borderBottom: `1px solid ${film.border}` }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: item.tone === 'red' ? film.red : film.amber }} /><div><strong style={{ fontSize: 12, fontWeight: 500 }}>{item.title}</strong><div style={{ ...mono, color: film.muted, marginTop: 6, fontSize: 8 }}>{item.detail}</div></div><span style={{ ...mono, color: item.tone === 'red' ? film.red : film.amber, fontSize: 10 }}>{item.value}</span></div>
        })}
      </div>
      <div style={{ border: `1px solid ${film.strong}`, background: film.raised, padding: 23 }}>
        <div style={{ ...label, color: film.blueBright }}>PORTFOLIO-MANAGER CONTROL</div>
        <h3 style={{ margin: '17px 0 24px', fontSize: 23, fontWeight: 500, lineHeight: 1.12 }}>Approve only after the context and proposed changes have been reviewed.</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: film.border, border: `1px solid ${film.border}` }}>{[['Trades', '04'], ['Accounts', '04'], ['Ready', '02'], ['Review', '02']].map(([name, value]) => <div key={name} style={{ padding: 15, background: film.panel }}><Metric name={name} value={value} color={name === 'Ready' ? film.green : name === 'Review' ? film.amber : film.text} /></div>)}</div>
        <div style={{ position: 'relative', marginTop: 20, padding: '15px', overflow: 'hidden', textAlign: 'center', border: `1px solid ${film.blue}`, color: approval > .62 ? '#071018' : film.blueBright, ...mono, fontSize: 10 }}><span style={{ position: 'absolute', inset: 0, right: `${(1 - approval) * 100}%`, background: film.blue }} /><span style={{ position: 'relative' }}>APPROVE REVIEWED TRADES →</span></div>
      </div>
    </div>
  </Screen>
  )
}

const DeploymentScreen = ({ frame }: { frame: number }) => {
  const selection = sceneReveal(frame, 4, 50, 24)
  return (
  <Screen frame={frame} index={4}>
    <PageHeader eyebrow="IMPLEMENTATION / DEPLOYMENT CENTER" title="Stage reviewed trades into tranches" detail="Organize approved recommendations into clear, reviewable trade groups." action="CREATE TRANCHE +" />
    <div style={{ display: 'grid', gridTemplateColumns: '.78fr 1.22fr', gap: 12, margin: '18px 34px' }}>
      <div style={{ border: `1px solid ${film.border}`, background: film.panel }}>
        <div style={{ padding: '15px 17px', borderBottom: `1px solid ${film.border}`, display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13 }}>Trade tranches</span><span style={{ ...label }}>03 GROUPS</span></div>
        {demoDeployment.tranches.map((tranche, index) => {
          const reveal = sceneReveal(frame, 4, 14 + index * 7, 20)
          return <div key={tranche.name} style={{ padding: '18px 17px', opacity: reveal, translate: `${14 * (1 - reveal)}px 0`, borderBottom: `1px solid ${film.border}`, background: index === 0 ? `${film.blue}${Math.round(8 + selection * 14).toString(16).padStart(2, '0')}` : 'transparent', boxShadow: index === 0 ? `inset ${1 + selection * 2}px 0 ${film.blueBright}` : undefined }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 12, fontWeight: 500 }}>{tranche.name}</strong><Status>{tranche.status}</Status></div><div style={{ display: 'flex', gap: 18, marginTop: 9, ...mono, color: film.muted, fontSize: 8 }}><span>{String(tranche.orders).padStart(2, '0')} ORDERS</span><span>{tranche.currency}</span></div></div>
        })}
      </div>
      <div style={{ border: `1px solid ${film.strong}`, background: film.panel }}>
        <div style={{ padding: '15px 17px', borderBottom: `1px solid ${film.border}`, display: 'flex', justifyContent: 'space-between' }}><div><span style={{ fontSize: 13 }}>Core rebalance</span><div style={{ ...mono, color: film.muted, marginTop: 6, fontSize: 8 }}>SELECTED TRANCHE · CAD</div></div><Status>Ready</Status></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: film.border, gap: 1 }}><div style={{ padding: 15, background: film.raised }}><Metric name="Orders" value="07" /></div><div style={{ padding: 15, background: film.raised }}><Metric name="Accounts" value="04" /></div><div style={{ padding: 15, background: film.raised }}><Metric name="Held" value="00" color={film.green} /></div></div>
        <TradeRows compact frame={frame} start={pageBounds[4] + 26} />
      </div>
    </div>
  </Screen>
  )
}

const ExportScreen = ({ frame }: { frame: number }) => {
  const exportReady = sceneReveal(frame, 5, 70, 28)
  return (
  <Screen frame={frame} index={5}>
    <PageHeader eyebrow="DEPLOYMENT CENTER / TRADE EXPORT" title="Prepare reviewed trades for export" detail="Confirm the tranche, included accounts, and held items before preparing the trade file." action="EXPORT REVIEW" />
    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 14, margin: '20px 34px' }}>
      <div style={{ border: `1px solid ${film.border}`, background: film.panel }}>
        <div style={{ padding: '17px', borderBottom: `1px solid ${film.border}`, display: 'flex', justifyContent: 'space-between' }}><div><span style={{ fontSize: 14 }}>Core rebalance</span><div style={{ ...mono, color: film.muted, marginTop: 6, fontSize: 8 }}>APPROVED TRANCHE · PREPARED FOR EXPORT</div></div><Status>Ready</Status></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: film.border }}>{[['Orders', '07'], ['Accounts', '04'], ['Currency', 'CAD'], ['Exceptions', '00']].map(([name, value]) => <div key={name} style={{ padding: '17px', background: film.raised }}><Metric name={name} value={value} color={name === 'Exceptions' ? film.green : film.text} /></div>)}</div>
        <div style={{ padding: '17px' }}>
          {['Household and account context confirmed', 'Portfolio-manager review recorded', 'Held trades excluded from this tranche'].map((item, index) => {
            const confirmed = sceneReveal(frame, 5, 26 + index * 13, 18)
            return <div key={item} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', opacity: .45 + confirmed * .55, borderBottom: `1px solid ${film.border}`, fontSize: 12 }}><span>{item}</span><span style={{ ...mono, color: film.green, fontSize: 9, translate: `${8 * (1 - confirmed)}px 0` }}>{confirmed > .72 ? 'CONFIRMED ✓' : 'CHECKING'}</span></div>
          })}
        </div>
      </div>
      <div style={{ border: `1px solid ${film.blue}88`, background: film.raised, padding: 25, display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...label, color: film.blueBright }}>TRADE EXPORT</div>
        <h3 style={{ margin: '18px 0 12px', fontSize: 27, fontWeight: 500, letterSpacing: '-0.035em' }}>One reviewed tranche, ready to prepare.</h3>
        <p style={{ margin: 0, color: film.muted, fontSize: 12, lineHeight: 1.5 }}>The export contains the approved account-level actions from this tranche. Held items remain separate for further review.</p>
        <div style={{ position: 'relative', marginTop: 'auto', padding: '17px', overflow: 'hidden', textAlign: 'center', border: `1px solid ${film.blue}`, color: exportReady > .58 ? '#071018' : film.blueBright, ...mono, fontSize: 10 }}><span style={{ position: 'absolute', inset: 0, right: `${(1 - exportReady) * 100}%`, background: film.blue }} /><span style={{ position: 'relative' }}>EXPORT REVIEWED TRADES ↓</span></div>
      </div>
    </div>
  </Screen>
  )
}

const ContextRail = ({ frame }: { frame: number }) => {
  const active = activePage(frame)
  const names = ['HOUSEHOLDS', 'ANALYTICS', 'REBALANCE', 'REVIEW', 'DEPLOYMENT', 'EXPORT']
  return (
    <div style={{ position: 'absolute', zIndex: 30, top: 0, right: 0, left: 0, height: 54, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0 20px', borderBottom: `1px solid ${film.border}`, background: '#0a0f15' }}>
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, gap: 12 }}><span style={{ ...mono, color: film.blueBright, fontSize: 9 }}>{names[active]}</span><span style={{ color: film.strong }}>›</span><strong style={{ fontSize: 12, fontWeight: 500 }}>Alder Household</strong><span style={{ ...mono, color: film.muted, fontSize: 8 }}>04 ACCOUNTS</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ ...mono, color: film.red, fontSize: 9 }}>4.2% DRIFT</span><Status>{active < 3 ? 'Review' : active === 3 ? 'Ready' : 'Ready'}</Status></div>
    </div>
  )
}

type NavIconName = 'portfolio' | 'households' | 'analytics' | 'rebalance' | 'review' | 'deployment' | 'export'

const NavIcon = ({ name, size = 18 }: { name: NavIconName; size?: number }) => {
  const paths: Record<NavIconName, ReactNode> = {
    portfolio: <><path d="M3 6.5h5l1.5 2H17v7.5H3z" /><path d="M3 8.5V5h5l1.5 2" /></>,
    households: <><circle cx="7" cy="7" r="2.5" /><circle cx="14" cy="8" r="2" /><path d="M2.5 16c.4-3 2-4.5 4.5-4.5s4.1 1.5 4.5 4.5M12 12c2.4 0 3.7 1.2 4 3.5" /></>,
    analytics: <><rect x="3" y="3" width="5" height="5" rx=".7" /><rect x="12" y="3" width="5" height="5" rx=".7" /><rect x="3" y="12" width="5" height="5" rx=".7" /><rect x="12" y="12" width="5" height="5" rx=".7" /></>,
    rebalance: <><path d="M3 7h12l-3-3M15 13H3l3 3" /><path d="m12 4 3 3-3 3M6 10l-3 3 3 3" /></>,
    review: <><path d="M5 2.5h7l3 3V17H5z" /><path d="M12 2.5V6h3M7.5 10h5M7.5 13h5" /></>,
    deployment: <><path d="M4 6.5h12v10H4zM7 3.5h6v3H7z" /><path d="M7 10h6M7 13h4" /></>,
    export: <><path d="M10 3v9M6.5 8.5 10 12l3.5-3.5" /><path d="M4 14v3h12v-3" /></>,
  }
  return <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

const WindowChrome = ({ frame }: { frame: number }) => {
  const active = activePage(frame)
  const navItems: { name: NavIconName; label: string; divider?: boolean }[] = [
    { name: 'households', label: 'Households' },
    { name: 'analytics', label: 'Analytics' },
    { name: 'rebalance', label: 'Rebalance' },
    { name: 'review', label: 'Review', divider: true },
    { name: 'deployment', label: 'Deployment' },
    { name: 'export', label: 'Export' },
  ]
  return (
    <>
      <div style={{ position: 'absolute', zIndex: 3, top: 0, right: 0, left: 64, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', borderBottom: `1px solid ${film.border}`, background: '#090d12' }}>
        <span style={{ ...mono, color: film.muted, fontSize: 9 }}>ADVISOR WORKSPACE</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, ...mono, color: film.muted, fontSize: 8 }}><span>FICTIONAL DEMONSTRATION</span><span style={{ color: film.green }}>● READY</span></div>
      </div>
      <aside style={{ position: 'absolute', zIndex: 4, inset: '0 auto 0 0', width: 64, borderRight: `1px solid ${film.border}`, background: '#0a1119', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', height: 58, display: 'grid', placeItems: 'center', borderBottom: `1px solid ${film.border}` }}>
          <Img src={staticFile('laminar-mark.svg')} style={{ width: 29, height: 29, objectFit: 'contain' }} />
        </div>
        <div style={{ width: 38, height: 38, marginTop: 17, display: 'grid', placeItems: 'center', border: `1px solid ${film.strong}`, borderRadius: 4, color: film.text, background: '#080d13' }}><NavIcon name="portfolio" /></div>
        <div style={{ width: 32, height: 1, margin: '13px 0 10px', background: film.border }} />
        <nav style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          {navItems.map((item, index) => {
            const isActive = active === index
            return <div key={item.name} style={{ width: '100%', display: 'grid', justifyItems: 'center' }}>
              <div style={{ width: 52, height: 42, display: 'grid', placeItems: 'center' }}>
                <div aria-label={item.label} style={{ position: 'relative', width: 46, height: 42, display: 'grid', placeItems: 'center', color: isActive ? film.text : film.muted, background: isActive ? '#121c27' : 'transparent', boxShadow: isActive ? `inset 2px 0 0 ${film.blueBright}` : undefined }}>
                  <span style={{ width: 32, height: 32, display: 'grid', placeItems: 'center' }}><NavIcon name={item.name} /></span>
                </div>
              </div>
              {item.divider && <div style={{ width: 32, height: 1, margin: '7px 0 1px', background: film.border }} />}
            </div>
          })}
        </nav>
      </aside>
    </>
  )
}

const NarrativeLayer = ({ frame, compact }: { frame: number; compact: boolean }) => (
  <div style={{ position: 'absolute', zIndex: 8, inset: 0, pointerEvents: 'none' }}>
    {storyMoments.map((moment, index) => {
      const motion = narrativeMotion(frame, index)
      const eyebrowReveal = narrativeReveal(frame, index, index === 0 ? 0 : 7, 18)
      const titleReveal = narrativeReveal(frame, index, index === 0 ? 5 : 12, 22)
      const copyReveal = narrativeReveal(frame, index, index === 0 ? 12 : 20, 22)
      const metaReveal = narrativeReveal(frame, index, index === 0 ? 20 : 30, 24)
      return (
        <section key={moment.eyebrow} style={{ position: 'absolute', left: compact ? '6%' : '4.8%', right: compact ? '6%' : 'auto', top: compact ? '68%' : '23%', width: compact ? 'auto' : '22%', opacity: motion.opacity, translate: compact ? `0 ${motion.y * .35}px` : `${motion.x}px ${motion.y}px` }}>
          <div style={{ width: `${(compact ? 54 : 74) * eyebrowReveal}px`, height: 1, marginBottom: compact ? 15 : 25, background: film.blueBright }} />
          <div style={{ ...mono, color: film.blueBright, opacity: eyebrowReveal, translate: `${12 * (1 - eyebrowReveal)}px 0`, fontSize: compact ? 8 : 10, lineHeight: 1.2 }}>{moment.eyebrow}</div>
          <div style={{ marginTop: compact ? 11 : 18, overflow: 'hidden' }}><h2 style={{ margin: 0, maxWidth: compact ? 700 : 390, color: film.text, translate: `0 ${42 * (1 - titleReveal)}px`, opacity: titleReveal, fontSize: compact ? 31 : 48, fontWeight: 500, lineHeight: .98, letterSpacing: '-.05em' }}>{moment.title}</h2></div>
          <p style={{ margin: compact ? '13px 0 0' : '25px 0 0', maxWidth: compact ? 720 : 360, color: film.muted, opacity: copyReveal, translate: `0 ${20 * (1 - copyReveal)}px`, fontSize: compact ? 11 : 15, lineHeight: 1.52 }}>{moment.copy}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: compact ? 13 : 23, paddingTop: compact ? 11 : 15, opacity: metaReveal, translate: `0 ${14 * (1 - metaReveal)}px`, borderTop: `1px solid ${film.border}` }}>
            {moment.meta.map((item) => <span key={item} style={{ padding: compact ? '5px 7px' : '7px 9px', border: `1px solid ${film.strong}`, color: film.text, ...mono, fontSize: compact ? 6 : 7, lineHeight: 1, textTransform: 'uppercase' }}>{item}</span>)}
          </div>
          {'note' in moment && moment.note && <small style={{ display: 'block', marginTop: 15, maxWidth: 350, color: film.muted, fontSize: compact ? 7 : 9, lineHeight: 1.4 }}>{moment.note}</small>}
        </section>
      )
    })}
  </div>
)

export const HouseholdFilm = () => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()
  const pulse = boundaryPulse(frame)
  const cameraScale = mix(frame, pageCenters, [.92, .955, .97, .955, .975, .945]) + pulse * .026
  const cameraX = mix(frame, pageCenters, [22, 8, -4, 5, -5, 0])
  const cameraY = mix(frame, pageCenters, [10, -2, 2, -3, 2, 6])
  const cameraRotate = mix(frame, pageCenters, [.06, -.035, .025, -.028, .02, 0])
  const progress = interpolate(frame, [0, STORY_DURATION], [0, 100], clamp)
  const compact = width < 1300

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: film.canvas, color: film.text, fontFamily: 'Instrument Sans, sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${film.border}20 1px, transparent 1px), linear-gradient(90deg, ${film.border}1c 1px, transparent 1px)`, backgroundSize: '82px 82px', opacity: .24 }} />
      <DecisionField frame={frame} compact={compact} />
      <NarrativeLayer frame={frame} compact={compact} />
      <div style={{ position: 'absolute', inset: compact ? '3.5% 3% 35% 3%' : '8% 2.5% 8% 29%', translate: `${cameraX}px ${cameraY}px`, scale: cameraScale, rotate: `${cameraRotate}deg`, transformOrigin: '50% 50%', filter: `drop-shadow(0 ${36 + pulse * 22}px ${54 + pulse * 22}px rgba(0,0,0,.62))` }}>
        <div style={{ position: 'absolute', inset: '13px -14px -14px 14px', border: `1px solid ${film.border}`, background: '#05080c', boxShadow: '0 35px 80px rgba(0,0,0,.46)' }} />
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', border: `1px solid ${film.strong}`, background: film.panel, boxShadow: `inset 0 0 0 1px ${film.border}55` }}>
          <WindowChrome frame={frame} />
          <main style={{ position: 'absolute', top: 48, right: 0, bottom: 0, left: 64, overflow: 'hidden', background: film.canvas }}>
            <ContextRail frame={frame} />
            <HouseholdScreen frame={frame} />
            <AnalyticsScreen frame={frame} />
            <RebalanceScreen frame={frame} />
            <ReviewScreen frame={frame} />
            <DeploymentScreen frame={frame} />
            <ExportScreen frame={frame} />
          </main>
          <div style={{ position: 'absolute', left: 0, bottom: 0, width: `${progress}%`, height: 2, background: film.blueBright }} />
        </div>
        <DecisionTransition frame={frame} />
      </div>
      <div style={{ position: 'absolute', right: 30, bottom: 22, ...mono, color: film.muted, fontSize: 8 }}>{Math.round(progress).toString().padStart(3, '0')} / 100 · SCROLL CONTROLLED</div>
      <div style={{ position: 'absolute', width: width * .65, height: height * .55, right: -width * .1, top: height * .15, background: `radial-gradient(circle, ${film.blue}14, transparent 68%)`, filter: 'blur(36px)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  )
}
