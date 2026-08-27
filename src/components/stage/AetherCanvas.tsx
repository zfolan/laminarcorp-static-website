import { useEffect, useRef } from 'react'
import { User } from 'lucide-react'

type Props = {
  reducedMotion: boolean
}

type TagKind = 'aum' | 'rebalance' | 'drift'
type TagSleeve = 'EQ' | 'FI'

type ParticleTag = {
  kind: TagKind
  name: string
  aum: number
  drift: number
  sleeve: TagSleeve
  current: number
  target: number
}

const TAG_KINDS: TagKind[] = ['aum', 'rebalance', 'drift']
const MAX_TAGS = 16
const TAG_GAP_MIN = 2200
const TAG_GAP_EXTRA = 3200
const TAG_VIEW_DELAY = 10000
const TAG_VIEW_DELAY_MIN = 2000
const TAG_VIEW_DELAY_EXTRA = TAG_VIEW_DELAY - TAG_VIEW_DELAY_MIN
const TAG_NAMES = [
  'Adler Family', 'Bennett Household', 'Cho Family', 'Diaz Household',
  'Ellis Trust', 'Farouk Family', 'Garcia Household', 'Huang Family',
  'Ibrahim Trust', 'Jensen Family', 'Kaur Household', 'Larsen Family',
  'Moreau Household', 'Nakamura Family', 'Okafor Trust', 'Park Family',
  'Qureshi Household', 'Sato Family', 'Tremblay Household', 'Ueda Family',
  'Vargas Household', 'Walsh Family', 'Yates Trust', 'Zhang Family',
  'Kline Holdings', 'Novak Family', 'Brooks Household', 'Singh Family',
  'Okoye Trust', 'Berg Holdings',
]

type Particle = {
  x: number
  y: number
  directionX: number
  directionY: number
  size: number
  bound: boolean
  home: { x: number; y: number } | null
  delay: number
  tag: ParticleTag | null
}

type Pane = {
  left: number
  right: number
  top: number
  bottom: number
}

type Halo = {
  cx: number
  cy: number
  rx: number
  ry: number
}

const isInside = (x: number, y: number, pane: Pane, pad = 0) =>
  x >= pane.left - pad && x <= pane.right + pad && y >= pane.top - pad && y <= pane.bottom + pad

const segmentsIntersect = (
  ax: number, ay: number, bx: number, by: number,
  cx: number, cy: number, dx: number, dy: number,
) => {
  const den = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx)
  if (den === 0) return false
  const u = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / den
  const v = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / den
  return u >= 0 && u <= 1 && v >= 0 && v <= 1
}

const segmentHitsPane = (x1: number, y1: number, x2: number, y2: number, pane: Pane) => {
  if (isInside(x1, y1, pane) || isInside(x2, y2, pane)) return true
  return (
    segmentsIntersect(x1, y1, x2, y2, pane.left, pane.top, pane.right, pane.top)
    || segmentsIntersect(x1, y1, x2, y2, pane.left, pane.bottom, pane.right, pane.bottom)
    || segmentsIntersect(x1, y1, x2, y2, pane.left, pane.top, pane.left, pane.bottom)
    || segmentsIntersect(x1, y1, x2, y2, pane.right, pane.top, pane.right, pane.bottom)
  )
}

const inFill = (paths: SVGPathElement[], x: number, y: number) =>
  paths.some((path) => path.isPointInFill({ x, y }))

const money = (value: number) =>
  value >= 1_000_000
    ? `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`
    : `$${Math.round(value / 1000)}k`

const pct = (value: number) => `${(value * 100).toFixed(1).replace(/\.0$/, '')}%`

const points = (value: number) => Number((value * 100).toFixed(1))

type SleeveTone = 'on' | 'near' | 'off'

export const sleeveTone = (shown: number, target: number): SleeveTone => {
  const delta = Math.abs(points(shown) - points(target))
  if (delta === 0) return 'on'
  if (delta <= 2) return 'near'
  return 'off'
}

const between = (min: number, max: number) => min + Math.random() * (max - min)

const shuffle = <T,>(items: T[]) => {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const swap = next[i]
    next[i] = next[j]
    next[j] = swap
  }
  return next
}

const makeTag = (kind: TagKind, name: string): ParticleTag => {
  const sleeve: TagSleeve = Math.random() < 0.5 ? 'EQ' : 'FI'
  const target = sleeve === 'EQ' ? between(0.70, 0.90) : between(0.10, 0.30)
  const current = sleeve === 'EQ'
    ? between(0.24, Math.max(0.28, target - 0.12))
    : Math.random() < 0.65
      ? between(Math.min(0.58, target + 0.08), 0.58)
      : between(0.02, Math.max(0.04, target - 0.04))
  return {
    kind,
    name,
    aum: between(280_000, 6_200_000),
    drift: between(0.08, 0.52),
    sleeve,
    current,
    target,
  }
}

const sampleLogoRibbons = () => {
  const svg = document.querySelector<SVGSVGElement>('.hero-logo')
  if (!svg) return { points: [] as { x: number; y: number }[], links: [] as Array<[number, number]> }
  const paths = [...svg.querySelectorAll('path')]
  if (paths.length === 0) return { points: [], links: [] }

  const previousFill = paths.map((path) => path.getAttribute('fill'))
  paths.forEach((path) => path.setAttribute('fill', '#ffffff'))

  const points: { x: number; y: number }[] = []
  const links: Array<[number, number]> = []

  paths.forEach((path, pathIndex) => {
    const length = path.getTotalLength()
    if (length < 8) return
    const mountain = pathIndex < 2
    const offsets = mountain ? [0, 14, 28] : [0, 10]
    const spacing = mountain ? 16 : 14
    const pathGroups: number[][] = []

    offsets.forEach((offset) => {
      const contour: { x: number; y: number }[] = []
      const steps = Math.max(18, Math.round(length / spacing))
      for (let i = 0; i < steps; i += 1) {
        const at = (i / steps) * length
        const point = path.getPointAtLength(at)
        if (offset === 0) {
          contour.push({ x: point.x, y: point.y })
          continue
        }
        const ahead = path.getPointAtLength(Math.min(length, at + 3))
        let nx = -(ahead.y - point.y)
        let ny = ahead.x - point.x
        const nlen = Math.hypot(nx, ny) || 1
        nx /= nlen
        ny /= nlen
        const left = { x: point.x + nx * offset, y: point.y + ny * offset }
        const right = { x: point.x - nx * offset, y: point.y - ny * offset }
        const leftIn = inFill(paths, left.x, left.y)
        const rightIn = inFill(paths, right.x, right.y)
        if (leftIn && !rightIn) contour.push(left)
        else if (rightIn && !leftIn) contour.push(right)
        else if (leftIn && rightIn) {
          const deeperLeft = inFill(paths, point.x + nx * (offset + 8), point.y + ny * (offset + 8))
          contour.push(deeperLeft ? left : right)
        }
      }
      if (contour.length < 4) return
      const indices: number[] = []
      contour.forEach((point) => {
        indices.push(points.length)
        points.push(point)
      })
      for (let i = 0; i < indices.length - 1; i += 1) links.push([indices[i], indices[i + 1]])
      const first = contour[0]
      const last = contour[contour.length - 1]
      if (Math.hypot(first.x - last.x, first.y - last.y) < 28) links.push([indices[0], indices[indices.length - 1]])
      pathGroups.push(indices)
    })

    for (let ring = 1; ring < pathGroups.length; ring += 1) {
      const inner = pathGroups[ring]
      const outer = pathGroups[ring - 1]
      inner.forEach((index) => {
        let best = -1
        let bestDist = 36 * 36
        outer.forEach((other) => {
          const dx = points[index].x - points[other].x
          const dy = points[index].y - points[other].y
          const dist = dx * dx + dy * dy
          if (dist < bestDist) {
            bestDist = dist
            best = other
          }
        })
        if (best >= 0) links.push([index, best])
      })
    }
  })

  paths.forEach((path, index) => {
    const value = previousFill[index]
    if (value == null) path.removeAttribute('fill')
    else path.setAttribute('fill', value)
  })

  return { points, links }
}

const toCanvasAnchors = (points: { x: number; y: number }[], canvasBounds: DOMRect) => {
  const svg = document.querySelector<SVGSVGElement>('.hero-logo')
  const ctm = svg?.getScreenCTM()
  if (!ctm) return [] as { x: number; y: number }[]
  return points.map((point) => ({
    x: ctm.a * point.x + ctm.c * point.y + ctm.e - canvasBounds.left,
    y: ctm.b * point.x + ctm.d * point.y + ctm.f - canvasBounds.top,
  }))
}

const haloFromRect = (rect: DOMRect, canvasBounds: DOMRect, pad: number): Halo => ({
  cx: rect.left + rect.width / 2 - canvasBounds.left,
  cy: rect.top + rect.height / 2 - canvasBounds.top,
  rx: rect.width / 2 + pad,
  ry: rect.height / 2 + pad,
})

const insideHalo = (x: number, y: number, halo: Halo, pad = 0) => {
  const nx = (x - halo.cx) / (halo.rx + pad)
  const ny = (y - halo.cy) / (halo.ry + pad)
  return nx * nx + ny * ny < 1
}

const haloPane = (halo: Halo): Pane => ({
  left: halo.cx - halo.rx,
  right: halo.cx + halo.rx,
  top: halo.cy - halo.ry,
  bottom: halo.cy + halo.ry,
})

const readHalos = (canvasBounds: DOMRect) => {
  const halos: Halo[] = []
  const logo = document.querySelector<SVGSVGElement>('.hero-logo')
  if (logo) {
    const rect = logo.getBoundingClientRect()
    if (rect.width > 8 && rect.height > 8) {
      const pad = Math.max(56, Math.min(rect.width, rect.height) * 0.16)
      halos.push(haloFromRect(rect, canvasBounds, pad))
    }
  }
  const title = document.querySelector<HTMLElement>('.hero-title')
  if (title) {
    const rect = title.getBoundingClientRect()
    if (rect.width > 8 && rect.height > 8) {
      const pad = Math.max(28, rect.height * 0.28)
      halos.push(haloFromRect(rect, canvasBounds, pad))
    }
  }
  return halos
}

const HALO_SOFT = 1.5

const steerFromHalos = (particle: Particle, zones: Halo[]) => {
  let nearest: { halo: Halo; d: number; nx: number; ny: number } | null = null
  for (const halo of zones) {
    const nx = (particle.x - halo.cx) / halo.rx
    const ny = (particle.y - halo.cy) / halo.ry
    const d = Math.hypot(nx, ny) || 1e-6
    if (d >= HALO_SOFT) continue
    if (!nearest || d < nearest.d) nearest = { halo, d, nx, ny }
  }
  if (!nearest) return

  const { halo, d, nx, ny } = nearest
  const ux = nx / d
  const uy = ny / d
  const radial = particle.directionX * ux + particle.directionY * uy
  const t = d < 1 ? 1 : (HALO_SOFT - d) / (HALO_SOFT - 1)
  const ease = t * t * (3 - 2 * t)

  if (d < 1) {
    particle.x = halo.cx + ux * halo.rx
    particle.y = halo.cy + uy * halo.ry
  }

  if (radial < 0) {
    particle.directionX -= radial * ux * ease
    particle.directionY -= radial * uy * ease
  }

  const speed = Math.hypot(particle.directionX, particle.directionY)
  if (speed < 0.1) {
    const side = particle.x >= halo.cx ? 1 : -1
    particle.directionX += side * 0.1 * ease
    particle.directionY += 0.05 * ease
  }
}

const paneFromRect = (rect: DOMRect, canvasBounds: DOMRect, pad: number): Pane => ({
  left: rect.left - canvasBounds.left - pad,
  right: rect.right - canvasBounds.left + pad,
  top: rect.top - canvasBounds.top - pad,
  bottom: rect.bottom - canvasBounds.top + pad,
})

const readKeepouts = (canvasBounds: DOMRect) =>
  [...document.querySelectorAll<HTMLElement>('.stage-intro__in, .stage-preface, .product-surface')].flatMap((node) => {
    const rect = node.getBoundingClientRect()
    if (rect.width < 8 || rect.height < 8) return []
    return [paneFromRect(rect, canvasBounds, 44)]
  })

const RECT_SOFT = 72

const boxField = (x: number, y: number, pane: Pane) => {
  const cx = (pane.left + pane.right) / 2
  const cy = (pane.top + pane.bottom) / 2
  const hx = (pane.right - pane.left) / 2
  const hy = (pane.bottom - pane.top) / 2
  const qx = Math.abs(x - cx) - hx
  const qy = Math.abs(y - cy) - hy
  const sdf = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0)
  let ux = 0
  let uy = 0
  if (qx > 0 || qy > 0) {
    ux = Math.max(qx, 0) * Math.sign(x - cx)
    uy = Math.max(qy, 0) * Math.sign(y - cy)
    const len = Math.hypot(ux, uy) || 1
    ux /= len
    uy /= len
  } else if (qx > qy) {
    ux = Math.sign(x - cx) || 1
  } else {
    uy = Math.sign(y - cy) || 1
  }
  return { sdf, ux, uy, cx }
}

const steerFromRects = (particle: Particle, rects: Pane[]) => {
  let nearest: { sdf: number; ux: number; uy: number; cx: number } | null = null
  for (const pane of rects) {
    const field = boxField(particle.x, particle.y, pane)
    if (field.sdf >= RECT_SOFT) continue
    if (!nearest || field.sdf < nearest.sdf) nearest = field
  }
  if (!nearest) return

  const { sdf, ux, uy, cx } = nearest
  const t = sdf < 0 ? 1 : (RECT_SOFT - sdf) / RECT_SOFT
  const ease = t * t * (3 - 2 * t)
  const radial = particle.directionX * ux + particle.directionY * uy

  if (sdf < 0) {
    particle.x += ux * -sdf
    particle.y += uy * -sdf
  }

  if (radial < 0) {
    particle.directionX -= radial * ux * ease
    particle.directionY -= radial * uy * ease
  }

  const speed = Math.hypot(particle.directionX, particle.directionY)
  if (speed < 0.1) {
    const side = particle.x >= cx ? 1 : -1
    particle.directionX += side * 0.1 * ease
    particle.directionY += 0.05 * ease
  }
}

export const AetherCanvas = ({ reducedMotion }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reducedMotion) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mouse = { x: null as number | null, y: null as number | null, radius: 200 }
    let particles: Particle[] = []
    let heroAnchors: { x: number; y: number }[] = []
    let logoShape: { x: number; y: number }[] = []
    let logoLinks: Array<[number, number]> = []
    let titleAnchors: { x: number; y: number }[] = []
    let panes: Pane[] = []
    let halos: Halo[] = []
    let keepouts: Pane[] = []
    let frame = 0
    let tick = 0
    let seeded = false
    let assembled = false
    let seedTime = 0
    const tagPlay = new Map<string, {
      started: number | null
      done: boolean
      finishedAt: number | null
      dismissed: boolean
      lastLabel: string | null
      tickAt: number | null
    }>()
    let nextTagStart = 0
    let logoBounds = { minX: 0, maxX: 1, minY: 0, maxY: 1 }

    const seedNearAnchors = () => {
      if (!heroAnchors.length) return
      particles = particles.filter((particle) => !particle.bound)
      let minY = heroAnchors[0].y
      let maxY = heroAnchors[0].y
      heroAnchors.forEach((anchor) => {
        minY = Math.min(minY, anchor.y)
        maxY = Math.max(maxY, anchor.y)
      })
      const span = Math.max(1, maxY - minY)
      seedTime = performance.now()
      for (const [index, anchor] of heroAnchors.entries()) {
        const delay = ((anchor.y - minY) / span) * 0.85 + (index % 7) * 0.02
        const scatter = !assembled
        const drift = scatter ? (Math.random() - 0.5) * 180 : (Math.random() - 0.5) * 4
        const rise = scatter ? 140 + Math.random() * 280 : (Math.random() - 0.5) * 4
        particles.push({
          x: anchor.x + drift,
          y: scatter ? anchor.y - rise : anchor.y + rise,
          directionX: scatter ? (anchor.x - (anchor.x + drift)) * 0.003 : (Math.random() - 0.5) * 0.12,
          directionY: scatter ? 0.12 + Math.random() * 0.18 : (Math.random() - 0.5) * 0.12,
          size: Math.random() * 0.8 + 1.1,
          bound: true,
          home: anchor,
          delay: scatter ? delay : 0,
          tag: null,
        })
      }
    }

    const readScene = () => {
      const canvasBounds = canvas.getBoundingClientRect()
      const toAnchor = (node: HTMLElement) => {
        const rect = node.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2 - canvasBounds.left,
          y: rect.top + rect.height / 2 - canvasBounds.top,
        }
      }
      if (logoShape.length === 0) {
        const sampled = sampleLogoRibbons()
        logoShape = sampled.points
        logoLinks = sampled.links
      }
      heroAnchors = toCanvasAnchors(logoShape, canvasBounds)
      if (heroAnchors.length) {
        logoBounds = {
          minX: Math.min(...heroAnchors.map((anchor) => anchor.x)),
          maxX: Math.max(...heroAnchors.map((anchor) => anchor.x)),
          minY: Math.min(...heroAnchors.map((anchor) => anchor.y)),
          maxY: Math.max(...heroAnchors.map((anchor) => anchor.y)),
        }
      }
      titleAnchors = [...document.querySelectorAll<HTMLElement>('.section-title .stage-node__core')].map(toAnchor)
      if (!seeded && heroAnchors.length > 24) {
        seedNearAnchors()
        seeded = true
      } else if (seeded && heroAnchors.length) {
        const boundParticles = particles.filter((particle) => particle.bound)
        boundParticles.forEach((particle, index) => {
          particle.home = heroAnchors[index] ?? heroAnchors[index % heroAnchors.length]
        })
      }
      panes = [...document.querySelectorAll<HTMLElement>('.product-surface')].map((node) => {
        const rect = node.getBoundingClientRect()
        return {
          left: rect.left - canvasBounds.left,
          right: rect.right - canvasBounds.left,
          top: rect.top - canvasBounds.top,
          bottom: rect.bottom - canvasBounds.top,
        }
      })
      halos = readHalos(canvasBounds)
      keepouts = readKeepouts(canvasBounds)
    }

    const outsideKeepout = (x: number, y: number) =>
      panes.every((pane) => !isInside(x, y, pane, 4))
      && keepouts.every((pane) => !isInside(x, y, pane, 8))
      && halos.every((halo) => !insideHalo(x, y, halo, 8))

    const init = () => {
      particles = []
      const bounds = canvas.getBoundingClientRect()
      halos = readHalos(bounds)
      keepouts = readKeepouts(bounds)
      const count = Math.min(180, Math.max(80, Math.floor((canvas.width * canvas.height) / 18000)))
      for (let i = 0; i < count; i += 1) {
        let x = Math.random() * canvas.width
        let y = Math.random() * canvas.height
        for (let attempt = 0; attempt < 8 && !outsideKeepout(x, y); attempt += 1) {
          x = Math.random() * canvas.width
          y = Math.random() * canvas.height
        }
        particles.push({
          x,
          y,
          directionX: Math.random() * 0.32 - 0.16,
          directionY: Math.random() * 0.18 + 0.1,
          size: Math.random() * 2 + 0.8,
          bound: false,
          home: null,
          delay: 0,
          tag: null,
        })
      }
      const target = Math.min(
        MAX_TAGS,
        Math.max(4, Math.round((canvas.height / Math.max(window.innerHeight, 1)) * 1.2)),
      )
      let minGap = Math.max(220, canvas.height / (target * 1.35))
      const pick = (gap: number) => {
        const chosen: Particle[] = []
        let lastY = -gap
        const candidates = particles
          .filter((particle) => !particle.bound && !particle.tag && outsideKeepout(particle.x, particle.y))
          .sort((left, right) => left.y - right.y)
        for (const particle of candidates) {
          if (chosen.length >= target) break
          if (particle.y - lastY < gap) continue
          chosen.push(particle)
          lastY = particle.y
        }
        return chosen
      }
      let chosen = pick(minGap)
      if (chosen.length < Math.min(target, 4)) chosen = pick(minGap * 0.45)
      const names = shuffle(TAG_NAMES)
      chosen.forEach((particle, index) => {
        particle.tag = makeTag(TAG_KINDS[index % TAG_KINDS.length], names[index % names.length])
        particle.size = Math.max(particle.size, 2.3)
      })
    }

    const resize = () => {
      const parent = canvas.parentElement
      canvas.width = parent?.clientWidth ?? window.innerWidth
      canvas.height = parent?.clientHeight ?? window.innerHeight
      logoShape = []
      logoLinks = []
      init()
      seeded = false
      readScene()
    }

    const shimmerAt = (x: number, y: number) => {
      if (!assembled) return 0
      const elapsed = (performance.now() - seedTime) / 1000 - 2.4
      if (elapsed < 0) return 0
      const phase = (elapsed % 5.6) / 5.6
      const spanX = Math.max(1, logoBounds.maxX - logoBounds.minX)
      const spanY = Math.max(1, logoBounds.maxY - logoBounds.minY)
      const along = ((x - logoBounds.minX) / spanX) * 0.68 + ((y - logoBounds.minY) / spanY) * 0.32
      const pos = phase * 1.55 - 0.22
      const falloff = Math.max(0, 1 - Math.abs(along - pos) / 0.13)
      return falloff * falloff
    }

    const draw = (particle: Particle) => {
      const glow = particle.bound ? shimmerAt(particle.x, particle.y) : 0
      const tagged = Boolean(particle.tag)
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * (1 + glow * 0.45), 0, Math.PI * 2)
      ctx.fillStyle = tagged
        ? 'rgba(210, 228, 246, 0.95)'
        : `rgba(${Math.round(131 + 110 * glow)}, ${Math.round(169 + 72 * glow)}, ${Math.round(204 + 51 * glow)}, ${0.72 + 0.28 * glow})`
      ctx.fill()
    }

    const update = (particle: Particle) => {
      if (particle.x > canvas.width || particle.x < 0) particle.directionX *= -1
      if (mouse.x !== null && mouse.y !== null && (!particle.bound || assembled)) {
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < mouse.radius + particle.size && distance > 0) {
          const force = (mouse.radius - distance) / mouse.radius
          let ox = -(dx / distance) * force * 5
          let oy = -(dy / distance) * force * 5
          if (!particle.bound) {
            for (const pane of keepouts) {
              const field = boxField(particle.x, particle.y, pane)
              if (field.sdf >= RECT_SOFT) continue
              const inward = ox * field.ux + oy * field.uy
              if (inward >= 0) continue
              const t = field.sdf < 0 ? 1 : (RECT_SOFT - field.sdf) / RECT_SOFT
              const ease = t * t * (3 - 2 * t)
              ox -= inward * field.ux * ease
              oy -= inward * field.uy * ease
            }
          }
          particle.x += ox
          particle.y += oy
        }
      }
      if (particle.bound && particle.home) {
        const elapsed = Math.max(0, (performance.now() - seedTime) / 1000 - particle.delay)
        const pull = elapsed <= 0 ? 0 : 1 - Math.exp(-elapsed * 3.4)
        particle.x += (particle.home.x - particle.x) * (0.03 + pull * 0.09)
        particle.y += (particle.home.y - particle.y) * (0.03 + pull * 0.09)
        particle.directionX *= 0.94
        particle.directionY *= 0.94
      } else {
        for (const anchor of titleAnchors) {
          const ax = anchor.x - particle.x
          const ay = anchor.y - particle.y
          const reach = Math.sqrt(ax * ax + ay * ay)
          if (reach < 160 && reach > 0.1) {
            particle.x += (ax / reach) * 0.05
            particle.y += (ay / reach) * 0.05
          }
        }
      }
      particle.x += particle.directionX
      particle.y += particle.directionY
      if (!particle.bound) {
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height
        steerFromHalos(particle, halos)
        steerFromRects(particle, keepouts)
      }
      draw(particle)
    }

    const blocked = (x1: number, y1: number, x2: number, y2: number) =>
      panes.some((pane) => segmentHitsPane(x1, y1, x2, y2, pane))

    const crossesHalo = (x1: number, y1: number, x2: number, y2: number) =>
      halos.some((halo) => segmentHitsPane(x1, y1, x2, y2, haloPane(halo)))

    const crossesKeepout = (x1: number, y1: number, x2: number, y2: number) =>
      keepouts.some((pane) => segmentHitsPane(x1, y1, x2, y2, pane))

    const connect = () => {
      const bound = particles.filter((particle) => particle.bound)
      const settle = (particle: Particle) => {
        if (!particle.home) return 0
        const dist = Math.hypot(particle.x - particle.home.x, particle.y - particle.home.y)
        return Math.max(0, Math.min(1, 1 - dist / 70))
      }
      for (const [i, j] of logoLinks) {
        const left = bound[i]
        const right = bound[j]
        if (!left || !right) continue
        if (blocked(left.x, left.y, right.x, right.y)) continue
        const alpha = settle(left) * settle(right)
        if (alpha < 0.08) continue
        const glow = (shimmerAt(left.x, left.y) + shimmerAt(right.x, right.y)) * 0.5
        ctx.strokeStyle = `rgba(${Math.round(91 + 130 * glow)}, ${Math.round(141 + 90 * glow)}, ${Math.round(239 + 16 * glow)}, ${(0.42 + 0.46 * glow) * alpha})`
        ctx.lineWidth = 1 + glow * 0.8
        ctx.beginPath()
        ctx.moveTo(left.x, left.y)
        ctx.lineTo(right.x, right.y)
        ctx.stroke()
      }

      for (let a = 0; a < particles.length; a += 1) {
        if (particles[a].bound) continue
        for (let b = a + 1; b < particles.length; b += 1) {
          if (particles[b].bound) continue
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = dx * dx + dy * dy
          if (distance < 18000) {
            if (blocked(particles[a].x, particles[a].y, particles[b].x, particles[b].y)) continue
            if (crossesHalo(particles[a].x, particles[a].y, particles[b].x, particles[b].y)) continue
            if (crossesKeepout(particles[a].x, particles[a].y, particles[b].x, particles[b].y)) continue
            const opacity = 1 - distance / 18000
            ctx.strokeStyle = `rgba(91, 141, 239, ${opacity * 0.45})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
        for (const anchor of titleAnchors) {
          const dx = particles[a].x - anchor.x
          const dy = particles[a].y - anchor.y
          const distance = dx * dx + dy * dy
          if (distance < 24000) {
            if (blocked(particles[a].x, particles[a].y, anchor.x, anchor.y)) continue
            if (crossesHalo(particles[a].x, particles[a].y, anchor.x, anchor.y)) continue
            if (crossesKeepout(particles[a].x, particles[a].y, anchor.x, anchor.y)) continue
            ctx.strokeStyle = `rgba(131, 169, 204, ${0.4 * (1 - distance / 24000)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(anchor.x, anchor.y)
            ctx.stroke()
          }
        }
      }
    }

    const placeTags = () => {
      const root = tagsRef.current
      if (!root) return
      const nodes = [...root.querySelectorAll<HTMLElement>('.aether-tag')]
      const tagged = particles.filter((particle) => particle.tag && !particle.bound)
      const canvasTop = canvas.getBoundingClientRect().top
      const now = performance.now()
      const pending: { key: string; x: number; y: number }[] = []

      nodes.forEach((node, index) => {
        const particle = tagged[index]
        if (!particle?.tag) {
          node.classList.remove('is-on')
          return
        }
        const hidden = particle.y < 8
          || particle.y > canvas.height - 8
          || particle.x < 8
          || particle.x > canvas.width - 8
          || panes.some((pane) => isInside(particle.x, particle.y, pane, 10))
        const key = `${particle.tag.kind}-${particle.tag.name}-${index}`
        const play = tagPlay.get(key) ?? {
          started: null,
          done: false,
          finishedAt: null,
          dismissed: false,
          lastLabel: null,
          tickAt: null,
        }
        if (play.done && play.finishedAt != null && now - play.finishedAt >= 5000) play.dismissed = true
        tagPlay.set(key, play)
        node.classList.remove('aether-tag--aum', 'aether-tag--rebalance', 'aether-tag--drift')
        node.classList.add(`aether-tag--${particle.tag.kind}`)
        if (play.dismissed) {
          node.classList.remove('is-on')
          return
        }
        node.classList.toggle('is-on', !hidden)
        if (hidden) return
        const viewY = canvasTop + particle.y
        const inView = viewY > 72 && viewY < window.innerHeight - 56
        if (!play.done && inView && play.started == null) pending.push({ key, x: particle.x, y: viewY })
      })

      for (let i = pending.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        const swap = pending[i]
        pending[i] = pending[j]
        pending[j] = swap
      }
      pending.forEach((item) => {
        const play = tagPlay.get(item.key)
        if (!play || play.started != null) return
        play.started = Math.max(now, nextTagStart) + TAG_VIEW_DELAY_MIN + Math.random() * TAG_VIEW_DELAY_EXTRA
        nextTagStart = play.started + TAG_GAP_MIN + Math.random() * TAG_GAP_EXTRA
      })

      nodes.forEach((node, index) => {
        const particle = tagged[index]
        if (!particle?.tag || !node.classList.contains('is-on')) return
        node.style.transform = `translate(${particle.x}px, ${particle.y}px) translate(-16px, calc(-100% - 12px))`
        const tag = particle.tag
        const name = node.querySelector('.aether-tag__name')
        const copy = node.querySelector('.aether-tag__copy')
        if (name) name.textContent = tag.name
        if (!copy) return
        const key = `${tag.kind}-${tag.name}-${index}`
        const play = tagPlay.get(key) ?? {
          started: null,
          done: false,
          finishedAt: null,
          dismissed: false,
          lastLabel: null,
          tickAt: null,
        }
        const running = tag.kind !== 'aum' && play.started != null && play.started <= now && !play.done
        node.querySelector('.aether-tag__icon')?.classList.toggle('aether-tag__icon--live', running)
        const setTone = (tone: SleeveTone | null) => {
          node.classList.toggle('is-on-target', tone === 'on')
          node.classList.toggle('is-near', tone === 'near')
          node.classList.toggle('is-off', tone === 'off')
        }
        if (tag.kind === 'aum') {
          node.classList.remove('is-met')
          setTone(null)
          const elapsed = play.started == null || play.started > now
            ? 0
            : (now - play.started) / 1000
          const shown = tag.aum + elapsed * Math.max(80, tag.aum * 0.0004)
          const label = money(shown)
          if (play.lastLabel !== label) {
            if (play.lastLabel != null) {
              node.classList.remove('is-tick')
              void node.offsetWidth
              node.classList.add('is-tick')
            }
            play.lastLabel = label
            copy.innerHTML = `<b>${label}</b>`
          }
        } else if (tag.kind === 'rebalance') {
          const t = play.done
            ? 1
            : play.started == null || play.started > now
              ? 0
              : Math.min(1, (now - play.started) / 4600)
          if (t >= 1) play.done = true
          if (play.done && play.finishedAt == null) play.finishedAt = now
          const eased = t * t * (3 - 2 * t)
          const shown = play.done
            ? tag.target
            : tag.current + (tag.target - tag.current) * eased
          const label = pct(shown)
          node.classList.toggle('is-met', play.done)
          setTone(sleeveTone(shown, tag.target))
          if (play.lastLabel !== label || !copy.innerHTML) {
            play.lastLabel = label
            copy.innerHTML = `<em>${tag.sleeve}</em><b>${label}</b><i>${pct(tag.target)}</i>`
          }
        } else {
          const t = play.done
            ? 1
            : play.started == null || play.started > now
              ? 0
              : Math.min(1, (now - play.started) / 22000)
          const remaining = (1 - t) ** 3
          const shown = play.done ? 0 : tag.drift * remaining
          const label = play.done ? '0%' : pct(shown)
          if (t >= 1 || label === '0%') play.done = true
          if (play.done && play.finishedAt == null) play.finishedAt = now
          node.classList.toggle('is-met', play.done)
          setTone(sleeveTone(shown, 0))
          if (play.lastLabel !== label || !copy.innerHTML) {
            play.lastLabel = label
            copy.innerHTML = `<b>${label}</b><i>drift</i>`
          }
        }
      })
    }

    const animate = () => {
      frame = requestAnimationFrame(animate)
      tick += 1
      if (tick % 8 === 0) readScene()
      if (!assembled && seeded && performance.now() - seedTime > 2400) assembled = true
      ctx.fillStyle = '#07090d'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      particles.forEach(update)
      connect()
      placeTags()
    }

    const onMove = (event: MouseEvent) => {
      const bounds = canvas.getBoundingClientRect()
      mouse.x = event.clientX - bounds.left
      mouse.y = event.clientY - bounds.top
    }
    const onOut = () => {
      mouse.x = null
      mouse.y = null
    }

    let lastW = 0
    let lastH = 0
    const applySize = () => {
      const parent = canvas.parentElement
      const width = parent?.clientWidth ?? window.innerWidth
      const height = parent?.clientHeight ?? window.innerHeight
      if (width === lastW && height === lastH) return
      lastW = width
      lastH = height
      resize()
    }
    applySize()
    animate()
    const resizeObserver = new ResizeObserver(applySize)
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)
    window.addEventListener('resize', applySize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onOut)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', applySize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  return (
    <div
      className={`aether-field${reducedMotion ? ' aether-field--still' : ''}`}
      data-aether-field
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
      <div className="aether-tags" ref={tagsRef}>
        {Array.from({ length: MAX_TAGS }, (_, index) => (
          <div key={index} className="aether-tag">
            <span className="aether-tag__name" />
            <span className="aether-tag__row">
              <span className="aether-tag__icon">
                <User size={11} strokeWidth={2} />
              </span>
              <span className="aether-tag__copy" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
