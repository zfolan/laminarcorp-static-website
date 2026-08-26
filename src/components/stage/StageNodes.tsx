import type { SceneId } from '../../types/stage'

const NODES: { id: SceneId; label: string }[] = [
  { id: 'households', label: 'Households' },
  { id: 'rebalance', label: 'Rebalance' },
  { id: 'analytics', label: 'Analytics' },
]

type Origin = { x: number; y: number }

type Props = {
  scene: SceneId | 'none'
  onSelect: (id: SceneId, origin: Origin) => void
}

export const StageNodes = ({ scene, onSelect }: Props) => (
  <div className="stage-nodes">
    {NODES.map((node) => {
      const state = scene === 'none' ? 'idle' : scene === node.id ? 'active' : 'quieter'
      return (
        <button
          key={node.id}
          type="button"
          className={`stage-node stage-node--${node.id} stage-node--${state}`}
          aria-pressed={scene === node.id}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()
            onSelect(node.id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
          }}
        >
          <span className="stage-node__core" aria-hidden="true" />
          <span className="stage-node__label">{node.label}</span>
        </button>
      )
    })}
  </div>
)
