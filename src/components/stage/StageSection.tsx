import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { STAGE_CAPTIONS, STAGE_PREFACE } from '../../data/stageBook'
import type { SceneId } from '../../types/stage'

const labels: Record<SceneId, string> = {
  households: 'Households',
  rebalance: 'Rebalance',
  analytics: 'Analytics',
}

const ease = [0.22, 1, 0.36, 1] as const

const rise = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
}

export const StageSection = ({
  scene,
  children,
  reducedMotion = false,
}: {
  scene: SceneId
  children: ReactNode
  reducedMotion?: boolean
}) => {
  const preface = STAGE_PREFACE[scene]
  return (
    <section id={scene} className="stage-section" aria-labelledby={`${scene}-title`}>
      <motion.div
        className="stage-section__in"
        initial={reducedMotion ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.16, margin: '0px 0px -12% 0px' }}
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
          id={`${scene}-title`}
          className="stage-node section-title"
          variants={rise}
          transition={{ duration: reducedMotion ? 0 : 0.55, ease }}
        >
          <span className="stage-node__core" aria-hidden="true" />
          <span className="stage-node__label">{labels[scene]}</span>
        </motion.h2>
        <motion.p
          className="product-caption"
          variants={rise}
          transition={{ duration: reducedMotion ? 0 : 0.55, ease }}
        >
          {STAGE_CAPTIONS[scene]}
        </motion.p>
        {preface ? (
          <div className="stage-prefaces">
            {preface.map((blurb) => (
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
        ) : null}
        <motion.div
          className="product-surface"
          variants={rise}
          transition={{ duration: reducedMotion ? 0 : 0.7, ease }}
        >
          {children}
        </motion.div>
      </motion.div>
    </section>
  )
}
