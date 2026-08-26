import {
  ArrowRight,
  ChartNoAxesColumn,
  ChevronDown,
  ShoppingCart,
  Tag,
  TrendingUp,
  WalletCards,
} from 'lucide-react'
import { stageBook } from '../../../data/stageBook'

const whole = (value: number) =>
  `${value < 0 ? '-' : ''}$${Math.abs(Math.round(value)).toLocaleString('en-CA')}`

const signedWhole = (value: number) =>
  `${value > 0 ? '+' : value < 0 ? '-' : ''}$${Math.abs(Math.round(value)).toLocaleString('en-CA')}`

const shares = (value: number) => value.toLocaleString('en-CA')

const signedShares = (value: number) => `${value > 0 ? '+' : ''}${value.toLocaleString('en-CA')}`

const pct = (value: number) => `${(value * 100).toFixed(1)}%`

const price = (value: number, currency: 'CAD' | 'USD') =>
  `${currency === 'USD' ? '$' : 'C$'}${value.toFixed(2)}`

const varianceTone = (actual: number, target: number) => {
  const delta = Math.abs(actual - target)
  if (delta <= 0.01) return 'on'
  if (delta <= 0.02) return 'review'
  return 'off'
}

const impactTone = (value: number) => (value > 0 ? 'on' : value < 0 ? 'off' : 'neutral')

const cashTone = (actual: number, target: number) => (actual <= target ? 'on' : 'off')

const columns = ['Ticker', 'Name', 'Action', 'Qty', 'Acc Shares', 'Price', 'Trade Value', 'Capital Gain', 'Deviation', 'Status'] as const

export const RebalanceFrame = () => {
  const { household, accountsInHousehold, current, target, projected, tradeImpact, sleeveValues, metrics, accounts } = stageBook.rebalance

  const sleeves = [
    {
      id: 'equity' as const,
      label: 'Equity',
      icon: ChartNoAxesColumn,
      iconClass: 'rebalance__sleeve-icon--eq',
      currentValue: sleeveValues.equity.current,
      currentWeight: current.equity,
      impact: tradeImpact.equity,
      projectedValue: sleeveValues.equity.projected,
      projectedWeight: projected.equity,
      targetValue: sleeveValues.equity.target,
      targetWeight: target.equity,
      impactLabel: 'Trade impact',
    },
    {
      id: 'fixedIncome' as const,
      label: 'Fixed Income',
      icon: ChartNoAxesColumn,
      iconClass: 'rebalance__sleeve-icon--fi',
      currentValue: sleeveValues.fixedIncome.current,
      currentWeight: current.fixedIncome,
      impact: tradeImpact.fixedIncome,
      projectedValue: sleeveValues.fixedIncome.projected,
      projectedWeight: projected.fixedIncome,
      targetValue: sleeveValues.fixedIncome.target,
      targetWeight: target.fixedIncome,
      impactLabel: 'Trade impact',
    },
    {
      id: 'cash' as const,
      label: 'Cash',
      icon: WalletCards,
      iconClass: 'rebalance__sleeve-icon--cash',
      currentValue: sleeveValues.cash.current,
      currentWeight: current.cash,
      impact: metrics.netCash,
      projectedValue: sleeveValues.cash.projected,
      projectedWeight: projected.cash,
      targetValue: sleeveValues.cash.target,
      targetWeight: target.cash,
      impactLabel: 'Net cash change',
    },
  ]

  return (
    <div className="rebalance">
      <header className="rebalance__intro">
        <div>
          <p className="rebalance__eyebrow">Rebalance command center</p>
          <h3 className="rebalance__title">{household}</h3>
          <p className="rebalance__lede">Review and edit proposed trades across {accountsInHousehold} accounts.</p>
        </div>
        <span className="rebalance__ready">Ready</span>
      </header>

      <section className="rebalance__alloc" aria-label="Allocation and cash">
        <div className="rebalance__alloc-head">
          <i className="rebalance__alloc-rail" aria-hidden="true" />
          <span className="rebalance__alloc-label">Allocation &amp; cash</span>
          <div className="rebalance__alloc-summary">
            {(
              [
                ['Equity', current.equity, projected.equity, target.equity],
                ['Fixed Income', current.fixedIncome, projected.fixedIncome, target.fixedIncome],
              ] as const
            ).map(([label, from, to, tgt]) => (
              <span key={label}>
                {label}
                <strong>{pct(from)}</strong>
                <ArrowRight size={10} aria-hidden="true" />
                <b className={`rebalance__tone--${varianceTone(to, tgt)}`}>{pct(to)}</b>
              </span>
            ))}
            <span>
              Cash
              <strong>{whole(sleeveValues.cash.current)}</strong>
              <ArrowRight size={10} aria-hidden="true" />
              <b className={`rebalance__tone--${cashTone(projected.cash, target.cash)}`}>{whole(sleeveValues.cash.projected)}</b>
            </span>
          </div>
          <span className="rebalance__alloc-toggle" aria-hidden="true">
            Hide breakdown
            <ChevronDown size={12} />
          </span>
        </div>
        {sleeves.map((sleeve) => {
          const Icon = sleeve.icon
          const currentClass = sleeve.id === 'cash'
            ? cashTone(sleeve.currentWeight, sleeve.targetWeight)
            : varianceTone(sleeve.currentWeight, sleeve.targetWeight)
          const projectedClass = sleeve.id === 'cash'
            ? cashTone(sleeve.projectedWeight, sleeve.targetWeight)
            : varianceTone(sleeve.projectedWeight, sleeve.targetWeight)
          return (
            <div key={sleeve.id} className="rebalance__alloc-row">
              <span className="rebalance__alloc-name">
                <Icon size={11} className={sleeve.iconClass} aria-hidden="true" />
                {sleeve.label}
              </span>
              <Metric label="Current" value={whole(sleeve.currentValue)} sub={pct(sleeve.currentWeight)} tone={currentClass} />
              <Metric label={sleeve.impactLabel} value={signedWhole(sleeve.impact)} tone={impactTone(sleeve.impact)} />
              <Metric label="Projected" value={whole(sleeve.projectedValue)} sub={pct(sleeve.projectedWeight)} tone={projectedClass} />
              <Metric
                label="Target"
                value={whole(sleeve.targetValue)}
                sub={sleeve.id === 'cash' ? `${pct(sleeve.targetWeight)} reserve` : pct(sleeve.targetWeight)}
                tone="on"
              />
            </div>
          )
        })}
      </section>

      <div className="rebalance__sheet">
        <div className="rebalance__toolbar">
          <div>
            <h4>Trades by account</h4>
            <p>{metrics.trades} trades · {accountsInHousehold} accounts · tax in view</p>
          </div>
        </div>

        <div className="rebalance__metrics" aria-label="Rebalance summary">
          <div className="rebalance__metric">
            <TrendingUp size={13} aria-hidden="true" />
            <div>
              <span>Net cash change</span>
              <strong className={`rebalance__tone--${impactTone(metrics.netCash)}`}>{signedWhole(metrics.netCash)}</strong>
              <small>USD {signedWhole(metrics.usdNet)}</small>
            </div>
          </div>
          <div className="rebalance__metric">
            <ChartNoAxesColumn size={13} aria-hidden="true" />
            <div>
              <span>Total trades</span>
              <strong>{metrics.trades}</strong>
              <small>Across {accountsInHousehold} accounts</small>
            </div>
          </div>
          <div className="rebalance__metric">
            <ShoppingCart size={13} aria-hidden="true" />
            <div>
              <span>Buy orders</span>
              <strong className="rebalance__tone--on">{metrics.buys}</strong>
              <small>Generated</small>
            </div>
          </div>
          <div className="rebalance__metric">
            <Tag size={13} aria-hidden="true" />
            <div>
              <span>Sell orders</span>
              <strong className="rebalance__tone--off">{metrics.sells}</strong>
              <small>Generated</small>
            </div>
          </div>
        </div>

        {accounts.map((account) => (
          <section key={account.type} className="rebalance__account">
            <div className="rebalance__account-bar">
              <ChevronDown size={14} aria-hidden="true" />
              <i className="rebalance__account-swatch" style={{ background: account.color }} aria-hidden="true" />
              <strong style={{ color: account.color }}>{account.type}</strong>
              <em>·</em>
              <small>{account.id}</small>
              <span className="rebalance__account-value">
                Account value <b>{whole(account.value)}</b>
              </span>
              <span className="rebalance__account-count">{account.trades.length} trades</span>
              <span className="rebalance__account-cash">
                Available cash <b>{whole(account.cash)}</b>
              </span>
              <span className="rebalance__account-cash">
                Net change <b className={`rebalance__tone--${impactTone(account.net)}`}>{signedWhole(account.net)}</b>
              </span>
              <span className="rebalance__account-cash">
                Total after <b>{whole(account.cash + account.net)}</b>
              </span>
            </div>
            <div className="rebalance__grid">
              <div className="rebalance__head" aria-hidden="true">
                {columns.map((column) => (
                  <span key={column}>{column}</span>
                ))}
              </div>
              {account.trades.map((trade) => {
                const actionClass = trade.action === 'BUY' ? 'buy' : 'sell'
                const statusClass = trade.status === 'Ready' ? 'ready' : trade.status === 'Review' ? 'review' : 'off'
                return (
                  <article key={`${account.type}-${trade.ticker}-${trade.action}`} className="rebalance__row">
                    <div className="rebalance__ticker">{trade.ticker}</div>
                    <div className="rebalance__name">{trade.name}</div>
                    <div className="rebalance__cell">
                      <span className={`rebalance__pill rebalance__pill--${actionClass}`}>{trade.action}</span>
                    </div>
                    <div className={`rebalance__num rebalance__tone--${actionClass === 'buy' ? 'on' : 'off'}`}>
                      {signedShares(trade.qty)}
                    </div>
                    <div className="rebalance__pair">
                      <em>{shares(trade.sharesBefore)}</em>
                      <span>→</span>
                      <b className={`rebalance__tone--${actionClass === 'buy' ? 'on' : 'off'}`}>{shares(trade.sharesBefore + trade.qty)}</b>
                    </div>
                    <div className="rebalance__num rebalance__num--muted">{price(trade.price, trade.currency)}</div>
                    <div className={`rebalance__num rebalance__tone--${actionClass === 'buy' ? 'on' : 'off'}`}>
                      {signedWhole(trade.tradeValue)}
                    </div>
                    <div className={`rebalance__num ${trade.capitalGain >= 0 ? 'rebalance__tone--on' : 'rebalance__tone--off'}`}>
                      {whole(trade.capitalGain)}
                    </div>
                    <div className="rebalance__num rebalance__num--muted">{trade.deviation}</div>
                    <div className="rebalance__cell">
                      <span className={`rebalance__status rebalance__status--${statusClass}`}>{trade.status}</span>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

const Metric = ({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string
  sub?: string
  tone: string
}) => (
  <span className="rebalance__alloc-metric">
    <span>{label}</span>
    <strong className={`rebalance__tone--${tone}`}>{value}</strong>
    {sub ? <small className={`rebalance__tone--${tone}`}>· {sub}</small> : null}
  </span>
)
