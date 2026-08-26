import type { ReactNode } from 'react'
import { STAGE_CAPTIONS } from '../../data/stageBook'
import type { SceneId } from '../../types/stage'

const labels: Record<SceneId, string> = {
  households: 'Households',
  rebalance: 'Rebalance',
  analytics: 'Analytics',
}

export const StageSection = ({ scene, children }: { scene: SceneId; children: ReactNode }) => (
  <section id={scene} className="stage-section" aria-labelledby={`${scene}-title`}>
    <h2 id={`${scene}-title`} className="stage-node section-title">
      <span className="stage-node__core" aria-hidden="true" />
      <span className="stage-node__label">{labels[scene]}</span>
    </h2>
    <p className="product-caption">{STAGE_CAPTIONS[scene]}</p>
    <div className="product-surface">{children}</div>
  </section>
)
