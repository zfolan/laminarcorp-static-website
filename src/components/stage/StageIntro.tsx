import { motion } from 'motion/react'
import { STAGE_INTRO } from '../../data/stageBook'

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
    </motion.div>
  </section>
)
