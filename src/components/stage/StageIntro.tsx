import { motion } from 'motion/react'
import { STAGE_CAPTIONS, STAGE_INTRO, STAGE_LABELS } from '../../data/stageBook'
import type { SceneId } from '../../types/stage'

const ease = [0.22, 1, 0.36, 1] as const

const rise = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
}

export const StageIntro = ({ reducedMotion = false }: { reducedMotion?: boolean }) => (
  <section id="intro" className="stage-intro" aria-labelledby="stage-intro-title">
    <motion.div
      className="stage-intro__in"
      initial={reducedMotion ? 'show' : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.28, margin: '0px 0px -8% 0px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reducedMotion ? 0 : 0.1,
          },
        },
      }}
    >
      <motion.h2
        id="stage-intro-title"
        variants={rise}
        transition={{ duration: reducedMotion ? 0 : 0.55, ease }}
      >
        {STAGE_INTRO.title}
      </motion.h2>
      <motion.p variants={rise} transition={{ duration: reducedMotion ? 0 : 0.55, ease }}>
        {STAGE_INTRO.lead}
      </motion.p>
      <motion.p variants={rise} transition={{ duration: reducedMotion ? 0 : 0.55, ease }}>
        {STAGE_INTRO.body}
      </motion.p>
      <nav aria-label="Portfolio management workflow" className="workflow-nav">
        <ol>
          {Object.entries(STAGE_LABELS).map(([id, label], index) => (
            <li key={id}>
              <a href={`#${id}`}>
                <span className="workflow-nav__number">{String(index + 1).padStart(2, '0')}</span>
                <strong>{label}</strong>
                <span>{STAGE_CAPTIONS[id as SceneId]}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="portfolio-hierarchy">
        <ol aria-label="Portfolio structure">
          {['Book', 'Household', 'Accounts', 'Sleeves', 'Securities', 'Trades'].map((level) => (
            <li key={level}>{level}</li>
          ))}
        </ol>
        <p>One connected view of the portfolio management process.</p>
      </div>
      <ul className="workflow-dimensions" aria-label="Connected capabilities">
        {['Tax', 'Risk', 'Asset Location', 'Cash', 'FX', 'Exceptions', 'Models', 'Reporting'].map((dimension) => (
          <li key={dimension}>{dimension}</li>
        ))}
      </ul>
      <div className="stage-problem">
        <h3>Portfolio management has become too fragmented.</h3>
        <p>A household can span taxable and registered accounts, CAD and USD assets, investment models, concentrated positions, cash requirements and trading restrictions. Account-by-account workflows force teams to reconnect those decisions manually.</p>
        <p>Laminar connects the pieces—so you can decide what the household should look like, what needs to change and how to get there.</p>
        <p className="stage-statement">Most systems tell you what is wrong. Laminar helps you determine what to do about it.</p>
      </div>
    </motion.div>
  </section>
)
