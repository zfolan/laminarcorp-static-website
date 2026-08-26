import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { NotFoundPage } from './pages/NotFoundPage'
import { StagePage } from './pages/StagePage'

function App() {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  )
}

const RoutedApp = () => {
  const forceReducedMotion = new URLSearchParams(window.location.search).get('motion') === 'reduce'
  return (
    <MotionConfig reducedMotion={forceReducedMotion ? 'always' : 'user'}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <main id="main-content">
        <Routes>
          <Route path="/" element={<StagePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </MotionConfig>
  )
}

export default App
