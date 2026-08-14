import { exceptionQueue, proposedTrades, sampleHousehold } from '../data/samplePortfolio'

const AllocationBand = ({ equity, fixed, cash, label }: { equity: number; fixed: number; cash: number; label: string }) => (
  <div className="allocation-row">
    <div className="allocation-row__label"><span>{label}</span><small>{equity} / {fixed} / {cash}</small></div>
    <div className="allocation-band" aria-label={`${label}: ${equity}% equity, ${fixed}% fixed income, ${cash}% cash`}>
      <i className="allocation-equity" style={{ width: `${equity}%` }} />
      <i className="allocation-fixed" style={{ width: `${fixed}%` }} />
      <i className="allocation-cash" style={{ width: `${cash}%` }} />
    </div>
  </div>
)

export const HouseholdVisual = () => (
  <div className="product-frame household-visual">
    <div className="product-frame__bar"><span>MERIDIAN HOUSEHOLD</span><span>COORDINATED VIEW</span></div>
    <div className="household-visual__body">
      <div className="account-stack">
        {sampleHousehold.accounts.map((account) => (
          <div className="account-row" key={account.id}>
            <span><b>{account.name}</b><small>{account.id} · {account.registration}</small></span>
            <em>{account.currency}</em>
            <strong>{account.value}</strong>
          </div>
        ))}
      </div>
      <div className="convergence" aria-hidden="true"><i /><i /><i /><i /><b /></div>
      <div className="household-summary">
        <span>COMPLETE HOUSEHOLD</span>
        <strong>{sampleHousehold.value}</strong>
        <p>{sampleHousehold.model}</p>
        <AllocationBand equity={75} fixed={22} cash={3} label="Current allocation" />
        <div className="summary-stats"><span><small>ACCOUNTS</small>04</span><span><small>CURRENCIES</small>CAD / USD</span><span><small>MODEL DRIFT</small>4.8%</span></div>
      </div>
    </div>
  </div>
)

export const RebalanceVisual = () => (
  <div className="product-frame rebalance-visual">
    <div className="product-frame__bar"><span>PROPOSED HOUSEHOLD CHANGES</span><span>REVIEW 02 / READY 02</span></div>
    <div className="allocation-comparison">
      <AllocationBand equity={75} fixed={22} cash={3} label="Current household" />
      <AllocationBand equity={70} fixed={27} cash={3} label="Target model" />
    </div>
    <div className="trade-table" role="table" aria-label="Fictional proposed trades">
      <div className="trade-table__head" role="row"><span>ACTION</span><span>SECURITY</span><span>ACCOUNT</span><span>AMOUNT</span><span>STATE</span></div>
      {proposedTrades.map((trade) => (
        <div className="trade-table__row" role="row" key={`${trade.ticker}-${trade.account}`}>
          <span className={trade.side === 'Buy' ? 'positive' : 'review'}>{trade.side}</span>
          <span><b>{trade.ticker}</b><small>{trade.security}</small></span>
          <span>{trade.account}</span><span>{trade.amount}</span>
          <span className={trade.status === 'Ready' ? 'positive' : 'review'}>{trade.status}</span>
        </div>
      ))}
    </div>
  </div>
)

export const TaxLocationVisual = () => (
  <div className="product-frame location-visual">
    <div className="product-frame__bar"><span>IMPLEMENTATION CONTEXT</span><span>HOUSEHOLD / 0248</span></div>
    <div className="location-matrix">
      <div className="matrix-heading"><span>PROPOSED CHANGE</span><span>REGISTERED</span><span>NON-REGISTERED</span><span>USD</span></div>
      {[
        ['Increase fixed income', 'Available room', 'Gain considered', 'Currency mismatch'],
        ['Reduce concentration', '—', 'Estimated gain', '—'],
        ['Use available cash', '$41,200 CAD', '$28,800 CAD', 'US$19,400'],
      ].map((row) => <div className="matrix-row" key={row[0]}>{row.map((cell, index) => <span key={`${index}-${cell}`} className={cell.includes('mismatch') || cell.includes('gain') || cell.includes('Gain') ? 'review' : index ? '' : 'matrix-label'}>{cell}</span>)}</div>)}
    </div>
    <div className="context-note"><span>ACCOUNT LOCATION</span><p>Account registration, available cash, currency, and gain context remain visible as the implementation plan is reviewed.</p></div>
  </div>
)

export const ExceptionVisual = () => (
  <div className="product-frame exception-visual">
    <div className="product-frame__bar"><span>EXCEPTION REVIEW</span><span>03 REQUIRE JUDGMENT</span></div>
    <div className="exception-list">
      {exceptionQueue.map((exception) => <div className={`exception-row exception-row--${exception.tone}`} key={exception.title}><span className="exception-type">{exception.type}</span><span><b>{exception.title}</b><small>{exception.detail}</small></span><strong>{exception.value}</strong><button type="button" aria-label={`Review ${exception.title}`}>Review <span aria-hidden="true">→</span></button></div>)}
    </div>
    <div className="routine-strip"><span>05 routine recommendations</span><span className="positive">Ready to continue</span></div>
  </div>
)

export const ReviewVisual = () => (
  <div className="product-frame review-visual">
    <div className="product-frame__bar"><span>PORTFOLIO-MANAGER REVIEW</span><span>VERSION 03</span></div>
    <div className="review-grid">
      <div className="review-primary">
        <span className="mono-label">PROPOSED CHANGE / NR-2901</span>
        <div className="review-change"><h3>Sell Northfield Equity</h3><strong>$86,000</strong></div>
        <p>Reduce household concentration while moving the complete portfolio toward its target allocation.</p>
        <div className="review-context"><span>REVIEW CONTEXT</span><b>Estimated taxable gain</b><strong>$14,820</strong></div>
        <div className="review-actions"><button type="button" className="button button--quiet">Modify</button><button type="button" className="button button--primary">Approve recommendation</button></div>
      </div>
      <aside className="review-summary">
        <span className="mono-label">HOUSEHOLD SUMMARY</span>
        <dl><div><dt>Proposed trades</dt><dd>08</dd></div><div><dt>Ready</dt><dd className="positive">05</dd></div><div><dt>Exceptions resolved</dt><dd>03</dd></div><div><dt>Final approver</dt><dd>Portfolio manager</dd></div></dl>
      </aside>
    </div>
  </div>
)
