import { useEffect, useState } from 'react'

export const useReducedMotion = () => {
  const forced = new URLSearchParams(window.location.search).get('motion') === 'reduce'
  const [reduced, setReduced] = useState(() => forced || window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(forced || query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [forced])

  return reduced
}
