import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type Props = {
  onDone: () => void
}

export function NetflixIntro({ onDone }: Props) {
  const reduced = usePrefersReducedMotion()
  const audioCtx = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(onDone, 400)
      return () => window.clearTimeout(t)
    }

    const t = window.setTimeout(onDone, 4200)
    return () => window.clearTimeout(t)
  }, [onDone, reduced])

  useEffect(() => {
    if (reduced) return

    let cancelled = false
    const playWhoosh = async () => {
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new Ctx()
        audioCtx.current = ctx
        await ctx.resume()
        if (cancelled) return

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(90, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.9)
        gain.gain.setValueAtTime(0.0001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.12)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 1.25)
      } catch {
        /* autoplay / audio blocked — silent fallback */
      }
    }

    const delay = window.setTimeout(() => void playWhoosh(), 600)
    return () => {
      cancelled = true
      window.clearTimeout(delay)
      void audioCtx.current?.close()
    }
  }, [reduced])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050509]"
      role="dialog"
      aria-label="Introduction cinématique"
    >
      <button
        type="button"
        onClick={onDone}
        className="absolute top-5 right-5 z-10 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs tracking-wide text-snow/80 backdrop-blur transition hover:border-cyan/40 hover:text-snow"
      >
        Passer l’intro
      </button>

      <div className="relative flex flex-col items-center gap-8">
        <div className="intro-stage relative grid place-items-center" aria-hidden>
          <span className="intro-spark" />
          <svg className="intro-q" viewBox="0 0 120 120" width="168" height="168">
            <defs>
              <linearGradient id="qGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="55%" stopColor="#176BFF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <circle
              className="intro-q-ring"
              cx="56"
              cy="56"
              r="34"
              fill="none"
              stroke="url(#qGlow)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              className="intro-q-tail"
              d="M72 72 L96 96"
              fill="none"
              stroke="url(#qGlow)"
              strokeWidth="11"
              strokeLinecap="round"
            />
          </svg>
          <div className="intro-burst" />
        </div>

        <p className="intro-name font-display text-3xl font-bold tracking-[0.35em] text-snow neon-text md:text-4xl">
          QUENTIN
        </p>
      </div>

      <style>{`
        .intro-spark {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #00e5ff;
          box-shadow: 0 0 24px #00e5ff, 0 0 48px #8b5cf6;
          animation: sparkIn 0.55s ease-out both;
        }
        .intro-q-ring {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: drawQ 1.4s 0.45s ease-out forwards;
          filter: drop-shadow(0 0 12px rgba(0, 229, 255, 0.55));
        }
        .intro-q-tail {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: drawTail 0.55s 1.55s ease-out forwards;
          filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
        }
        .intro-burst {
          position: absolute;
          inset: -20%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 229, 255, 0.35), transparent 60%);
          opacity: 0;
          animation: burst 0.9s 2.1s ease-out forwards;
          pointer-events: none;
        }
        .intro-name {
          opacity: 0;
          transform: translateY(12px);
          animation: nameIn 0.7s 2.45s ease-out forwards;
        }
        @keyframes sparkIn {
          from { opacity: 0; transform: scale(0.2); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes drawQ {
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawTail {
          to { stroke-dashoffset: 0; }
        }
        @keyframes burst {
          0% { opacity: 0; transform: scale(0.4); }
          40% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.35); }
        }
        @keyframes nameIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .intro-spark, .intro-q-ring, .intro-q-tail, .intro-burst, .intro-name {
            animation: none !important;
            opacity: 1;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}
