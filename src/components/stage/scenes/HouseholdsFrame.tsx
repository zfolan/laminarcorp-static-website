import { stageBook } from '../../../data/stageBook'
import { AllocationBars } from './AllocationBars'

const money = (value: number) =>
  value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, '')}M` : `$${Math.round(value / 1000)}k`

const pct = (value: number) => `${(value * 100).toFixed(1).replace(/\.0$/, '')}%`

export const HouseholdsFrame = () => (
  <div className="scene-frame">
    <p className="scene-frame__title">Household Library</p>
    <div className="scene-strip scene-strip--five">
      <div>
        <span>At Risk</span>
        <strong>{stageBook.strip.atRisk}</strong>
      </div>
      <div>
        <span>Review</span>
        <strong>{stageBook.strip.review}</strong>
      </div>
      <div>
        <span>On Target</span>
        <strong>{stageBook.strip.onTarget}</strong>
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
          <th>Actions</th>
          <th>Models</th>
          <th>Allocation</th>
          <th>Accts</th>
          <th>AUM</th>
          <th>Drift</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {stageBook.households.map((row) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>
              <span className="scene-chip">Rebalance</span>
              <span className="scene-chip">Overview</span>
              <span className="scene-chip">Holdings</span>
            </td>
            <td>
              <div>EQ {row.equityModel}</div>
              <div>FI {row.fixedIncomeModel}</div>
            </td>
            <td><AllocationBars target={row.target} current={row.current} /></td>
            <td>{row.accounts}</td>
            <td>{money(row.aum)}</td>
            <td>{pct(row.drift)}</td>
            <td><span className="status-pill">{row.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
