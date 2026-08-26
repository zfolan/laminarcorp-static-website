import type { SceneId } from '../../types/stage'

const NODES: { id: SceneId; label: string }[] = [
  { id: 'households', label: 'Households' },
  { id: 'rebalance', label: 'Rebalance' },
  { id: 'analytics', label: 'Analytics' },
]

type Props = {
  onSelect: (id: SceneId) => void
}

export const StageNodes = ({ onSelect }: Props) => (
  <div className="stage-nodes">
    {NODES.map((node) => (
      <button
        key={node.id}
        type="button"
        className={`stage-node stage-node--${node.id}`}
        onClick={() => onSelect(node.id)}
      >
        <span className="stage-node__core" aria-hidden="true" />
        <span className="stage-node__label">{node.label}</span>
      </button>
    ))}
  </div>
)
