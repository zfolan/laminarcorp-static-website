import { stageBook } from '../../../data/stageBook'

const money = (value: number) => `C$${value.toLocaleString('en-CA')}`

export const ProposalsFrame = () => {
  const { investmentAmount, client } = stageBook.proposal
  const { target, equityModel, fixedIncomeModel } = stageBook.featured
  const cash = investmentAmount * target.cash

  return (
    <div className="proposals__frame">
      <header className="proposals__header">
        <div>
          <p className="proposals__eyebrow">Client documents</p>
          <h3>Proposals &amp; reports</h3>
          <p className="proposals__lede">A considered proposal. A clear record of what changed.</p>
        </div>
        <span className="proposals__status">Draft preview</span>
      </header>

      <div className="proposals__studio">
        <aside className="proposals__details" aria-label="Document details">
          <h4>Document details</h4>
          <dl>
            <div><dt>Client</dt><dd>{client}</dd></div>
            <div><dt>Document</dt><dd>Investment proposal</dd></div>
            <div><dt>Investment amount</dt><dd className="proposals__amount">{money(investmentAmount)}</dd></div>
            <div><dt>Equity model</dt><dd>{equityModel}</dd></div>
            <div><dt>Fixed-income model</dt><dd>{fixedIncomeModel}</dd></div>
          </dl>
          <p className="proposals__note">Advisor note: A household-aligned allocation for new capital.</p>
          <p className="proposals__context">New-investment illustration · separate from the existing household portfolio.</p>
        </aside>

        <div className="proposals__preview">
          <article className="proposals__document" aria-label="Investment proposal cover excerpt">
            <header className="proposals__document-header">
              <strong>Example Advisory</strong>
              <p>PROPOSAL<br /><time dateTime="2026-10-01">01 Oct 2026</time></p>
            </header>
            <h4>Investment proposal</h4>
            <p className="proposals__prepared">Prepared for {client}</p>
            <dl className="proposals__facts">
              <div><dt>Investment amount</dt><dd>{money(investmentAmount)}</dd></div>
              <div><dt>Proposed investment</dt><dd>{money(investmentAmount - cash)}</dd></div>
              <div><dt>Remaining cash</dt><dd>{money(cash)}</dd></div>
            </dl>
            <section className="proposals__allocation" aria-label="Proposed allocation in Canadian dollars">
              <h5>Proposed allocation · CAD</h5>
              {([
                ['equity', 'Equity'],
                ['fixedIncome', 'Fixed income'],
                ['cash', 'Cash'],
              ] as const).map(([key, label]) => (
                <div className="proposals__allocation-row" key={key}>
                  <div><span>{label}</span><strong>{target[key] * 100}%</strong></div>
                  <div className="proposals__track" aria-hidden="true">
                    <span className={`proposals__bar proposals__bar--${key}`} style={{ width: `${target[key] * 100}%` }} />
                  </div>
                </div>
              ))}
            </section>
            <p className="proposals__disclosure">Review the proposed holdings with your advisor before authorizing any investment.</p>
            <footer>For discussion · not a trade confirmation</footer>
          </article>
        </div>
      </div>
    </div>
  )
}
