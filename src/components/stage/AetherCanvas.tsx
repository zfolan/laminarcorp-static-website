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
    let anchors: { x: number; y: number }[] = []
    let frame = 0
    let tick = 0

    const readAnchors = () => {
      const canvasBounds = canvas.getBoundingClientRect()
      anchors = [...document.querySelectorAll<HTMLElement>('.stage-node__core')].map((node) => {
        const rect = node.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2 - canvasBounds.left,
          y: rect.top + rect.height / 2 - canvasBounds.top,
        }
      })
    }

    const init = () => {
      particles = []
      const count = Math.min(240, Math.max(90, Math.floor((canvas.width * canvas.height) / 16000)))
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          directionX: Math.random() * 0.32 - 0.16,
          directionY: Math.random() * 0.18 + 0.1,
          size: Math.random() * 2 + 0.8,
        })
      }
    }

    const resize = () => {
      const parent = canvas.parentElement
      canvas.width = parent?.clientWidth ?? window.innerWidth
      canvas.height = parent?.clientHeight ?? window.innerHeight
      init()
      readAnchors()
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
      for (const anchor of anchors) {
        const ax = anchor.x - particle.x
        const ay = anchor.y - particle.y
        const reach = Math.sqrt(ax * ax + ay * ay)
        if (reach < 160 && reach > 0.1) {
          particle.x += (ax / reach) * 0.05
          particle.y += (ay / reach) * 0.05
        }
      }
      particle.x += particle.directionX
      particle.y += particle.directionY
      if (particle.y > canvas.height) particle.y = 0
      if (particle.y < 0) particle.y = canvas.height
      draw(particle)
    }

    const connect = () => {
      for (let a = 0; a < particles.length; a += 1) {
        for (let b = a + 1; b < particles.length; b += 1) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = dx * dx + dy * dy
          if (distance < 18000) {
            const opacity = 1 - distance / 18000
            ctx.strokeStyle = `rgba(91, 141, 239, ${opacity * 0.45})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
        for (const anchor of anchors) {
          const dx = particles[a].x - anchor.x
          const dy = particles[a].y - anchor.y
          const distance = dx * dx + dy * dy
          if (distance < 24000) {
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
      if (tick % 8 === 0) readAnchors()
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
