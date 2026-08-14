import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { usePageMeta } from '../hooks/usePageMeta'

const principles = [
  ['Manage the household as one portfolio.', 'Account-level detail matters, but the investment decision begins with the complete household.'],
  ['Keep context inside the decision.', 'Models, holdings, cash, currency, gains and losses, restrictions, and exposures belong in the same review.'],
  ['Carry strategy through to implementation.', 'The target is only useful when the path to coordinated account-level action is clear.'],
  ['Support professional judgment.', 'Technology should organize routine analysis and bring material exceptions forward—not remove the portfolio manager from the decision.'],
  ['Make sophisticated work approachable.', 'Strong hierarchy, consistent language, and focused review states can make complex decisions easier to understand without making them simplistic.'],
]

const placeholders = ['Company history', 'Founder information', 'Team members', 'Location', 'Company milestones', 'Careers information', 'Real photography']

export const AboutPage = () => {
  usePageMeta({ title: 'About Laminar | One connected portfolio workflow', description: 'Why Laminar exists and its point of view on household-level portfolio management and implementation.' })
  return (
    <>
      <section className="page-hero page-hero--about">
        <p className="eyebrow">ABOUT LAMINAR</p>
        <h1>Portfolio strategy and implementation should not live in separate systems.</h1>
        <p>Laminar is built around a simple point of view: wealth managers should be able to understand the complete household, decide what needs to change, and prepare a coordinated implementation plan without losing context between tools.</p>
      </section>

      <section className="about-manifesto">
        <Reveal>
          <div className="manifesto-index"><span>OUR POINT OF VIEW</span><span>HOUSEHOLD → DECISION → ACTION</span></div>
          <div className="manifesto-statement">A household is not a collection of isolated accounts. It is one investment portfolio expressed through different registrations, currencies, holdings, restrictions, and planning needs.</div>
        </Reveal>
      </section>

      <section className="content-section about-principles">
        <Reveal>
          <div className="about-section-title"><p className="eyebrow">PRINCIPLES</p><h2>Designed for complete decisions.</h2></div>
          <div className="principle-list">
            {principles.map(([title, copy]) => <article key={title}><span aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </Reveal>
      </section>

      <section className="connected-system">
        <div className="connected-system__copy"><p className="eyebrow">ONE CONNECTED SYSTEM</p><h2>From investment intent to a reviewable implementation plan.</h2><p>Laminar is a household-level portfolio management and implementation platform that connects portfolio construction, analysis, tax-aware rebalancing, exception management, and trade generation in one advisor-centered workflow.</p></div>
        <div className="connected-system__map" aria-label="Laminar workflow"><span>Portfolio construction</span><i>→</i><span>Household analysis</span><i>→</i><span>Drift & risk</span><i>→</i><span>Recommendations</span><i>→</i><span>Manager approval</span><i>→</i><span>Implementation</span></div>
      </section>

      <section className="content-section placeholder-section">
        <Reveal>
          <div className="placeholder-intro"><p className="eyebrow">PUBLICATION PLACEHOLDERS</p><h2>Company facts will be added after verification.</h2><p>These details are intentionally not invented. Replace each placeholder with approved company information before publication.</p></div>
          <div className="placeholder-grid">{placeholders.map((item) => <div key={item}><span>TO BE VERIFIED</span><b>{item}</b><p>Approved content required before publication.</p></div>)}</div>
        </Reveal>
      </section>

      <section className="final-cta final-cta--compact"><div><p className="eyebrow">SEE THE WORKFLOW</p><h2>Bring the complete household into every portfolio decision.</h2></div><div><p>Explore how Laminar connects analysis, review, and implementation.</p><Link className="button button--primary" to="/contact">Book Demo <span aria-hidden="true">↗</span></Link></div></section>
    </>
  )
}
