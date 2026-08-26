import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { STAGE_CAPTIONS } from '../../data/stageBook'
import type { SceneId } from '../../types/stage'

const labels: Record<SceneId, string> = {
  households: 'Households',
  rebalance: 'Rebalance',
  analytics: 'Analytics',
}

export const ProductFrame = ({
  scene,
  children,
  onClose,
  reducedMotion,
  origin,
}: {
  scene: SceneId
  children: ReactNode
  onClose: () => void
  reducedMotion: boolean
  origin: { x: number; y: number }
}) => {
  const duration = reducedMotion ? 0 : 0.34
  return (
    <motion.div
      className="product-stage"
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.92 }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
    >
      <p className="product-caption">{STAGE_CAPTIONS[scene]}</p>
      <button type="button" className="product-frame" aria-label={`Close ${labels[scene]} preview`} onClick={onClose}>
        {children}
      </button>
    </motion.div>
  )
}
