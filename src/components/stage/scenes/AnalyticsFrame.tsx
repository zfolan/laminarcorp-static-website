import { stageBook } from '../../../data/stageBook'

const money = (value: number) =>
  value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, '')}M` : `$${Math.round(value / 1000)}k`

const pct = (value: number) => `${(value * 100).toFixed(1).replace(/\.0$/, '')}%`

const signedPct = (value: number) => `${value >= 0 ? '+' : ''}${pct(value)}`

export const AnalyticsFrame = () => {
  const { household, total, sleeves, drift, sectors, currency, holdings = [], largest = [] } = stageBook.analytics
  return (
    <div className="scene-frame">
      <div className="scene-overview-head">
        <p className="scene-household-name">{household}</p>
        <span className="status-pill">{pct(drift)} model drift</span>
      </div>
      <div className="scene-strip scene-strip--five">
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
      </div>
      <div className="scene-panels">
        <section>
          <p className="scene-account__type">Sector allocation drift</p>
          {sectors.map((sector) => (
            <div className="sector-row" key={sector.name}>
              <span>{sector.name}</span>
              <div className="sector-row__bars" aria-hidden="true">
                <i className="sector-row__current" style={{ width: pct(Math.abs(sector.current)) }} />
                <i className="sector-row__model" style={{ width: pct(Math.abs(sector.model)) }} />
              </div>
              <small>{pct(sector.current)} / {pct(sector.model)}</small>
              <b>{signedPct(sector.drift)}</b>
            </div>
          ))}
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
          <p className="scene-account__type">Largest holdings</p>
          <table className="scene-table">
            <thead>
              <tr>
                <th>Security</th>
                <th>Value</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {largest.map((row) => (
                <tr key={row.ticker}>
                  <td>{row.ticker} {row.name}</td>
                  <td>{money(row.value)}</td>
                  <td>{pct(row.weight)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <p className="scene-account__type">Holdings drift</p>
      <table className="scene-table">
        <thead>
          <tr>
            <th>Security</th>
            <th>Sleeve</th>
            <th>Account</th>
            <th>Weight</th>
            <th>Drift</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((row) => (
            <tr key={`${row.ticker}-${row.account}`}>
              <td>{row.ticker} {row.name}</td>
              <td>{row.sleeve}</td>
              <td>{row.account}</td>
              <td>{pct(row.weight)}</td>
              <td>{signedPct(row.drift)}</td>
              <td><span className="status-pill">{row.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
