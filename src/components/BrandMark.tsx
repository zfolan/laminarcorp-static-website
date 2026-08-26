import { Link } from 'react-router-dom'

export const BrandMark = () => (
  <Link className="brand" to="/" aria-label="Laminar Apex home">
    <span className="brand__symbol"><img src="/laminar-mark.svg" alt="" /></span>
    <span className="brand__name">LAMINAR</span>
    <span className="brand__divider" aria-hidden="true" />
    <span className="brand__product">APEX</span>
  </Link>
)
