import { stageBook } from '../../../data/stageBook'

const money = (value: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(value)

const pct = (value: number) => `${(value * 100).toFixed(1).replace(/\.0$/, '')}%`

export const RebalanceFrame = () => {
  const { current, target, tradeImpact, accounts } = stageBook.rebalance
  return (
    <div className="scene-frame">
      <p className="scene-frame__title">Rebalance · {stageBook.rebalance.household}</p>
      <div className="scene-strip scene-strip--sleeves">
        <div>
          <span>Equity</span>
          <strong>{pct(current.equity)} → {pct(target.equity)}</strong>
          <small>{money(tradeImpact.equity)}</small>
        </div>
        <div>
          <span>Fixed Income</span>
          <strong>{pct(current.fixedIncome)} → {pct(target.fixedIncome)}</strong>
          <small>{money(tradeImpact.fixedIncome)}</small>
        </div>
        <div>
          <span>Cash</span>
          <strong>{pct(current.cash)} → {pct(target.cash)}</strong>
          <small>{money(tradeImpact.cash)}</small>
        </div>
      </div>
      {accounts.map((account) => (
        <section key={account.type} className="scene-account">
          <p className="scene-account__type">{account.type}</p>
          <table className="scene-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Action</th>
                <th>Qty</th>
                <th>Trade value</th>
                <th>Capital gain</th>
              </tr>
            </thead>
            <tbody>
              {account.trades.map((trade) => (
                <tr key={`${account.type}-${trade.ticker}-${trade.action}`}>
                  <td>{trade.ticker}</td>
                  <td>{trade.action}</td>
                  <td>{trade.qty}</td>
                  <td>{money(trade.tradeValue)}</td>
                  <td>{money(trade.capitalGain)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  )
}
