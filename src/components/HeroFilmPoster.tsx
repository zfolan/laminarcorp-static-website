import { sampleHousehold } from '../data/samplePortfolio'

export const HeroFilmPoster = () => (
  <div className="film-poster" role="img" aria-label="Several accounts coordinated into one household portfolio and a reviewable implementation plan">
    <div className="film-poster__topline">
      <span>HOUSEHOLD / 0248</span>
      <span className="status-dot">Ready for review</span>
    </div>
    <div className="film-poster__grid">
      <div className="film-poster__accounts">
        <p>4 coordinated accounts</p>
        {sampleHousehold.accounts.map((account, index) => (
          <div className="poster-account" key={account.id} style={{ '--row': index } as React.CSSProperties}>
            <span>{account.name}</span>
            <small>{account.id} · {account.currency}</small>
            <b>{account.value}</b>
          </div>
        ))}
      </div>
      <div className="poster-spine" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      <div className="film-poster__decision">
        <p>ONE HOUSEHOLD PORTFOLIO</p>
        <strong>{sampleHousehold.value}</strong>
        <span>{sampleHousehold.model}</span>
        <div className="allocation-track" aria-label="Target allocation: 70 percent equity, 27 percent fixed income, 3 percent cash">
          <i className="allocation-equity" style={{ width: '70%' }} />
          <i className="allocation-fixed" style={{ width: '27%' }} />
          <i className="allocation-cash" style={{ width: '3%' }} />
        </div>
        <div className="decision-outcome">
          <span>08 proposed changes</span>
          <span>03 exceptions</span>
          <b>Review</b>
        </div>
      </div>
    </div>
  </div>
)
