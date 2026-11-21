import { lazy, Suspense, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LogoQ } from '@/components/brand/LogoQ'
import { PageTransition } from '@/components/ui/PageTransition'
import { bookSpreads } from '@/data/site'

const HyperField = lazy(() =>
  import('@/components/three/HyperField').then((m) => ({ default: m.HyperField })),
)

export function Portfolio() {
  const [index, setIndex] = useState(0)
  const [anim, setAnim] = useState<'idle' | 'next' | 'prev'>('idle')
  const safeIndex = Math.min(index, bookSpreads.length - 1)
  const spread = bookSpreads[safeIndex]!

  const go = (next: number, dir: 'next' | 'prev') => {
    if (anim !== 'idle' || next < 0 || next >= bookSpreads.length) return
    setAnim(dir)
    window.setTimeout(() => {
      setIndex(next)
      setAnim('idle')
    }, 780)
  }

  return (
    <PageTransition>
      <div className="page-pad wrap !pt-24">
        <p className="text-xs tracking-[0.28em] text-[#7C5CFF] uppercase">Livre</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Portfolio relié</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Couverture → sommaire → doubles pages (photo + fiche technique / matériel).
        </p>
        <Suspense fallback={null}>
          <div className="mt-6">
            <HyperField theme="violet" density="panel" height="h-[160px] md:h-[200px]" />
          </div>
        </Suspense>

        <div className="mx-auto mt-8 max-w-5xl [perspective:2400px]">
          <div
            className={`book-shell relative mx-auto min-h-[460px] rounded-md bg-[#1a1028] p-2 shadow-[0_40px_120px_rgba(124,92,255,0.35)] md:min-h-[520px] ${
              anim === 'next' ? 'is-next' : anim === 'prev' ? 'is-prev' : ''
            }`}
          >
            {/* spine */}
            <div className="pointer-events-none absolute inset-y-3 left-1/2 z-20 hidden w-3 -translate-x-1/2 bg-gradient-to-r from-black/50 via-[#3b2a55] to-black/40 md:block" />

            {spread.kind === 'cover' ? (
              <div className="cover grid min-h-[440px] place-items-center rounded bg-gradient-to-br from-[#2a1848] via-[#12081f] to-[#0a0614] text-center md:min-h-[500px]">
                <div className="animate-[fadeUp_0.6s_ease]">
                  <LogoQ size={88} className="mx-auto drop-shadow-[0_0_20px_rgba(0,245,212,0.45)]" />
                  <h2 className="mt-6 font-display text-3xl font-bold md:text-4xl">{spread.title}</h2>
                  <p className="mt-3 tracking-[0.28em] text-[#00F5D4] uppercase">{spread.subtitle}</p>
                  {index === 0 ? (
                    <button
                      type="button"
                      className="mt-8 rounded-full border border-white/35 px-6 py-2.5 text-sm hover:bg-white/10"
                      onClick={() => go(1, 'next')}
                    >
                      Ouvrir le livre
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            {spread.kind === 'toc' ? (
              <div className="grid min-h-[440px] place-items-center rounded bg-[#f4efe6] p-8 text-[#1a1424] md:min-h-[500px]">
                <div className="w-full max-w-md">
                  <h2 className="font-display text-3xl font-bold">{spread.title}</h2>
                  <ol className="mt-8 space-y-3">
                    {spread.entries.map((e, i) => (
                      <li key={e.label}>
                        <button
                          type="button"
                          className="flex w-full items-baseline justify-between gap-3 border-b border-dashed border-[#cfc3b0] pb-2 text-left text-sm hover:text-[#7C5CFF]"
                          onClick={() => go(i + 2, 'next')}
                        >
                          <span>
                            {i + 1}. {e.label}
                          </span>
                          <span className="text-[#6b6478]">p.{e.page}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : null}

            {spread.kind === 'spread' ? (
              <div className="spread-grid grid min-h-[440px] grid-cols-1 overflow-hidden rounded md:min-h-[500px] md:grid-cols-2">
                <article className="page-left relative bg-[#f7f2ea] p-6 text-[#1a1424] md:p-8">
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/10 to-transparent" />
                  {spread.left.image ? (
                    <img
                      src={spread.left.image}
                      alt={spread.left.caption ?? ''}
                      className="mb-4 aspect-[4/3] w-full rounded-sm object-cover shadow-md"
                    />
                  ) : null}
                  <h2 className="font-display text-2xl font-bold">{spread.left.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#3a3348]">{spread.left.text}</p>
                  {spread.left.caption ? (
                    <p className="mt-3 text-xs text-[#6b6478] italic">{spread.left.caption}</p>
                  ) : null}
                </article>
                <article className="page-right relative bg-[#f3ece2] p-6 text-[#1a1424] md:p-8">
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent" />
                  <h2 className="font-display text-2xl font-bold">{spread.right.title}</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#3a3348]">
                    {spread.right.text}
                  </p>
                  <div className="mt-6 rounded-lg border border-[#d6cbb8] bg-white/50 p-3 text-xs text-[#5a5366]">
                    Astuce : remplace image / textes dans <code>src/data/site.ts</code> → bookSpreads.
                  </div>
                </article>
              </div>
            ) : null}

            <div className="page-flip" aria-hidden />
            <p className="mt-2 text-center text-xs text-white/50">
              {safeIndex + 1} / {bookSpreads.length}
            </p>
          </div>

          <div className="mt-5 flex justify-between">
            <button
              type="button"
              disabled={safeIndex === 0 || anim !== 'idle'}
              onClick={() => go(safeIndex - 1, 'prev')}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm disabled:opacity-35"
            >
              <ChevronLeft size={16} /> Précédent
            </button>
            <button
              type="button"
              disabled={safeIndex >= bookSpreads.length - 1 || anim !== 'idle'}
              onClick={() => go(safeIndex + 1, 'next')}
              className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFF]/50 bg-[#7C5CFF]/15 px-4 py-2 text-sm text-[#c4b5fd] disabled:opacity-35"
            >
              Suivant <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .book-shell { transform-style: preserve-3d; }
        .page-flip {
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.18), transparent 60%);
          transform-origin: left center;
          opacity: 0;
        }
        .book-shell.is-next .page-flip { animation: curlN 0.78s ease-in-out; }
        .book-shell.is-prev .page-flip { animation: curlP 0.78s ease-in-out; }
        .book-shell.is-next .spread-grid,
        .book-shell.is-next .cover,
        .book-shell.is-prev .spread-grid,
        .book-shell.is-prev .cover {
          animation: softFade 0.78s ease;
        }
        @keyframes curlN {
          0% { opacity: 0.2; transform: rotateY(0); }
          45% { opacity: 0.85; }
          100% { opacity: 0; transform: rotateY(-170deg); }
        }
        @keyframes curlP {
          0% { opacity: 0.2; transform: rotateY(-170deg); }
          45% { opacity: 0.85; }
          100% { opacity: 0; transform: rotateY(0); }
        }
        @keyframes softFade {
          0%,100% { opacity: 1; }
          45% { opacity: 0.35; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </PageTransition>
  )
}
