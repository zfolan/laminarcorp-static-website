import { useReducer } from 'react'
import { StageChrome } from '../components/stage/StageChrome'
import { StageNodes } from '../components/stage/StageNodes'
import { usePageMeta } from '../hooks/usePageMeta'
import { initialStageState, reduceStage } from '../lib/stageState'

export const StagePage = () => {
  const [state, dispatch] = useReducer(reduceStage, initialStageState)
  usePageMeta({
    title: 'Laminar Apex',
    description: 'Portfolio operations for advisors: household books, rebalances, and tax-aware analytics.',
  })

  return (
    <div className="stage-page">
      <StageChrome onRequestAccess={() => dispatch({ type: 'open-access' })} />
      <StageNodes scene={state.scene} onSelect={(scene) => dispatch({ type: 'open-scene', scene })} />
    </div>
  )
}
