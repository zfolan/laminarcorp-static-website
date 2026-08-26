import type { ReactNode } from 'react'
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
}: {
  scene: SceneId
  children: ReactNode
  onClose: () => void
}) => (
  <div className="product-stage">
    <p className="product-caption">{STAGE_CAPTIONS[scene]}</p>
    <button type="button" className="product-frame" aria-label={`Close ${labels[scene]} preview`} onClick={onClose}>
      {children}
    </button>
  </div>
)
