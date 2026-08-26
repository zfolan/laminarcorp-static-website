import type { SleeveWeights } from '../../../data/stageBook'

const pct = (value: number) => `${Math.round(value * 1000) / 10}%`

export const AllocationBars = ({ target, current }: { target: SleeveWeights; current: SleeveWeights }) => (
  <div className="alloc-pair">
    <SleeveBar label="Target" weights={target} />
    <SleeveBar label="Current" weights={current} />
  </div>
)

const SleeveBar = ({ label, weights }: { label: string; weights: SleeveWeights }) => (
  <div className="alloc-bar">
    <span>{label}</span>
    <div className="alloc-bar__track" aria-hidden="true">
      <i className="alloc-bar__eq" style={{ width: pct(weights.equity) }} />
      <i className="alloc-bar__fi" style={{ width: pct(weights.fixedIncome) }} />
      <i className="alloc-bar__cash" style={{ width: pct(weights.cash) }} />
    </div>
    <small>EQ {pct(weights.equity)} · FI {pct(weights.fixedIncome)} · CASH {pct(weights.cash)}</small>
  </div>
)
