import { useEffect, useReducer } from 'react'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useLocation } from 'react-router-dom'
import { AccessOverlay } from '../components/stage/AccessOverlay'
import { AetherCanvas } from '../components/stage/AetherCanvas'
import { HeroMark } from '../components/stage/HeroMark'
import { AnalyticsFrame } from '../components/stage/scenes/AnalyticsFrame'
import { HouseholdsFrame } from '../components/stage/scenes/HouseholdsFrame'
import { RebalanceFrame } from '../components/stage/scenes/RebalanceFrame'
import { ProposalsFrame } from '../components/stage/scenes/ProposalsFrame'
import { ImplementationFrame } from '../components/stage/scenes/ImplementationFrame'
import { StageChrome } from '../components/stage/StageChrome'
import { StageClose } from '../components/stage/StageClose'
import { StageIntro } from '../components/stage/StageIntro'
import { StageScrollHint } from '../components/stage/StageScrollHint'
import { StageSection } from '../components/stage/StageSection'
import { stageBook } from '../data/stageBook'
import { usePageMeta } from '../hooks/usePageMeta'
import { initialStageState, reduceStage } from '../lib/stageState'

export const StagePage = () => {
  const [state, dispatch] = useReducer(reduceStage, initialStageState)
  const location = useLocation()
  const reducedMotion = Boolean(useReducedMotion()) || new URLSearchParams(location.search).get('motion') === 'reduce'
  usePageMeta({
    title: 'Laminar | Portfolio Management & Implementation',
    description: 'Household-first portfolio management for modern wealth teams. Connect analytics, tax-aware rebalancing, proposals and implementation in one workflow.',
  })


  useEffect(() => {
    const id = location.hash.replace('#', '')
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'auto' })
  }, [location.hash])

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <div className="stage-page">
        <AetherCanvas reducedMotion={reducedMotion} />
        <StageChrome onRequestAccess={() => dispatch({ type: 'open-access' })} />
        <StageScrollHint reducedMotion={reducedMotion} />
        <section className="stage-hero" aria-label="Laminar Apex">
          <HeroMark reducedMotion={reducedMotion} />
          <motion.div
            className="stage-hero__copy"
            initial={reducedMotion ? false : { opacity: 0, visibility: 'hidden' }}
            animate={{ opacity: 1, visibility: 'visible' }}
            transition={{
              // The last wordmark letter finishes at 2.19 seconds.
              delay: reducedMotion ? 0 : 2.2,
              duration: reducedMotion ? 0 : 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h2>From Portfolio Strategy to Implementation. In One System.</h2>
            <p>Portfolio management, reimagined around the household.</p>
            <div className="stage-hero__actions">
              <button type="button" className="stage-access-trigger" onClick={() => dispatch({ type: 'open-access' })}>
                Request a Demo
              </button>
              <a className="text-link" href="#intro">Explore the Platform <span aria-hidden="true">↓</span></a>
            </div>
          </motion.div>
        </section>
        <StageIntro reducedMotion={reducedMotion} />
        <StageSection
          scene="households"
          reducedMotion={reducedMotion}
          details={
            <div className="stage-details stage-preface">
              <p className="eyebrow">Portfolio Construction</p>
              <h3>Build the strategy. Then put it to work.</h3>
              <p>Define your firm’s equity and fixed-income models, security weights, drift bands, account restrictions and position limits. Connect those models to household targets and the implementation workflow.</p>
              <div className="stage-models">
                <dl>
                  <div><dt>Equity model</dt><dd>{stageBook.featured.equityModel}</dd></div>
                  <div><dt>Fixed-income model</dt><dd>{stageBook.featured.fixedIncomeModel}</dd></div>
                </dl>
                <dl className="stage-models__weights">
                  <div><dt>Equity</dt><dd>{stageBook.featured.target.equity * 100}%</dd></div>
                  <div><dt>Fixed income</dt><dd>{stageBook.featured.target.fixedIncome * 100}%</dd></div>
                  <div><dt>Cash</dt><dd>{stageBook.featured.target.cash * 100}%</dd></div>
                </dl>
              </div>
              <p className="stage-statement">Your models aren’t just stored in Laminar. They’re used to manage the portfolio.</p>
            </div>
          }
        >
          <HouseholdsFrame />
        </StageSection>
        <StageSection
          scene="analytics"
          reducedMotion={reducedMotion}
          details={
            <div className="stage-details stage-exceptions stage-preface">
              <p className="eyebrow">Exception Management</p>
              <h3>Let the system find the problems.<br />Let the manager make the decisions.</h3>
              <p>Laminar surfaces the decisions that require professional judgment.</p>
              <ul>
                <li>Concentration within an account or household</li>
                <li>Cash reserved for withdrawals</li>
                <li>Tax impact and alternative funding sources</li>
                <li>Model misalignment</li>
                <li>CAD/USD funding mismatches</li>
                <li>Restricted positions and trading limits</li>
              </ul>
              <p className="stage-statement">Laminar doesn’t eliminate judgment. It puts judgment where it matters.</p>
            </div>
          }
        >
          <AnalyticsFrame />
        </StageSection>
        <StageSection
          scene="rebalance"
          reducedMotion={reducedMotion}
          details={
            <div className="stage-details stage-considerations">
              <div className="stage-preface"><h3>Tax-aware</h3><p>Review estimated capital gains and applicable tax rules before proposing trades.</p></div>
              <div className="stage-preface"><h3>Asset location</h3><p>Consider where investments are held across registered and non-registered accounts.</p></div>
              <div className="stage-preface"><h3>Cash-aware</h3><p>Distinguish available cash from reserves needed for withdrawals and spending.</p></div>
              <div className="stage-preface"><h3>Currency-aware</h3><p>Account for CAD and USD funding requirements while avoiding unnecessary currency transactions.</p></div>
            </div>
          }
        >
          <RebalanceFrame />
        </StageSection>
        <StageSection
          scene="proposals"
          reducedMotion={reducedMotion}
          details={
            <div className="stage-details stage-preface">
              <h3>Deploy over time</h3>
              <p>Implement immediately, across three or six monthly events, or on a custom schedule—including a twelve-month deployment. Show the trades proposed now alongside the expected target portfolio.</p>
              <p>Future events generate fresh proposed trades; the schedule is not a promise of future orders or returns.</p>
              <p>After implementation, produce client reports from confirmed position activity—not unconfirmed proposed trades.</p>
            </div>
          }
        >
          <ProposalsFrame />
        </StageSection>
        <StageSection
          scene="implementation"
          reducedMotion={reducedMotion}
          details={
            <div className="stage-details stage-considerations">
              <div className="stage-preface"><h3>Trade generation</h3><p>Translate decisions into account-level orders.</p></div>
              <div className="stage-preface"><h3>Bulk trading</h3><p>Coordinate household work without removing household-level review.</p></div>
              <div className="stage-preface"><h3>Controlled implementation</h3><p>Review, validate, export and reconcile with professional oversight.</p></div>
            </div>
          }
        >
          <ImplementationFrame />
        </StageSection>
        <StageClose
          reducedMotion={reducedMotion}
          onRequestAccess={() => dispatch({ type: 'open-access' })}
        />
        {state.access !== 'closed' ? (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
          >
            <AccessOverlay access={state.access} accessError={state.accessError} dispatch={dispatch} />
          </motion.div>
        ) : null}
      </div>
    </MotionConfig>
  )
}
