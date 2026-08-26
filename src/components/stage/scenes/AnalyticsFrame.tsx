import { stageBook } from '../../../data/stageBook'

const money = (value: number) =>
  value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, '')}M` : `$${Math.round(value / 1000)}k`

const pct = (value: number) => `${(value * 100).toFixed(1).replace(/\.0$/, '')}%`

const signedPct = (value: number) => `${value >= 0 ? '+' : ''}${pct(value)}`

export const AnalyticsFrame = () => {
  const { household, total, sleeves, drift, sectors, currency } = stageBook.analytics
  return (
    <div className="scene-frame">
      <p className="scene-frame__title">Household Overview</p>
      <p className="scene-household-name">{household}</p>
      <div className="scene-strip">
        <div>
          <span>Total value</span>
          <strong>{money(total)}</strong>
        </div>
        <div>
          <span>Equity</span>
          <strong>{money(sleeves.equity.value)} · {pct(sleeves.equity.weight)}</strong>
        </div>
        <div>
          <span>Fixed income</span>
          <strong>{money(sleeves.fixedIncome.value)} · {pct(sleeves.fixedIncome.weight)}</strong>
        </div>
        <div>
          <span>Cash</span>
          <strong>{money(sleeves.cash.value)} · {pct(sleeves.cash.weight)}</strong>
        </div>
        <div>
          <span>Off model</span>
          <strong>{money(sleeves.offModel.value)} · {pct(sleeves.offModel.weight)}</strong>
        </div>
        <div>
          <span>Model drift</span>
          <strong>{pct(drift)}</strong>
        </div>
      </div>
      <div className="scene-panels">
        <section>
          <p className="scene-account__type">Sector allocation drift</p>
          <table className="scene-table">
            <thead>
              <tr>
                <th>Sector</th>
                <th>Current</th>
                <th>Model</th>
                <th>Drift</th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((sector) => (
                <tr key={sector.name}>
                  <td>{sector.name}</td>
                  <td>{pct(sector.current)}</td>
                  <td>{pct(sector.model)}</td>
                  <td>{signedPct(sector.drift)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <p className="scene-account__type">Currency exposure</p>
          <table className="scene-table">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Weight</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CAD</td>
                <td>{pct(currency.cad)}</td>
                <td>{money(currency.cadValue)}</td>
              </tr>
              <tr>
                <td>USD</td>
                <td>{pct(currency.usd)}</td>
                <td>{money(currency.usdValue)}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
