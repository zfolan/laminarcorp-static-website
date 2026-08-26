import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export const NotFoundPage = () => {
  usePageMeta({ title: 'Page not found | Laminar Apex', description: 'The requested Laminar Apex page could not be found.' })
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <p className="eyebrow">404 / ROUTE UNAVAILABLE</p>
      <h1 id="not-found-title">This path does not need you next.</h1>
      <p>The address may be outdated or unavailable. Return to the Apex landing page to continue.</p>
      <Link className="button button--secondary" to="/"><ArrowLeft size={15} /> Return home</Link>
    </section>
  )
}
