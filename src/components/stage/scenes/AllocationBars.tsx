import type { SleeveWeights } from '../../../data/stageBook'

const pct = (value: number) => `${(value * 100).toFixed(1)}%`

const sleeves = [
  { key: 'equity' as const, label: 'EQ', tone: 'eq' },
  { key: 'fixedIncome' as const, label: 'FI', tone: 'fi' },
  { key: 'cash' as const, label: 'Cash', tone: 'cash' },
]

export const AllocationBars = ({ target, current }: { target: SleeveWeights; current: SleeveWeights }) => (
  <div className="alloc-ledger">
    <div className="alloc-ledger__card alloc-ledger__card--target">
      <span>Target</span>
      <SleeveValues weights={target} />
    </div>
    <div className="alloc-ledger__card">
      <span>Current</span>
      <SleeveValues weights={current} />
    </div>
  </div>
)

const SleeveValues = ({ weights }: { weights: SleeveWeights }) => (
  <div className="alloc-ledger__values">
    {sleeves.map((sleeve) => (
      <div key={sleeve.key} className={`alloc-ledger__sleeve alloc-ledger__sleeve--${sleeve.tone}`}>
        <b>{sleeve.label}</b>
        <i>{pct(weights[sleeve.key])}</i>
      </div>
    ))}
  </div>
)
