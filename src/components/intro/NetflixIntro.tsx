import { useEffect, useRef, useState } from 'react'
import { LogoQ } from '@/components/brand/LogoQ'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type Props = { onDone: () => void }

/**
 * Netflix-inspired cold open:
 * black → spark → Q builds → flash → QUENTIN → fade to site.
 */
export function NetflixIntro({ onDone }: Props) {
  const reduced = usePrefersReducedMotion()
  const audioCtx = useRef<AudioContext | null>(null)
  const [phase, setPhase] = useState<'black' | 'draw' | 'name' | 'out'>('black')

  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(onDone, 350)
      return () => window.clearTimeout(t)
    }
    const t1 = window.setTimeout(() => setPhase('draw'), 280)
    const t2 = window.setTimeout(() => setPhase('name'), 2100)
    const t3 = window.setTimeout(() => setPhase('out'), 3400)
    const t4 = window.setTimeout(onDone, 4100)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.clearTimeout(t4)
    }
  }, [onDone, reduced])

  useEffect(() => {
    if (reduced) return
    let cancelled = false
    const play = async () => {
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new Ctx()
        audioCtx.current = ctx
        await ctx.resume()
        if (cancelled) return
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(70, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 1.1)
        gain.gain.setValueAtTime(0.0001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.15)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 1.45)
      } catch {
        /* autoplay blocked */
      }
    }
    const d = window.setTimeout(() => void play(), 500)
    return () => {
      cancelled = true
      window.clearTimeout(d)
      void audioCtx.current?.close()
    }
  }, [reduced])

  return (
    <div
      className={`intro-root fixed inset-0 z-[100] grid place-items-center bg-black transition-opacity duration-700 ${
        phase === 'out' ? 'opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-label="Introduction cinématique Quentin"
    >
      <button
        type="button"
        onClick={onDone}
        className="absolute top-5 right-5 z-10 rounded-md border border-white/20 bg-black/40 px-3 py-1.5 text-xs tracking-wide text-white/80 backdrop-blur hover:border-cyan/50 hover:text-white"
      >
        Passer l’intro
      </button>

      <div className="relative flex flex-col items-center gap-10">
        <div className={`intro-mark ${phase === 'black' ? 'is-wait' : 'is-draw'}`} aria-hidden>
          <span className="intro-spark" />
          <svg className="intro-stroke" viewBox="0 0 120 120" width="200" height="200">
            <defs>
              <linearGradient id="netQ" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="50%" stopColor="#176BFF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              className="ring"
              cx="56"
              cy="56"
              r="34"
              fill="none"
              stroke="url(#netQ)"
              strokeWidth="9"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <path
              className="tail"
              d="M72 72 L98 98"
              fill="none"
              stroke="url(#netQ)"
              strokeWidth="10"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </svg>
          <div className={`intro-flash ${phase === 'name' || phase === 'out' ? 'on' : ''}`} />
        </div>

        <div
          className={`intro-brand flex flex-col items-center gap-3 transition ${
            phase === 'name' || phase === 'out' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <LogoQ size={36} className="opacity-90" />
          <p className="font-display text-3xl font-bold tracking-[0.42em] text-white md:text-5xl">
            QUENTIN
          </p>
          <p className="text-[10px] tracking-[0.35em] text-cyan/80 uppercase">
            Create your own universe
          </p>
        </div>
      </div>

      <style>{`
        .intro-mark { position: relative; width: 200px; height: 200px; display: grid; place-items: center; }
        .intro-spark {
          position: absolute; width: 8px; height: 8px; border-radius: 50%;
          background: #00e5ff; box-shadow: 0 0 20px #00e5ff, 0 0 40px #8b5cf6;
          opacity: 0; animation: spark 0.5s ease-out 0.35s forwards;
        }
        .intro-stroke .ring {
          stroke-dasharray: 220; stroke-dashoffset: 220;
        }
        .intro-stroke .tail {
          stroke-dasharray: 55; stroke-dashoffset: 55;
        }
        .intro-mark.is-draw .ring { animation: draw 1.35s 0.15s cubic-bezier(.2,.8,.2,1) forwards; }
        .intro-mark.is-draw .tail { animation: draw 0.45s 1.25s ease-out forwards; }
        .intro-flash {
          position: absolute; inset: -30%; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(255,255,255,.45), rgba(0,229,255,.2) 35%, transparent 65%);
          opacity: 0; transform: scale(.4);
        }
        .intro-flash.on { animation: flash .7s ease-out forwards; }
        .intro-brand { transition: opacity .55s ease, transform .55s ease; }
        @keyframes spark { from { opacity: 0; transform: scale(.2); } to { opacity: 1; transform: scale(1); } }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes flash { 0% { opacity: 0; transform: scale(.4); } 35% { opacity: 1; } 100% { opacity: 0; transform: scale(1.4); } }
        @media (prefers-reduced-motion: reduce) {
          .intro-spark, .intro-stroke .ring, .intro-stroke .tail, .intro-flash { animation: none !important; opacity: 1; stroke-dashoffset: 0; }
          .intro-brand { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  )
}
