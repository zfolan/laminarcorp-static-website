import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { landingContent } from '../data/landingContent'
import { BrandMark } from './BrandMark'

export const SiteHeader = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.hash, location.pathname])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <BrandMark />
        <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)}>
          <span className="sr-only">{open ? 'Close navigation' : 'Open navigation'}</span>
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
        <nav id="primary-navigation" className={`primary-nav ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
          {landingContent.navigation.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}
          <Link className="button button--small" to="/request-access">Request access <ArrowUpRight size={14} /></Link>
        </nav>
      </div>
    </header>
  )
}
