import { useEffect, useRef, useState } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { HouseholdFilm } from '../remotion/HouseholdFilm'
import { STORY_DURATION, storyFrameBounds, storyMoments } from '../data/storyMoments'

const ScrollStory = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const playerRef = useRef<PlayerRef>(null)
  const [active, setActive] = useState(0)
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 700px)').matches)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)')
    const update = () => setCompact(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    let scheduled = false
    const update = () => {
      scheduled = false
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const distance = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / distance))
      const currentFrame = Math.min(STORY_DURATION, Math.round(progress * STORY_DURATION))
      const nextBoundary = storyFrameBounds.findIndex((bound, index) => index > 0 && currentFrame < bound)
      playerRef.current?.seekTo(currentFrame)
      setActive(nextBoundary === -1 ? storyMoments.length - 1 : nextBoundary - 1)
    }
    const onScroll = () => {
      if (scheduled) return
      scheduled = true
      window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reducedMotion])

  return (
    <section ref={sectionRef} className={`scroll-story ${reducedMotion ? 'scroll-story--reduced' : ''}`} aria-label="How Laminar coordinates a household portfolio">
      <div className="scroll-story__stage" aria-hidden="true">
        <div className="scroll-story__film">
          <Player
            ref={reducedMotion ? undefined : playerRef}
            component={HouseholdFilm}
            durationInFrames={STORY_DURATION + 1}
            compositionWidth={compact ? 760 : 1600}
            compositionHeight={compact ? 1000 : 1000}
            fps={30}
            initialFrame={reducedMotion ? 174 : 0}
            controls={false}
            errorFallback={() => <p className="scroll-story__error">Product view unavailable.</p>}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="scroll-story__progress" aria-hidden="true">
          <span>ONE CONTINUOUS DECISION</span>
          <div>{storyMoments.map((moment, index) => <i className={active === index ? 'is-active' : ''} key={moment.eyebrow} />)}</div>
          <b>{String(active + 1).padStart(2, '0')} / 06</b>
        </div>
      </div>
      <div className="scroll-story__chapters">
        {storyMoments.map((moment) => (
          <article id={'id' in moment ? moment.id : undefined} className="scroll-story__chapter" key={moment.eyebrow}>
            <h2>{moment.title}</h2>
            <p>{moment.copy}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ScrollStory
