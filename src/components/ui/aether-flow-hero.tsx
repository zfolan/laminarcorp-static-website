"use client"

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.2 + 0.5,
      duration: 0.8,
      ease: 'easeInOut',
    },
  }),
}

const AetherFlowHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = Boolean(useReducedMotion())

  useEffect(() => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return

    const canvasContext = canvasElement.getContext('2d')
    if (!canvasContext) return

    const canvas = canvasElement
    const context = canvasContext

    let animationFrameId: number | undefined
    let particles: Particle[] = []
    const mouse: { x: number | null; y: number | null; radius: number } = { x: null, y: null, radius: 200 }

    class Particle {
      constructor(
        public x: number,
        public y: number,
        public directionX: number,
        public directionY: number,
        public size: number,
        public color: string,
      ) {}

      draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fillStyle = this.color
        context.fill()
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.directionX *= -1
        if (this.y > canvas.height || this.y < 0) this.directionY *= -1

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const distance = Math.hypot(dx, dy)

          if (distance > 0 && distance < mouse.radius + this.size) {
            const force = (mouse.radius - distance) / mouse.radius
            this.x -= (dx / distance) * force * 5
            this.y -= (dy / distance) * force * 5
          }
        }

        this.x += this.directionX
        this.y += this.directionY
        this.draw()
      }
    }

    const initializeParticles = () => {
      const particleCount = Math.min((canvas.height * canvas.width) / 9000, 180)
      particles = Array.from({ length: particleCount }, () => {
        const size = Math.random() * 2 + 1
        return new Particle(
          Math.random() * (canvas.width - size * 4) + size * 2,
          Math.random() * (canvas.height - size * 4) + size * 2,
          Math.random() * 0.4 - 0.2,
          Math.random() * 0.4 - 0.2,
          size,
          'rgba(191, 128, 255, 0.8)',
        )
      })
    }

    const connectParticles = () => {
      const connectionDistance = Math.min(20_000, (canvas.width / 7) * (canvas.height / 7))

      for (let first = 0; first < particles.length; first += 1) {
        for (let second = first + 1; second < particles.length; second += 1) {
          const dx = particles[first].x - particles[second].x
          const dy = particles[first].y - particles[second].y
          const distanceSquared = dx * dx + dy * dy
          if (distanceSquared >= connectionDistance) continue

          const opacity = 1 - distanceSquared / 20_000
          const nearPointer = mouse.x !== null
            && mouse.y !== null
            && Math.hypot(particles[first].x - mouse.x, particles[first].y - mouse.y) < mouse.radius

          context.strokeStyle = nearPointer
            ? `rgba(255, 255, 255, ${opacity})`
            : `rgba(200, 150, 255, ${opacity})`
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(particles[first].x, particles[first].y)
          context.lineTo(particles[second].x, particles[second].y)
          context.stroke()
        }
      }
    }

    const drawFrame = () => {
      context.fillStyle = 'black'
      context.fillRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle) => particle.update())
      connectParticles()
    }

    const animate = () => {
      drawFrame()
      animationFrameId = window.requestAnimationFrame(animate)
    }

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth || window.innerWidth
      canvas.height = canvas.clientHeight || window.innerHeight
      initializeParticles()
      drawFrame()
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      mouse.x = event.clientX - bounds.left
      mouse.y = event.clientY - bounds.top
    }

    const clearPointer = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    if (!reducedMotion) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('blur', clearPointer)
      animationFrameId = window.requestAnimationFrame(animate)
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', clearPointer)
      if (animationFrameId !== undefined) window.cancelAnimationFrame(animationFrameId)
    }
  }, [reducedMotion])

  const initial = reducedMotion ? false : 'hidden'

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black" aria-labelledby="aether-flow-title">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      <div className="relative z-10 p-6 text-center">
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial={initial}
          animate="visible"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 backdrop-blur-sm"
        >
          <Zap className="h-4 w-4 text-purple-400" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-200">Dynamic Rendering Engine</span>
        </motion.div>

        <motion.h1
          id="aether-flow-title"
          custom={1}
          variants={fadeUpVariants}
          initial={initial}
          animate="visible"
          className="mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-5xl font-bold tracking-tighter text-transparent md:text-8xl"
        >
          Aether Flow
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUpVariants}
          initial={initial}
          animate="visible"
          className="mx-auto mb-10 max-w-2xl text-lg text-gray-400"
        >
          An intelligent, adaptive framework for creating fluid digital experiences that feel alive and respond to user interaction in real-time.
        </motion.p>

        <motion.div custom={3} variants={fadeUpVariants} initial={initial} animate="visible">
          <button
            type="button"
            className="mx-auto flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-black! shadow-lg transition-colors duration-300 hover:bg-gray-200"
          >
            Explore the Engine
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default AetherFlowHero
