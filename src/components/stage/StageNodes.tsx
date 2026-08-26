import type { SceneId } from '../../types/stage'

const NODES: { id: SceneId; label: string }[] = [
  { id: 'households', label: 'Households' },
  { id: 'rebalance', label: 'Rebalance' },
  { id: 'analytics', label: 'Analytics' },
]

type Props = {
  scene: SceneId | 'none'
  onSelect: (id: SceneId) => void
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
          onClick={() => onSelect(node.id)}
        >
          {node.label}
        </button>
      )
    })}
  </div>
)
