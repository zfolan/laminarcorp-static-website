import { useEffect, useState } from 'react'
import { Player } from '@remotion/player'
import { HouseholdFilm } from '../remotion/HouseholdFilm'

const HeroFilm = () => {
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 600px)').matches)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 600px)')
    const update = () => setCompact(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return (
    <div className="hero-player" aria-label="One Household. One Coordinated Decision. Animated product story.">
      <Player
        component={HouseholdFilm}
        durationInFrames={714}
        compositionWidth={compact ? 1100 : 1440}
        compositionHeight={900}
        fps={30}
        autoPlay
        loop
        controls={false}
        style={{ width: '100%', aspectRatio: compact ? '11 / 9' : '8 / 5' }}
      />
    </div>
  )
}

export default HeroFilm
