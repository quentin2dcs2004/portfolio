import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { playIntroTone } from '@/lib/sound'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface Props {
  onComplete: () => void
  onSkip: () => void
}

export function CinematicIntro({ onComplete, onSkip }: Props) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<'dark' | 'particle' | 'draw' | 'burst' | 'name' | 'out'>(
    reduced ? 'name' : 'dark',
  )
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const played = useRef(false)

  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(onComplete, 900)
      return () => window.clearTimeout(t)
    }

    const timers = [
      window.setTimeout(() => setPhase('particle'), 400),
      window.setTimeout(() => setPhase('draw'), 900),
      window.setTimeout(() => {
        if (!played.current) {
          played.current = true
          playIntroTone(false)
        }
        setPhase('burst')
      }, 2600),
      window.setTimeout(() => setPhase('name'), 3400),
      window.setTimeout(() => setPhase('out'), 4300),
      window.setTimeout(onComplete, 5000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete, reduced])

  useEffect(() => {
    if (reduced || phase !== 'burst') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    const particles = Array.from({ length: 80 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 6
      return {
        x: w / 2,
        y: h / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: Math.random() > 0.5 ? '#00E5FF' : '#8B5CF6',
        size: 1 + Math.random() * 2.5,
      }
    })

    let frame = 0
    let raf = 0
    const render = () => {
      frame += 1
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.016
        ctx.globalAlpha = Math.max(p.life, 0)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      if (frame < 90) raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(raf)
  }, [phase, reduced])

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-void"
      animate={phase === 'out' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />

      <div className="relative flex flex-col items-center gap-6">
        {(phase === 'particle' || phase === 'draw' || phase === 'burst' || phase === 'name') && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <svg viewBox="0 0 200 200" className="h-40 w-40 md:h-52 md:w-52">
              <defs>
                <linearGradient id="qGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="50%" stopColor="#176BFF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <motion.circle
                cx="100"
                cy="95"
                r="55"
                fill="none"
                stroke="url(#qGlow)"
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#softGlow)"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{
                  pathLength: phase === 'particle' ? 0.08 : 1,
                  opacity: 1,
                }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />
              <motion.path
                d="M138 138 L168 168"
                fill="none"
                stroke="url(#qGlow)"
                strokeWidth="10"
                strokeLinecap="round"
                filter="url(#softGlow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase === 'particle' ? 0 : 1 }}
                transition={{ duration: 0.7, delay: 1.1 }}
              />
              <motion.circle
                cx="100"
                cy="95"
                r="4"
                fill="#00E5FF"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'particle' ? 1 : [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        )}

        {(phase === 'name' || phase === 'out') && (
          <motion.h1
            initial={{ opacity: 0, letterSpacing: '0.6em', y: 10 }}
            animate={{ opacity: 1, letterSpacing: '0.35em', y: 0 }}
            className="font-display text-2xl text-snow md:text-4xl"
          >
            QUENTIN
          </motion.h1>
        )}
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="absolute right-6 bottom-6 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-widest text-mist uppercase hover:text-snow"
      >
        Passer
      </button>
    </motion.div>
  )
}
