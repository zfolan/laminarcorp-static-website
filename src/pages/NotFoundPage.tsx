import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export const NotFoundPage = () => {
  usePageMeta({
    title: 'Page not found | Laminar Apex',
    description: 'This Laminar Apex page could not be found.',
  })
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <h1 id="not-found-title">Page not found.</h1>
      <p>Return to the stage to continue.</p>
      <Link className="button button--secondary" to="/">Return home</Link>
    </section>
  )
}
