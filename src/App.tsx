import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import DemoOne from './components/ui/demo'
import { SiteHeader } from './components/SiteHeader'
import { LandingPage } from './pages/LandingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RequestAccessPage } from './pages/RequestAccessPage'

const ScrollManager = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const frame = window.requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }))
      return () => window.cancelAnimationFrame(frame)
    }
    window.scrollTo({ top: 0 })
  }, [hash, pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  )
}

const RoutedApp = () => {
  const { search } = useLocation()
  const forceReducedMotion = new URLSearchParams(search).get('motion') === 'reduce'

  return (
    <MotionConfig reducedMotion={forceReducedMotion ? 'always' : 'user'} transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}>
        <ScrollManager />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/request-access" element={<RequestAccessPage />} />
            <Route path="/aether-flow" element={<DemoOne />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
    </MotionConfig>
  )
}

export default App
