import { motion } from 'motion/react'
import { STAGE_OUTRO } from '../../data/stageBook'

const ease = [0.22, 1, 0.36, 1] as const

const rise = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
}

export const StageClose = ({
  reducedMotion = false,
  onRequestAccess,
}: {
  reducedMotion?: boolean
  onRequestAccess: () => void
}) => (
  <section id="close" className="stage-close" aria-label="Request access">
    <motion.div
      className="stage-close__in"
      initial={reducedMotion ? 'show' : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -8% 0px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reducedMotion ? 0 : 0.1,
          },
        },
      }}
    >
      <div className="stage-prefaces">
        {STAGE_OUTRO.map((blurb) => (
          <motion.div
            key={blurb.title}
            className="stage-preface"
            variants={rise}
            transition={{ duration: reducedMotion ? 0 : 0.55, ease }}
          >
            <h3>{blurb.title}</h3>
            <p>{blurb.body}</p>
          </motion.div>
        ))}
      </div>
      <motion.button
        type="button"
        className="stage-access-trigger"
        variants={rise}
        transition={{ duration: reducedMotion ? 0 : 0.55, ease }}
        onClick={onRequestAccess}
      >
        Request access
      </motion.button>
    </motion.div>
  </section>
)
