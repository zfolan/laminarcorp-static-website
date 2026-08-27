import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const DELAY_MS = 5000
const SCROLL_SLACK = 4

export const StageScrollHint = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const location = useLocation()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (location.hash || window.scrollY > SCROLL_SLACK) return

    let dismissed = false
    const dismiss = () => {
      if (dismissed) return
      dismissed = true
      setShown(false)
      window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => {
      if (!dismissed && window.scrollY <= SCROLL_SLACK) setShown(true)
    }, DELAY_MS)
    const onScroll = () => {
      if (window.scrollY > SCROLL_SLACK) dismiss()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      dismissed = true
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [location.hash])

  return (
    <button
      type="button"
      className={`stage-scroll-hint${shown ? ' is-on' : ''}${reducedMotion ? ' is-still' : ''}`}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      aria-label="Scroll down"
      onClick={() => document.getElementById('intro')?.scrollIntoView()}
    >
      <span className="stage-scroll-hint__glow" />
      <svg className="stage-scroll-hint__mark" viewBox="0 0 48 36" aria-hidden="true" focusable="false">
        <path d="M10 8 L24 18 L38 8" />
        <path d="M10 18 L24 28 L38 18" />
        <circle cx="10" cy="8" r="1.5" />
        <circle cx="38" cy="8" r="1.5" />
        <circle cx="24" cy="18" r="1.7" />
        <circle cx="10" cy="18" r="1.5" />
        <circle cx="38" cy="18" r="1.5" />
        <circle cx="24" cy="28" r="1.8" />
      </svg>
    </button>
  )
}
