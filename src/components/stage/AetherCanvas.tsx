import { useEffect, useRef } from 'react'

type Props = {
  dimmed: boolean
  reducedMotion: boolean
  onEmptyPointerDown: () => void
}

type Particle = {
  x: number
  y: number
  directionX: number
  directionY: number
  size: number
}

export const AetherCanvas = ({ dimmed, reducedMotion, onEmptyPointerDown }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reducedMotion) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mouse = { x: null as number | null, y: null as number | null, radius: 200 }
    let particles: Particle[] = []
    let frame = 0

    const init = () => {
      particles = []
      const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 14000))
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          directionX: Math.random() * 0.4 - 0.2,
          directionY: Math.random() * 0.4 - 0.2,
          size: Math.random() * 2 + 0.8,
        })
      }
    }

    const resize = () => {
      const parent = canvas.parentElement
      canvas.width = parent?.clientWidth ?? window.innerWidth
      canvas.height = parent?.clientHeight ?? window.innerHeight
      init()
    }

    const draw = (particle: Particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(131, 169, 204, 0.72)'
      ctx.fill()
    }

    const update = (particle: Particle) => {
      if (particle.x > canvas.width || particle.x < 0) particle.directionX *= -1
      if (particle.y > canvas.height || particle.y < 0) particle.directionY *= -1
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < mouse.radius + particle.size) {
          const force = (mouse.radius - distance) / mouse.radius
          particle.x -= (dx / distance) * force * 5
          particle.y -= (dy / distance) * force * 5
        }
      }
      particle.x += particle.directionX
      particle.y += particle.directionY
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
      }
    }

    const animate = () => {
      frame = requestAnimationFrame(animate)
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
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onOut)
    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onOut)
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  return (
    <div
      className={`aether-field${dimmed ? ' aether-field--dimmed' : ''}${reducedMotion ? ' aether-field--still' : ''}`}
      data-aether-field
      aria-hidden="true"
      onPointerDown={onEmptyPointerDown}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
