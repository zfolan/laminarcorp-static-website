import { useEffect, useRef } from 'react'

type Props = {
  reducedMotion: boolean
}

type Particle = {
  x: number
  y: number
  directionX: number
  directionY: number
  size: number
  bound: boolean
  home: { x: number; y: number } | null
}

type Pane = {
  left: number
  right: number
  top: number
  bottom: number
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

const bounceOffPanes = (particle: Particle, panes: Pane[]) => {
  for (const pane of panes) {
    if (!isInside(particle.x, particle.y, pane, particle.size)) continue
    const dl = particle.x - pane.left
    const dr = pane.right - particle.x
    const dt = particle.y - pane.top
    const db = pane.bottom - particle.y
    const nearest = Math.min(dl, dr, dt, db)
    const gap = particle.size + 0.8
    if (nearest === dl) {
      particle.x = pane.left - gap
      particle.directionX = -Math.abs(particle.directionX) || -0.12
    } else if (nearest === dr) {
      particle.x = pane.right + gap
      particle.directionX = Math.abs(particle.directionX) || 0.12
    } else if (nearest === dt) {
      particle.y = pane.top - gap
      particle.directionY = -Math.abs(particle.directionY) || -0.12
    } else {
      particle.y = pane.bottom + gap
      particle.directionY = Math.abs(particle.directionY) || 0.12
    }
  }
}

export const AetherCanvas = ({ reducedMotion }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    let frame = 0
    let tick = 0
    let seeded = false

    const seedNearAnchors = () => {
      if (!heroAnchors.length) return
      particles = particles.filter((particle) => !particle.bound)
      for (const anchor of heroAnchors) {
        particles.push({
          x: anchor.x + (Math.random() - 0.5) * 4,
          y: anchor.y + (Math.random() - 0.5) * 4,
          directionX: (Math.random() - 0.5) * 0.12,
          directionY: (Math.random() - 0.5) * 0.12,
          size: Math.random() * 0.8 + 1.1,
          bound: true,
          home: anchor,
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
    }

    const outsidePanes = (x: number, y: number) => panes.every((pane) => !isInside(x, y, pane, 4))

    const init = () => {
      particles = []
      const count = Math.min(180, Math.max(80, Math.floor((canvas.width * canvas.height) / 18000)))
      for (let i = 0; i < count; i += 1) {
        let x = Math.random() * canvas.width
        let y = Math.random() * canvas.height
        for (let attempt = 0; attempt < 8 && !outsidePanes(x, y); attempt += 1) {
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
        })
      }
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

    const draw = (particle: Particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(131, 169, 204, 0.72)'
      ctx.fill()
    }

    const update = (particle: Particle) => {
      if (particle.x > canvas.width || particle.x < 0) particle.directionX *= -1
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < mouse.radius + particle.size && distance > 0) {
          const force = (mouse.radius - distance) / mouse.radius
          particle.x -= (dx / distance) * force * 5
          particle.y -= (dy / distance) * force * 5
        }
      }
      if (particle.bound && particle.home) {
        particle.x += (particle.home.x - particle.x) * 0.08
        particle.y += (particle.home.y - particle.y) * 0.08
        particle.directionX *= 0.96
        particle.directionY *= 0.96
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
      }
      bounceOffPanes(particle, panes)
      if (panes.some((pane) => isInside(particle.x, particle.y, pane, particle.size))) return
      draw(particle)
    }

    const blocked = (x1: number, y1: number, x2: number, y2: number) =>
      panes.some((pane) => segmentHitsPane(x1, y1, x2, y2, pane))

    const connect = () => {
      const bound = particles.filter((particle) => particle.bound)
      for (const [i, j] of logoLinks) {
        const left = bound[i]
        const right = bound[j]
        if (!left || !right) continue
        if (blocked(left.x, left.y, right.x, right.y)) continue
        ctx.strokeStyle = 'rgba(91, 141, 239, 0.42)'
        ctx.lineWidth = 1
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

    const animate = () => {
      frame = requestAnimationFrame(animate)
      tick += 1
      if (tick % 8 === 0) readScene()
      ctx.fillStyle = '#07090d'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      particles.forEach(update)
      connect()
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

    resize()
    animate()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onOut)
    return () => {
      window.removeEventListener('resize', resize)
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
    </div>
  )
}
