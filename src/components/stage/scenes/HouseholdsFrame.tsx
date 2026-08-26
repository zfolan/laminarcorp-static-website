import { stageBook, type HouseholdRow } from '../../../data/stageBook'

const money = (value: number) =>
  value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, '')}M` : `$${Math.round(value / 1000)}k`

const pct = (value: number) => `${(value * 100).toFixed(1).replace(/\.0$/, '')}%`

const sleeve = (row: HouseholdRow) =>
  `EQ ${pct(row.target.equity)} / ${pct(row.current.equity)}`

export const HouseholdsFrame = () => (
  <div className="scene-frame">
    <p className="scene-frame__title">Household Library</p>
    <div className="scene-strip">
      <div>
        <span>At Risk</span>
        <strong>{stageBook.strip.atRisk}</strong>
      </div>
      <div>
        <span>Households</span>
        <strong>{stageBook.strip.households}</strong>
      </div>
      <div>
        <span>Total AUM</span>
        <strong>{money(stageBook.strip.totalAum)}</strong>
      </div>
    </div>
    <table className="scene-table">
      <thead>
        <tr>
          <th>Household</th>
          <th>Target / Current</th>
          <th>AUM</th>
          <th>Drift</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {stageBook.households.map((row) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>{sleeve(row)}</td>
            <td>{money(row.aum)}</td>
            <td>{pct(row.drift)}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
