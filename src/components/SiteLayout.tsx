import { useEffect, useState, type PropsWithChildren } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BrandMark } from './BrandMark'

export const SiteLayout = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname, location.hash])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="header-inner">
          <BrandMark />
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span>{open ? 'Close' : 'Menu'}</span>
            <i aria-hidden="true" />
          </button>
          <nav id="primary-navigation" className={open ? 'primary-nav is-open' : 'primary-nav'} aria-label="Primary navigation">
            <Link to="/#product">Product</Link>
            <Link to="/#how-it-works">How It Works</Link>
            <Link to="/#why-laminar">Why Laminar</Link>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <Link className="nav-cta" to="/contact">Book Demo <span aria-hidden="true">↗</span></Link>
          </nav>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="footer-main">
          <div>
            <BrandMark />
            <p>Household-level portfolio management and implementation for modern wealth management.</p>
          </div>
          <div className="footer-links" aria-label="Footer navigation">
            <div>
              <span>Explore</span>
              <Link to="/#product">Product</Link>
              <Link to="/#how-it-works">How It Works</Link>
              <Link to="/#why-laminar">Why Laminar</Link>
            </div>
            <div>
              <span>Company</span>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/contact">Book Demo</Link>
            </div>
          </div>
        </div>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} Laminar</span>
          <span>Portfolio strategy, carried through to implementation.</span>
        </div>
      </footer>
    </div>
  )
}
