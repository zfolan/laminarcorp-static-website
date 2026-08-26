import { useEffect, useReducer, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useLocation } from 'react-router-dom'
import { AccessOverlay } from '../components/stage/AccessOverlay'
import { AetherCanvas } from '../components/stage/AetherCanvas'
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
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const location = useLocation()
  const reducedMotion = Boolean(useReducedMotion()) || new URLSearchParams(location.search).get('motion') === 'reduce'
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
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <div className="stage-page">
        <AetherCanvas
          dimmed={state.scene !== 'none'}
          reducedMotion={reducedMotion}
          onEmptyPointerDown={() => {
            if (state.scene !== 'none') dispatch({ type: 'close-scene' })
          }}
        />
        <StageChrome onRequestAccess={() => dispatch({ type: 'open-access' })} />
        <StageNodes
          scene={state.scene}
          onSelect={(scene, nextOrigin) => {
            setOrigin(nextOrigin)
            dispatch({ type: 'open-scene', scene })
          }}
        />
        {reducedMotion ? (
          state.scene !== 'none' ? (
            <ProductFrame
              scene={state.scene}
              origin={origin}
              reducedMotion
              onClose={() => dispatch({ type: 'close-scene' })}
            >
              {sceneFrame[state.scene]}
            </ProductFrame>
          ) : null
        ) : (
          <AnimatePresence mode="wait">
            {state.scene !== 'none' ? (
              <ProductFrame
                key={state.scene}
                scene={state.scene}
                origin={origin}
                reducedMotion={false}
                onClose={() => dispatch({ type: 'close-scene' })}
              >
                {sceneFrame[state.scene]}
              </ProductFrame>
            ) : null}
          </AnimatePresence>
        )}
        {state.access !== 'closed' ? (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
          >
            <AccessOverlay access={state.access} accessError={state.accessError} dispatch={dispatch} />
          </motion.div>
        ) : null}
      </div>
    </MotionConfig>
  )
}
