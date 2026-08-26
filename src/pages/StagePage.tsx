import { useEffect, useReducer } from 'react'
import { ProductFrame } from '../components/stage/ProductFrame'
import { AnalyticsFrame } from '../components/stage/scenes/AnalyticsFrame'
import { HouseholdsFrame } from '../components/stage/scenes/HouseholdsFrame'
import { RebalanceFrame } from '../components/stage/scenes/RebalanceFrame'
import { StageChrome } from '../components/stage/StageChrome'
import { StageNodes } from '../components/stage/StageNodes'
import { usePageMeta } from '../hooks/usePageMeta'
import { initialStageState, reduceStage } from '../lib/stageState'

const sceneFrame = {
  households: <HouseholdsFrame />,
  rebalance: <RebalanceFrame />,
  analytics: <AnalyticsFrame />,
}

export const StagePage = () => {
  const [state, dispatch] = useReducer(reduceStage, initialStageState)
  usePageMeta({
    title: 'Laminar Apex',
    description: 'Portfolio operations for advisors: household books, rebalances, and tax-aware analytics.',
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dispatch({ type: 'escape' })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="stage-page">
      <StageChrome onRequestAccess={() => dispatch({ type: 'open-access' })} />
      <StageNodes scene={state.scene} onSelect={(scene) => dispatch({ type: 'open-scene', scene })} />
      {state.scene !== 'none' ? (
        <ProductFrame scene={state.scene} onClose={() => dispatch({ type: 'close-scene' })}>
          {sceneFrame[state.scene]}
        </ProductFrame>
      ) : null}
    </div>
  )
}
