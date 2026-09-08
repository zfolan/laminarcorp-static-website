import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const
const letters = ['L', 'A', 'M', 'I', 'N', 'A', 'R']

export const HeroMark = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <div className={`hero-mark${reducedMotion ? ' hero-mark--still' : ''}`}>
    <svg
      className="hero-logo"
      viewBox="0 0 700 615"
      aria-hidden="true"
      focusable="false"
    >
      <polygon points="99,455 354,0 630,488 528,488 354,166 257,349" />
      <polygon points="417,571 534,513 643,513 700,615 470,615" />
      <path d="M0 592c72-42 132-105 194-158 62-54 126-98 193-105 64-7 116 19 123 85-20-39-61-61-108-62-74-1-137 47-195 105C145 520 92 574 0 592Z" />
      <path d="M65 615c91-32 139-97 184-151 36-43 74-77 130-90 46-11 94-4 131 30-38-19-81-22-119-10-70 22-105 83-143 135-41 56-90 89-183 86Z" />
      <path d="M291 451c24-53 70-83 122-81 41 1 78 19 97 46-26-21-59-31-88-25-52 10-83 55-80 104 3 46 35 82 91 102 14 5 31 10 50 15-79 7-140-9-181-48-31-31-42-72-11-113Z" />
    </svg>
    <h1 className="hero-title" aria-label="LAMINAR">
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          aria-hidden="true"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reducedMotion ? 0 : 1.12 + index * 0.07,
            duration: reducedMotion ? 0 : 0.65,
            ease,
          }}
        >
          {letter}
        </motion.span>
      ))}
    </h1>
  </div>
)
