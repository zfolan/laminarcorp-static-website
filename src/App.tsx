import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import './App.css'

const ScrollManager = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      let attempts = 0
      let frame = 0
      const findTarget = () => {
        const target = document.getElementById(hash.slice(1))
        if (target) {
          target.scrollIntoView({ behavior: attempts ? 'auto' : 'smooth' })
          return
        }
        attempts += 1
        if (attempts < 60) frame = window.requestAnimationFrame(findTarget)
      }
      frame = window.requestAnimationFrame(findTarget)
      return () => window.cancelAnimationFrame(frame)
    }

    window.scrollTo({ top: 0 })
  }, [hash, pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <SiteLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  )
}

export default App
