import { stageBook } from '../../../data/stageBook'

const money = (value: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(value)

const pct = (value: number) => `${(value * 100).toFixed(1).replace(/\.0$/, '')}%`

export const RebalanceFrame = () => {
  const { current, target, projected, tradeImpact, metrics, accounts, household } = stageBook.rebalance
  return (
    <div className="scene-frame">
      <p className="scene-frame__title">Rebalance · {household}</p>
      <div className="scene-strip scene-strip--sleeves">
        <div>
          <span>Equity</span>
          <strong>{pct(current.equity)} → {pct(projected.equity)}</strong>
          <small>Target {pct(target.equity)} · {money(tradeImpact.equity)}</small>
        </div>
        <div>
          <span>Fixed Income</span>
          <strong>{pct(current.fixedIncome)} → {pct(projected.fixedIncome)}</strong>
          <small>Target {pct(target.fixedIncome)} · {money(tradeImpact.fixedIncome)}</small>
        </div>
        <div>
          <span>Cash</span>
          <strong>{pct(current.cash)} → {pct(projected.cash)}</strong>
          <small>Target {pct(target.cash)} · {money(tradeImpact.cash)}</small>
        </div>
      </div>
      <div className="scene-strip scene-strip--five">
        <div>
          <span>Net cash change</span>
          <strong>{money(metrics.netCash)}</strong>
        </div>
        <div>
          <span>Total trades</span>
          <strong>{metrics.trades}</strong>
        </div>
        <div>
          <span>Buy orders</span>
          <strong>{metrics.buys}</strong>
        </div>
        <div>
          <span>Sell orders</span>
          <strong>{metrics.sells}</strong>
        </div>
        <div>
          <span>Accounts</span>
          <strong>{accounts.length}</strong>
        </div>
      </div>
      {accounts.map((account) => (
        <section key={account.type} className="scene-account">
          <p className="scene-account__type">{account.type} · {money(account.value)}</p>
          <table className="scene-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Name</th>
                <th>Action</th>
                <th>Qty</th>
                <th>Trade value</th>
                <th>Capital gain</th>
                <th>Deviation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {account.trades.map((trade) => (
                <tr key={`${account.type}-${trade.ticker}-${trade.action}`}>
                  <td>{trade.ticker}</td>
                  <td>{trade.name}</td>
                  <td>{trade.action}</td>
                  <td>{trade.qty}</td>
                  <td>{money(trade.tradeValue)}</td>
                  <td>{money(trade.capitalGain)}</td>
                  <td>{trade.deviation}</td>
                  <td><span className="status-pill">{trade.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  )
}
