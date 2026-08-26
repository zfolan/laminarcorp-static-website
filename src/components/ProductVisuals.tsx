import { AnimatePresence, LayoutGroup, motion, useTransform, type MotionValue } from 'motion/react'
import type { ReactNode } from 'react'
import { ArrowLeftRight, ArrowRight, Check, ChevronRight, Database, FileText, Gauge, Layers3, ShieldCheck, Users } from 'lucide-react'
import { landingContent } from '../data/landingContent'
import type { DecisionRecord } from '../types/content'

const sidebarItems = [
  { label: 'Priority queue', icon: Gauge },
  { label: 'Households', icon: Users },
  { label: 'Models', icon: Layers3 },
  { label: 'Rebalance', icon: ArrowLeftRight },
  { label: 'Proposals', icon: FileText },
  { label: 'Holdings data', icon: Database },
]

const WorkspaceChrome = ({ title, children, compact = false }: { title: string; children: ReactNode; compact?: boolean }) => (
  <div className={`workspace ${compact ? 'workspace--compact' : ''}`}>
    <div className="workspace__bar">
      <div className="workspace__mark"><img src="/laminar-mark.svg" alt="" /></div>
      <div className="workspace__identity">
        <span>{compact ? 'YOUR BOOK' : 'HOUSEHOLDS'}</span><i>/</i><strong>{title}</strong>
      </div>
      <span>APEX · DEMO WORKSPACE</span>
    </div>
    {children}
  </div>
)

const WorkspaceSidebar = () => (
  <aside className="workspace-sidebar">
    {sidebarItems.map(({ label, icon: Icon }, index) => (
      <div className={`workspace-sidebar__item ${index === 0 ? 'is-active' : ''}`} key={label} title={label}>
        <Icon size={14} />
        <span className="sr-only">{label}</span>
      </div>
    ))}
    <div className="workspace-sidebar__status">
      <i /><span className="sr-only">All sources connected</span>
    </div>
  </aside>
)

const QueueState = ({ state }: { state: DecisionRecord['state'] }) => <span className={`queue-state queue-state--${state}`}>{state.toUpperCase()}</span>

const DecisionQueue = ({ phase }: { phase: 0 | 1 | 2 }) => (
  <section className="decision-queue">
    <div className="decision-queue__heading"><span className="data-label data-label--blue">TODAY / 08 ITEMS</span><h3>Needs attention</h3></div>
    <AnimatePresence initial={false} mode="popLayout">
      {landingContent.decision.records.map((record, index) => {
        if (index === 0 && phase > 0) return null
        return (
          <motion.article key={record.household} layoutId={index === 0 ? 'selected-decision' : undefined} className={`queue-card ${index === 0 ? 'is-selected' : ''}`}>
            <div><strong>{record.household}</strong><ChevronRight size={13} /></div>
            <div><span>{record.signal}</span><b>{record.impact}</b></div>
            <QueueState state={record.state} />
          </motion.article>
        )
      })}
    </AnimatePresence>
  </section>
)

const allocations = [
  { label: 'Cash', current: '12.8%', target: '8.0%', width: '40%', tone: 'amber' },
  { label: 'Equity', current: '54.2%', target: '57.5%', width: '76%', tone: 'blue' },
  { label: 'Fixed income', current: '28.0%', target: '29.5%', width: '54%', tone: 'silver' },
  { label: 'Alternatives', current: '5.0%', target: '5.0%', width: '25%', tone: 'muted' },
]

const ReviewPanel = ({ phase }: { phase: 0 | 1 | 2 }) => (
  <section className={`review-panel review-panel--phase-${phase}`}>
    {phase === 0 ? (
      <motion.div className="review-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <span className="data-label data-label--blue">HOUSEHOLD REVIEW</span>
        <h3>Select a priority to resolve</h3>
        <p>The decision workspace keeps the relevant context ready while the queue stays focused.</p>
      </motion.div>
    ) : (
      <motion.div className="review-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.24 }}>
        <div className="review-header">
          <div><span className="data-label data-label--blue">HOUSEHOLD / {phase === 2 ? 'APPROVED' : 'NEEDS REVIEW'}</span><h3>Northbridge Household</h3></div>
          <QueueState state={phase === 2 ? 'ready' : 'review'} />
        </div>
        <motion.div className="signal-band" layoutId="selected-decision">
          <div><span className="data-label">PRIMARY SIGNAL</span><strong>Cash allocation exceeds mandate by 4.8%</strong></div>
          <b>$248,320</b>
        </motion.div>
        <div className="review-metrics">
          {[['PORTFOLIO', '$5.18M'], ['CASH', '12.8%'], ['TARGET', '8.0%']].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
        <div className="allocation-heading"><strong>Proposed allocation</strong><span>WITHIN POLICY</span></div>
        <div className="allocations">
          {allocations.map((item) => (
            <div className="allocation" key={item.label}>
              <div><span>{item.label}</span><b>{item.current} → {item.target}</b></div>
              <div className="allocation__track"><motion.i className={`allocation__fill allocation__fill--${item.tone}`} initial={false} animate={{ width: phase === 2 ? item.width : '12%' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} /></div>
            </div>
          ))}
        </div>
        <div className={`approval-bar ${phase === 2 ? 'is-approved' : ''}`}>
          <span><ShieldCheck size={14} /> {phase === 2 ? 'Decision approved' : 'Policy checks passed'}</span>
          <button type="button" tabIndex={-1}>{phase === 2 ? 'Approved' : 'Approve decision'} <ArrowRight size={13} /></button>
        </div>
      </motion.div>
    )}
  </section>
)

export const ApexDecisionWorkspace = ({ phase }: { phase: 0 | 1 | 2 }) => (
  <LayoutGroup id={`decision-${phase}`}>
    <div className={`apex-decision apex-decision--${phase}`}>
      <WorkspaceChrome title="HOUSEHOLD REVIEW">
        <div className="workspace__body">
          <WorkspaceSidebar />
          <DecisionQueue phase={phase} />
          <ReviewPanel phase={phase} />
        </div>
      </WorkspaceChrome>
    </div>
  </LayoutGroup>
)

export const HeroWorkspace = ({ y, opacity }: { y?: MotionValue<number>; opacity?: MotionValue<number> }) => (
  <motion.div className="hero-workspace" style={{ y, opacity }} aria-hidden="true">
    <WorkspaceChrome title="DECISION WORKSPACE" compact>
      <div className="workspace__body">
        <WorkspaceSidebar />
        <section className="hero-queue">
        <div className="hero-queue__heading"><div><span className="data-label data-label--blue">TODAY</span><h3>Decision queue</h3></div><span className="data-label">08 ITEMS · 03 NEED REVIEW</span></div>
          <div className="hero-summary">
            {[['CONNECTED HOUSEHOLDS', '148'], ['ACCOUNTS', '412'], ['MANDATE CHECKS', '23']].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
          <div className="hero-table__head"><span>HOUSEHOLD</span><span>SIGNAL</span><span>IMPACT</span><span>STATE</span></div>
          {landingContent.decision.records.slice(0, 3).map((record, index) => (
            <div className={`hero-table__row ${index === 0 ? 'is-selected' : ''}`} key={record.household}>
              <strong>{record.household}</strong><span>{record.signal}</span><b>{record.impact}</b><QueueState state={record.state} />
            </div>
          ))}
        </section>
      </div>
    </WorkspaceChrome>
  </motion.div>
)

export const ContextFlow = ({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) => (
  <ContextFlowContent progress={progress} reduced={reduced} />
)

const ContextFlowContent = ({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) => {
  const leftX = useTransform(progress, [0, 1], [-90, 0])
  const rightX = useTransform(progress, [0, 1], [90, 0])
  return <div className="context-flow" aria-hidden="true">
    <div className="context-flow__rail"><span>CONNECTED CONTEXT</span><motion.i style={reduced ? undefined : { scaleY: progress }} /></div>
    <div className="context-flow__sources context-flow__sources--left">
      {landingContent.context.sources.filter((item) => item.side === 'left').map((item) => (
        <motion.div key={item.label} style={reduced ? undefined : { x: leftX, opacity: progress }}><span><i />{item.label}</span><b>{item.value}</b></motion.div>
      ))}
    </div>
    <div className="context-flow__sources context-flow__sources--right">
      {landingContent.context.sources.filter((item) => item.side === 'right').map((item) => (
        <motion.div key={item.label} style={reduced ? undefined : { x: rightX, opacity: progress }}><span><i />{item.label}</span><b>{item.value}</b></motion.div>
      ))}
    </div>
    <div className="context-flow__resolver"><span>APEX RESOLVER</span><strong>Context matched</strong><i /></div>
    <div className="context-flow__packet"><div><span>DECISION PACKET / 00182</span><strong>Northbridge Household</strong></div><QueueState state="review" /></div>
  </div>
}

export const OutputFlow = ({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) => {
  const leftX = useTransform(progress, [0, 1], [0, -18])
  const rightX = useTransform(progress, [0, 1], [70, 0])
  const rightOpacity = useTransform(progress, [0.1, 0.65], [0.35, 1])
  return (
    <div className="output-flow" aria-hidden="true">
      <motion.article className="approved-record" style={reduced ? undefined : { x: leftX }}>
        <div className="approved-record__head"><div><span>DECISION / 00182</span><strong>Northbridge Household</strong></div><span className="approved-pill"><Check size={12} /> APPROVED</span></div>
        {[['ACTION', 'Rebalance cash to 8.0% target'], ['APPROVED BY', 'N. Patel · 10:14 MT'], ['POLICY', 'All mandate checks passed'], ['ESTIMATED TRADES', '6 orders · $248,320']].map(([label, value]) => <div className="approved-record__row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </motion.article>
      <div className="output-bridge"><span>CONTEXT CARRIES<br />FORWARD</span><i /><ArrowRight size={18} /></div>
      <motion.article className="proposal" style={reduced ? undefined : { x: rightX, opacity: rightOpacity }}>
        <div className="proposal__bar"><span>LAMINAR / APEX</span><span>PROPOSAL 00182</span></div>
        <div className="proposal__body">
          <span>PORTFOLIO RECOMMENDATION</span><h3>Northbridge Household</h3><small>Prepared 24 August 2026</small><hr />
          <span>RECOMMENDATION</span><p>Rebalance excess cash across the existing strategic allocation while maintaining mandate and liquidity constraints.</p>
          <div className="proposal__metrics">{[['CURRENT CASH', '12.8%'], ['PROPOSED', '8.0%'], ['EST. TRADES', '$248k']].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
          <small>Prepared from the approved Apex decision record. Final execution remains subject to advisor confirmation.</small>
        </div>
      </motion.article>
    </div>
  )
}
