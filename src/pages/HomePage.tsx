import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { HeroFilmPoster } from '../components/HeroFilmPoster'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { usePageMeta } from '../hooks/usePageMeta'
import { useReducedMotion } from '../hooks/useReducedMotion'

const ScrollStory = lazy(() => import('../components/ScrollStory'))

export const HomePage = () => {
  const reducedMotion = useReducedMotion()
  usePageMeta({
    title: 'Laminar | Portfolio strategy, carried through to implementation',
    description: 'Household-level portfolio management and implementation for advisors, portfolio managers, and wealth-management firms.',
  })

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div>
            <p className="eyebrow">Advanced portfolio management for modern wealth management</p>
            <h1 id="hero-title">Portfolio strategy, carried through to implementation.</h1>
          </div>
          <div className="hero-support">
            <p>Laminar analyzes every account as part of one household portfolio, helping wealth managers understand what should change, where it should happen, and how to implement it through one clear, reviewable workflow.</p>
            <div className="hero-actions">
              <Link className="button button--primary" to="/contact">Book Demo <span aria-hidden="true">↗</span></Link>
              <a className="button button--text" href="#how-it-works">See how Laminar works <span aria-hidden="true">↓</span></a>
            </div>
          </div>
        </div>
        <div className="hero-scroll-cue" aria-hidden="true">
          <span>SCROLL TO COORDINATE THE HOUSEHOLD</span>
          <i />
          <span>01 → 06</span>
        </div>
      </section>

      <Suspense fallback={<div className="scroll-story-fallback"><HeroFilmPoster /></div>}>
        <ScrollStory reducedMotion={reducedMotion} />
      </Suspense>

      <section className="content-section workflow-clarity">
        <Reveal>
          <SectionHeading eyebrow="09 / A CLEARER WORKFLOW" title="Complex household decisions, organized into one clear workflow." copy="Laminar keeps the relevant portfolio context, exceptions, recommendations, and next actions together, making sophisticated analysis easier to understand and move forward." />
          <div className="clarity-grid">
            <div><span>CONTEXT</span><h3>See the whole decision.</h3><p>Household objectives, portfolio structure, account details, and implementation constraints stay connected.</p></div>
            <div><span>ATTENTION</span><h3>Know what needs review.</h3><p>Focused exception states identify where professional judgment changes the course of action.</p></div>
            <div><span>ACTION</span><h3>Move the work forward.</h3><p>Clear recommendations, review controls, and next steps organize the path to implementation.</p></div>
          </div>
          <p className="editorial-callout">Built around the way portfolio managers review, decide, and act.</p>
        </Reveal>
      </section>

      <section className="content-section audience-section">
        <Reveal>
          <SectionHeading eyebrow="10 / BUILT FOR WEALTH MANAGEMENT" title="More capacity for the work that requires professional judgment." copy="By reducing repetitive analysis and implementation work, Laminar gives investment professionals more capacity for portfolio oversight, tax and planning decisions, risk management, and client relationships." />
          <div className="audience-grid">
            <article><span>FOR ADVISORS & PORTFOLIO MANAGERS</span><h3>Keep household context through the decision.</h3><ul><li>Prioritize portfolio work with a complete view</li><li>Reduce repetitive calculation and reconciliation</li><li>Review clear, coordinated recommendations</li><li>Preserve attention for planning and client decisions</li></ul></article>
            <article><span>FOR WEALTH-MANAGEMENT FIRMS</span><h3>Scale a consistent portfolio workflow.</h3><ul><li>Standardize household-level analysis</li><li>Coordinate implementation across account structures</li><li>Handle exceptions with a repeatable process</li><li>Maintain portfolio-manager oversight and control</li></ul></article>
          </div>
        </Reveal>
      </section>

      <section className="final-cta">
        <div><p className="eyebrow">A FOCUSED PRODUCT DEMONSTRATION</p><h2>See how Laminar fits your portfolio-management workflow.</h2></div>
        <div><p>Book a focused demonstration of Laminar’s household analysis, rebalancing, and implementation experience.</p><Link className="button button--primary" to="/contact">Book Demo <span aria-hidden="true">↗</span></Link></div>
      </section>
    </>
  )
}
