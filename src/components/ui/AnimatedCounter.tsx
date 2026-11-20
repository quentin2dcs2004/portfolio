import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type Props = {
  value: number
  label: string
}

export function AnimatedCounter({ value, label }: Props) {
  const reduced = usePrefersReducedMotion()
  const [n, setN] = useState(reduced ? value : 0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started.current) return
        started.current = true
        const start = performance.now()
        const dur = 1100
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur)
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, value])

  return (
    <div ref={ref} className="glass rounded-2xl px-5 py-4 text-center">
      <p className="font-display text-3xl font-bold text-cyan tabular-nums">{n}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  )
}
