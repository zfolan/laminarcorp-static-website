import { TriangleAlert } from 'lucide-react'
import { stageBook } from '../../../data/stageBook'

const compact = (value: number) =>
  value >= 1_000_000
    ? `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`
    : `$${Math.round(value / 1000)}k`

const pct = (value: number) => `${(value * 100).toFixed(1).replace(/\.0$/, '')}%`

const signedPct = (value: number) => `${value >= 0 ? '+' : '−'}${pct(Math.abs(value))}`

const shares = (value: number) => value.toLocaleString('en-CA')

const cost = (value: number) =>
  Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`

const barWidth = (value: number, max: number) =>
  value === 0 ? '2px' : `${Math.min(100, Math.max(3, (value / max) * 100))}%`

const sectorChip = (drift: number) => {
  const abs = Math.abs(drift)
  if (abs <= 0.01) return 'on'
  if (abs <= 0.03) return 'review'
  return 'off'
}

const holdingColumns = ['Security', 'Account', 'Shares', 'Avg cost', 'Book value', 'Sleeve %', 'Model target %', 'Drift', 'Status'] as const

export const AnalyticsFrame = () => {
  const {
    household,
    total,
    holdingsCount,
    sleeves,
    drift,
    sectors,
    currency,
    currencySleeves,
    holdings,
    largest,
  } = stageBook.analytics
  const maxAlignment = Math.max(...sectors.flatMap((row) => [row.current, row.model]))
  const impact = holdings.find((row) => row.status === 'Off Model') ?? holdings[0]

  return (
    <div className="overview">
      <header className="overview__intro">
        <div>
          <p className="overview__eyebrow">Household overview</p>
          <h3 className="overview__title">{household}</h3>
          <p className="overview__lede">Allocation, exposure and model alignment across the household.</p>
        </div>
        <span className="overview__drift">
          <TriangleAlert size={11} aria-hidden="true" />
          {pct(drift)} model drift
        </span>
      </header>

      <div className="overview__strip" aria-label="Portfolio summary">
        <div className="overview__metric overview__metric--total">
          <span>Total value</span>
          <strong>{compact(total)}</strong>
          <small>{holdingsCount} holdings</small>
        </div>
        <div className="overview__metric overview__metric--eq">
          <span>Equity</span>
          <strong>{compact(sleeves.equity.value)} · {pct(sleeves.equity.weight)}</strong>
          <small>Target {pct(sleeves.equity.target)}</small>
        </div>
        <div className="overview__metric overview__metric--fi">
          <span>Fixed income</span>
          <strong>{compact(sleeves.fixedIncome.value)} · {pct(sleeves.fixedIncome.weight)}</strong>
          <small>Target {pct(sleeves.fixedIncome.target)}</small>
        </div>
        <div className="overview__metric overview__metric--cash">
          <span>Cash</span>
          <strong>{compact(sleeves.cash.value)} · {pct(sleeves.cash.weight)}</strong>
          <small>Target {pct(sleeves.cash.target)}</small>
        </div>
        <div className="overview__metric overview__metric--off">
          <span>Off model</span>
          <strong>{compact(sleeves.offModel.value)} · {pct(sleeves.offModel.weight)}</strong>
          <small>{sleeves.offModel.count} holdings</small>
        </div>
      </div>

      <div className="overview__section">
        <h4>Model alignment, exposure &amp; holdings drift</h4>
        <i />
      </div>

      <div className="overview__deck">
        <article className="overview__card">
          <header className="overview__card-head">
            <div>
              <h5>Sector Allocation Drift</h5>
              <p>Current equity sectors against the assigned model</p>
            </div>
            <div className="overview__legend" aria-hidden="true">
              <span className="overview__legend-item overview__legend-item--current">Current</span>
              <span className="overview__legend-item overview__legend-item--model">Model</span>
            </div>
          </header>
          <div className="overview__sectors" role="region" tabIndex={0} aria-label="Illustrative sector allocation drift">
            <div className="overview__sectors-head" aria-hidden="true">
              <span>Sector</span>
              <span>Weight comparison</span>
              <span>Current</span>
              <span>Model</span>
              <span>Drift</span>
            </div>
            {sectors.map((row) => (
              <div key={row.name} className="overview__sector">
                <span className="overview__sector-name" style={{ color: row.color }}>{row.name}</span>
                <span className="overview__bars" aria-hidden="true">
                  <i className="overview__bar overview__bar--current" style={{ width: barWidth(row.current, maxAlignment) }} />
                  <i className="overview__bar overview__bar--model" style={{ width: barWidth(row.model, maxAlignment) }} />
                </span>
                <span className="overview__num">{pct(row.current)}</span>
                <span className="overview__num overview__num--model">{pct(row.model)}</span>
                <span className="overview__cell">
                  <span className={`overview__chip overview__chip--${sectorChip(row.drift)}`}>{signedPct(row.drift)}</span>
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="overview__card">
          <header className="overview__card-head">
            <div>
              <h5>Currency exposure</h5>
              <p>Market value by trading currency</p>
            </div>
            <span className="overview__count">2 currencies</span>
          </header>
          <div className="overview__currency">
            <div className="overview__currency-track" role="img" aria-label={`Currency exposure: CAD ${pct(currency.cad)}, USD ${pct(currency.usd)}`}>
              <i className="overview__currency-fill overview__currency-fill--cad" style={{ width: pct(currency.cad) }} />
              <i className="overview__currency-fill overview__currency-fill--usd" style={{ width: pct(currency.usd) }} />
            </div>
            <div className="overview__currency-row">
              <i className="overview__swatch overview__swatch--cad" aria-hidden="true" />
              <b>CAD</b>
              <span>{compact(currency.cadValue)}</span>
              <em className="overview__weight--cad">{pct(currency.cad)}</em>
            </div>
            <div className="overview__currency-row">
              <i className="overview__swatch overview__swatch--usd" aria-hidden="true" />
              <b>USD</b>
              <span>{compact(currency.usdValue)}</span>
              <em className="overview__weight--usd">{pct(currency.usd)}</em>
            </div>
            <p className="overview__sleeve-label">Currency by sleeve</p>
            {currencySleeves.map((sleeve) => (
              <section key={sleeve.id} className="overview__sleeve">
                <div className="overview__sleeve-head">
                  <span className={`overview__badge overview__badge--${sleeve.id.toLowerCase()}`}>{sleeve.id}</span>
                  <span>{sleeve.label}</span>
                  <strong>{compact(sleeve.total)}</strong>
                </div>
                <div className="overview__currency-track overview__currency-track--thin" aria-hidden="true">
                  <i className="overview__currency-fill overview__currency-fill--cad" style={{ width: pct(sleeve.cad) }} />
                  {sleeve.usd > 0 ? <i className="overview__currency-fill overview__currency-fill--usd" style={{ width: pct(sleeve.usd) }} /> : null}
                </div>
                <div className="overview__sleeve-mix">
                  <span><i className="overview__swatch overview__swatch--cad" /> CAD <em className="overview__weight--cad">{pct(sleeve.cad)}</em></span>
                  {sleeve.usd > 0 ? <span><i className="overview__swatch overview__swatch--usd" /> USD <em className="overview__weight--usd">{pct(sleeve.usd)}</em></span> : null}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>

      <div className="overview__deck overview__deck--holdings">
        <article className="overview__card">
          <header className="overview__card-head">
            <div>
              <h5>Selected holdings</h5>
              <p>Selected holdings from the illustrative portfolio</p>
            </div>
          </header>
          <div className="overview__holdings-summary">
            <span>Household drift <b>{pct(drift)}</b></span>
            <span>Off model <b>{sleeves.offModel.count} · {compact(sleeves.offModel.value)}</b></span>
            <span>Largest impact <b>{impact.ticker} · {impact.sleeve} · {signedPct(impact.drift)}</b></span>
          </div>
          <div className="overview__grid" role="region" tabIndex={0} aria-label="Selected illustrative holdings">
            <div className="overview__head" aria-hidden="true">
              {holdingColumns.map((column) => (
                <span key={column}>{column}</span>
              ))}
            </div>
            {holdings.map((row) => (
              <article key={`${row.ticker}-${row.account}`} className="overview__row">
                <div className="overview__security">
                  <b>{row.ticker}</b>
                  <span className={`overview__badge overview__badge--${row.sleeve.toLowerCase()}`}>{row.sleeve}</span>
                  <small>{row.name}</small>
                </div>
                <div className="overview__muted">{row.account}</div>
                <div className="overview__num">{shares(row.shares)}</div>
                <div className="overview__num">{cost(row.avgCost)}</div>
                <div className="overview__num">{compact(row.bookValue)}</div>
                <div className="overview__num">{pct(row.weight)}</div>
                <div className="overview__num overview__num--model">
                  {row.sleeve === 'FI' ? `${pct(sleeves.fixedIncome.weight)} → ${pct(row.modelTarget)}` : row.modelTarget === 0 ? '—' : pct(row.modelTarget)}
                </div>
                <div className={`overview__num overview__tone--${row.status === 'Off Model' ? 'off' : 'review'}`}>{signedPct(row.drift)}</div>
                <div className="overview__cell">
                  <span className={`overview__status overview__status--${row.status === 'Off Model' ? 'off' : 'review'}`}>{row.status}</span>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="overview__card">
          <header className="overview__card-head">
            <div>
              <h5>Largest exposures</h5>
              <p>Top holdings by market value</p>
            </div>
          </header>
          <div className="overview__exposures" role="region" tabIndex={0} aria-label="Illustrative largest exposures">
            <div className="overview__exposures-head" aria-hidden="true">
              <span>Security</span>
              <span>Market value</span>
              <span>Household %</span>
            </div>
            {largest.map((row) => (
              <div key={row.ticker} className="overview__exposure">
                <div className="overview__security">
                  <b>{row.ticker}</b>
                  <small>{row.name}</small>
                </div>
                <div className="overview__num overview__num--muted">{compact(row.value)}</div>
                <div className="overview__num overview__num--model">{pct(row.weight)}</div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
