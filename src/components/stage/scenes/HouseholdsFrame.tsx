import { stageBook } from '../../../data/stageBook'
import { AllocationBars } from './AllocationBars'

const money = (value: number) =>
  value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, '')}M` : `$${Math.round(value / 1000)}k`

const pct = (value: number) => `${(value * 100).toFixed(1).replace(/\.0$/, '')}%`

export const HouseholdsFrame = () => (
  <div className="library">
    <header className="library__intro">
      <p className="library__eyebrow">Household library</p>
      <h3 className="library__title">Household Library</h3>
      <p className="library__lede">Review the highest-drift households and move directly into rebalance.</p>
    </header>

    <div className="library__strip" aria-label="Household summary">
      <div className="library__metric library__metric--accent">
        <i className="library__accent library__accent--risk" aria-hidden="true" />
        <div>
          <span>At risk</span>
          <strong>{stageBook.strip.atRisk}</strong>
        </div>
      </div>
      <div className="library__metric library__metric--accent">
        <i className="library__accent library__accent--review" aria-hidden="true" />
        <div>
          <span>Review</span>
          <strong>{stageBook.strip.review}</strong>
        </div>
      </div>
      <div className="library__metric library__metric--accent">
        <i className="library__accent library__accent--target" aria-hidden="true" />
        <div>
          <span>On target</span>
          <strong>{stageBook.strip.onTarget}</strong>
        </div>
      </div>
      <div className="library__metric">
        <span>Households</span>
        <strong>{stageBook.strip.households}</strong>
      </div>
      <div className="library__metric">
        <span>Total AUM</span>
        <strong>{money(stageBook.strip.totalAum)}</strong>
      </div>
    </div>

    <div className="library__queue">
      <div className="library__toolbar">
        <div>
          <h4>All households</h4>
          <p>{stageBook.strip.households} households · Sorted by highest absolute drift</p>
        </div>
        <div className="library__filters" aria-hidden="true">
          <span className="library__search">Search households</span>
          <span className="library__control">Highest drift</span>
          <span className="library__control"><b>DRIFT BANDS</b> 0.5% / 1%</span>
          <span className="library__control">All IAs (1)</span>
          <span className="library__rebalance">Rebalance households in view</span>
        </div>
      </div>

      <div className="library__grid" role="list">
        <div className="library__head" aria-hidden="true">
          <span>Household</span>
          <span>Actions</span>
          <span>Models</span>
          <span>Allocation</span>
          <span>Accts</span>
          <span>AUM</span>
          <span>Drift</span>
          <span>Status</span>
        </div>
        {stageBook.households.map((row) => (
          <article key={row.name} className="library__row" role="listitem">
            <i className="library__rail" aria-hidden="true" />
            <div className="library__household">
              <strong>{row.name}</strong>
              <small>{row.code} · Open rebalance workspace</small>
            </div>
            <div className="library__actions">
              <span className="library__action library__action--primary">Rebalance</span>
              <span className="library__action">Overview</span>
              <span className="library__action">Holdings</span>
              <span className="library__action library__action--quiet">Note</span>
            </div>
            <div className="library__models">
              <span><b>EQ</b> {row.equityModel}</span>
              <span><b>FI</b> {row.fixedIncomeModel}</span>
            </div>
            <AllocationBars target={row.target} current={row.current} />
            <div className="library__num">{row.accounts}</div>
            <div className="library__num">{money(row.aum)}</div>
            <div className="library__drift">
              <strong>{pct(row.drift)}</strong>
              <small><em>EQ</em> {pct(row.equityDrift)}</small>
              <small><em>FI</em> {pct(row.fixedIncomeDrift)}</small>
            </div>
            <div className="library__status">
              <span>{row.status}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  </div>
)
