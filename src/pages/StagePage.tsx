import { useEffect, useReducer } from 'react'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useLocation } from 'react-router-dom'
import { AccessOverlay } from '../components/stage/AccessOverlay'
import { AetherCanvas } from '../components/stage/AetherCanvas'
import { AnalyticsFrame } from '../components/stage/scenes/AnalyticsFrame'
import { HouseholdsFrame } from '../components/stage/scenes/HouseholdsFrame'
import { RebalanceFrame } from '../components/stage/scenes/RebalanceFrame'
import { StageChrome } from '../components/stage/StageChrome'
import { StageNodes } from '../components/stage/StageNodes'
import { StageSection } from '../components/stage/StageSection'
import { usePageMeta } from '../hooks/usePageMeta'
import { initialStageState, reduceStage } from '../lib/stageState'
import type { SceneId } from '../types/stage'

export const StagePage = () => {
  const [state, dispatch] = useReducer(reduceStage, initialStageState)
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

  const scrollToScene = (scene: SceneId) => {
    document.getElementById(scene)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
    window.history.replaceState(null, '', `#${scene}`)
  }

  useEffect(() => {
    const id = location.hash.replace('#', '')
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'auto' })
  }, [location.hash])

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <div className="stage-page">
        <AetherCanvas reducedMotion={reducedMotion} />
        <StageChrome onRequestAccess={() => dispatch({ type: 'open-access' })} />
        <section className="stage-hero" aria-label="Laminar Apex">
          <StageNodes onSelect={scrollToScene} />
        </section>
        <StageSection scene="households" reducedMotion={reducedMotion}>
          <HouseholdsFrame />
        </StageSection>
        <StageSection scene="rebalance" reducedMotion={reducedMotion}>
          <RebalanceFrame />
        </StageSection>
        <StageSection scene="analytics" reducedMotion={reducedMotion}>
          <AnalyticsFrame />
        </StageSection>
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
