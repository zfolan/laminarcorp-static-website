import { Link } from 'react-router-dom'
import { BrandMark } from './BrandMark'

export const SiteFooter = () => (
  <footer className="site-footer">
    <BrandMark />
    <nav aria-label="Footer navigation">
      <Link to="/#security">Security</Link>
      <Link to="/#company">Company</Link>
      <Link to="/request-access">Contact</Link>
    </nav>
    <span>© {new Date().getFullYear()} LAMINAR</span>
  </footer>
)
