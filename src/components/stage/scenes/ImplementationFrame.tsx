import { stageBook } from '../../../data/stageBook'

const money = (value: number) => `C$${value.toLocaleString('en-CA')}`
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })

export const ImplementationFrame = () => {
  const { events } = stageBook.implementation
  const { investmentAmount, client } = stageBook.proposal

  return (
    <div className="implementation__frame">
      <header className="implementation__header">
        <div>
          <p className="implementation__eyebrow">Deployment Center</p>
          <h3>{client} — Cash deployment</h3>
          <p className="implementation__lede">New-cash deployment illustration · no events implemented.</p>
        </div>
        <span className="implementation__status">Active</span>
      </header>

      <ol className="implementation__lifecycle" aria-label="Deployment lifecycle">
        <li><span>01</span> Configure</li>
        <li><span>02</span> Review &amp; approve</li>
        <li aria-current="step"><span>03</span> Deploy</li>
      </ol>

      <dl className="implementation__summary">
        <div><dt>Closed events</dt><dd>0 of {events.length} <small>advisor-confirmed</small></dd></div>
        <div><dt>Remaining mandate</dt><dd>{money(investmentAmount)}</dd></div>
        <div><dt>Pacing</dt><dd>Custom schedule</dd></div>
      </dl>

      <div className="implementation__workspace">
        <section className="implementation__schedule" aria-labelledby="implementation-schedule-title">
          <header><p className="implementation__eyebrow">Event queue</p><h4 id="implementation-schedule-title">Scheduled deployment order</h4></header>
          <table className="implementation__table" role="table">
            <caption>Example schedule · dates and amounts are illustrative</caption>
            <thead role="rowgroup">
              <tr role="row">
                <th scope="col" role="columnheader">Event</th>
                <th scope="col" role="columnheader">Target date</th>
                <th scope="col" role="columnheader">Weight</th>
                <th scope="col" role="columnheader">Release estimate</th>
                <th scope="col" role="columnheader">Status</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {events.map(({ event, date, weight, releaseEstimate, status }) => (
                <tr key={event} role="row">
                  <th scope="row" role="rowheader"><span className="implementation__cell-label" aria-hidden="true">Event</span><span>{String(event).padStart(2, '0')}</span></th>
                  <td role="cell"><span className="implementation__cell-label" aria-hidden="true">Target date</span><time dateTime={date}>{dateFormat.format(new Date(`${date}T00:00:00Z`))}</time></td>
                  <td role="cell"><span className="implementation__cell-label" aria-hidden="true">Weight</span><span>{weight * 100}%</span></td>
                  <td role="cell"><span className="implementation__cell-label" aria-hidden="true">Release estimate</span><span>{money(releaseEstimate)}</span></td>
                  <td role="cell"><span className="implementation__cell-label" aria-hidden="true">Status</span><span className="implementation__scheduled">{status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="implementation__action" aria-label="Current action and generation gates">
          <section>
            <h4>Current action</h4>
            <p>Start Event {String(events[0].event).padStart(2, '0')} when the scheduled date and household inputs are ready.</p>
          </section>
          <section className="implementation__gates">
            <h4>Generation gates</h4>
            <ul>
              <li>Household snapshot</li>
              <li>Account policy</li>
              <li>Model mandate</li>
              <li>Event budget</li>
            </ul>
          </section>
        </aside>
      </div>
      <p className="implementation__disclosure">Each event generates fresh proposed trades from the current household snapshot. Review, validate and export; reconcile and confirm the event after implementation.</p>
    </div>
  )
}
