import { useEffect, useRef } from 'react'
import { site } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const PLANETS = [
  { size: 18, orbit: 54, speed: 16, color: '#00F5D4', delay: 0 },
  { size: 12, orbit: 64, speed: 24, color: '#FF46A2', delay: -3 },
  { size: 20, orbit: 74, speed: 32, color: '#7C5CFF', delay: -7 },
  { size: 10, orbit: 86, speed: 20, color: '#FFB020', delay: -11 },
  { size: 16, orbit: 98, speed: 40, color: '#4CC9F0', delay: -2 },
  { size: 14, orbit: 110, speed: 28, color: '#FF46A2', delay: -15 },
  { size: 11, orbit: 122, speed: 48, color: '#00F5D4', delay: -6 },
  { size: 9, orbit: 132, speed: 36, color: '#7C5CFF', delay: -19 },
]

/** Large circular portrait with small planets orbiting around it. */
export function OrbitPortrait() {
  const reduced = usePrefersReducedMotion()
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !root.current) return
    const el = root.current
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`)
      el.style.setProperty('--tilt-y', `${(x * 10).toFixed(2)}deg`)
    }
    const onLeave = () => {
      el.style.setProperty('--tilt-x', '0deg')
      el.style.setProperty('--tilt-y', '0deg')
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  return (
    <div
      ref={root}
      className="orbit-portrait relative mx-auto aspect-square w-full max-w-[420px]"
      style={{ perspective: '900px' }}
    >
      <div className="orbit-inner absolute inset-[14%] overflow-hidden rounded-full border border-white/30 shadow-[0_0_60px_rgba(255,70,162,0.25),0_0_80px_rgba(0,245,212,0.18)]">
        <img
          src={site.photo}
          alt={`Portrait de ${site.fullName}`}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/25" />
      </div>

      {PLANETS.map((p, i) => (
        <span
          key={i}
          className="planet absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            background: `radial-gradient(circle at 30% 30%, #fff, ${p.color})`,
            boxShadow: `0 0 16px ${p.color}`,
            ['--orbit' as string]: `${p.orbit}%`,
            ['--speed' as string]: `${p.speed}s`,
            ['--delay' as string]: `${p.delay}s`,
            animationPlayState: reduced ? 'paused' : 'running',
          }}
          aria-hidden
        />
      ))}

      <style>{`
        .orbit-inner {
          transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
          transition: transform 0.35s ease;
        }
        .planet {
          offset-path: circle(var(--orbit) at 50% 50%);
          animation: orbitSpin var(--speed) linear infinite;
          animation-delay: var(--delay);
        }
        @keyframes orbitSpin {
          to { offset-distance: 100%; }
        }
        @supports not (offset-path: circle(50%)) {
          .planet { display: none; }
        }
      `}</style>
    </div>
  )
}
