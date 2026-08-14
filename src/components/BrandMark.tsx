import { Link } from 'react-router-dom'

export const BrandMark = () => (
  <Link className="brand-mark" to="/" aria-label="Laminar home">
    <img className="brand-symbol" src="/laminar-mark.svg" alt="" aria-hidden="true" />
    <span>LAMINAR</span>
  </Link>
)
