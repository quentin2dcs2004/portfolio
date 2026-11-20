import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { PageTransition } from '@/components/ui/PageTransition'
import { LogoQ } from '@/components/brand/LogoQ'
import { bookPages } from '@/data/site'

export function Portfolio() {
  const [index, setIndex] = useState(0)
  const [flip, setFlip] = useState<'idle' | 'next' | 'prev'>('idle')
  const page = bookPages[index]
  const projectPages = useMemo(() => bookPages.filter((p) => p.kind === 'project'), [])

  const go = (next: number, dir: 'next' | 'prev') => {
    if (flip !== 'idle' || next < 0 || next >= bookPages.length) return
    setFlip(dir)
    window.setTimeout(() => {
      setIndex(next)
      setFlip('idle')
    }, 620)
  }

  if (!page) return null

  return (
    <PageTransition>
      <div className="page-pad wrap">
        <PageHero
          eyebrow="Portfolio"
          title="Livre créatif"
          lead="Tourne les pages comme un vrai ouvrage : couverture, sommaire, fiches projet. Emplacements prêts à compléter."
        />

        <div className="mx-auto max-w-3xl [perspective:1800px]">
          <div
            className={`book-stage relative min-h-[460px] origin-left rounded-r-2xl rounded-l-md border border-violet/35 bg-gradient-to-br from-[#0e1230] via-[#0a0e1c] to-[#160a24] p-6 shadow-[0_30px_90px_rgba(139,92,246,0.28)] md:p-10 ${
              flip === 'next' ? 'is-flip-next' : flip === 'prev' ? 'is-flip-prev' : ''
            }`}
            style={{
              boxShadow:
                'inset 10px 0 24px rgba(0,0,0,0.4), 0 30px 90px rgba(139, 92, 246, 0.25)',
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/55 to-transparent" />
            <div className="book-page relative z-[1]">
              {page.kind === 'cover' ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <LogoQ size={72} />
                  <h2 className="mt-6 font-display text-3xl font-bold md:text-4xl">{page.title}</h2>
                  <p className="mt-3 tracking-[0.22em] text-cyan uppercase">{page.body}</p>
                </div>
              ) : null}

              {page.kind === 'toc' ? (
                <div>
                  <h2 className="font-display text-2xl font-bold">{page.title}</h2>
                  <ol className="mt-6 space-y-3">
                    {projectPages.map((p, i) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm hover:border-cyan/40"
                          onClick={() => go(bookPages.findIndex((b) => b.id === p.id), 'next')}
                        >
                          <span>
                            {i + 1}. {p.title}
                          </span>
                          <span className="text-muted">p.{i + 3}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {page.kind === 'project' ? (
                <div>
                  <p className="text-xs tracking-wide text-cyan uppercase">{page.date}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">{page.title}</h2>
                  <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2">
                    <div className="rounded-xl border border-white/8 bg-void/30 p-4">
                      <dt className="text-muted">Logiciels</dt>
                      <dd className="mt-1 text-snow">{page.softwares}</dd>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-void/30 p-4">
                      <dt className="text-muted">Objectifs</dt>
                      <dd className="mt-1 text-snow">{page.objectives}</dd>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-void/30 p-4">
                      <dt className="text-muted">Difficultés</dt>
                      <dd className="mt-1 text-snow">{page.challenges}</dd>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-void/30 p-4">
                      <dt className="text-muted">Résultat</dt>
                      <dd className="mt-1 text-snow">{page.result}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}
            </div>

            <div className="book-sheet" aria-hidden />
            <p className="absolute right-5 bottom-4 text-xs text-muted">
              {index + 1} / {bookPages.length}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => go(index - 1, 'prev')}
              disabled={index === 0 || flip !== 'idle'}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Précédent
            </button>
            <button
              type="button"
              onClick={() => go(index + 1, 'next')}
              disabled={index >= bookPages.length - 1 || flip !== 'idle'}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm text-cyan disabled:opacity-40"
            >
              Suivant <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .book-stage { transform-style: preserve-3d; }
        .book-sheet {
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(90deg, rgba(255,255,255,0.08), transparent 40%);
          transform-origin: left center;
          opacity: 0;
        }
        .book-stage.is-flip-next .book-sheet {
          animation: pageNext 0.62s ease-in-out;
        }
        .book-stage.is-flip-prev .book-sheet {
          animation: pagePrev 0.62s ease-in-out;
        }
        .book-stage.is-flip-next .book-page,
        .book-stage.is-flip-prev .book-page {
          animation: pageFade 0.62s ease-in-out;
        }
        @keyframes pageNext {
          0% { opacity: 0.2; transform: rotateY(0deg); }
          45% { opacity: 0.85; }
          100% { opacity: 0; transform: rotateY(-165deg); }
        }
        @keyframes pagePrev {
          0% { opacity: 0.2; transform: rotateY(-165deg); }
          45% { opacity: 0.85; }
          100% { opacity: 0; transform: rotateY(0deg); }
        }
        @keyframes pageFade {
          0%, 100% { opacity: 1; }
          45% { opacity: 0.25; }
        }
        @media (prefers-reduced-motion: reduce) {
          .book-sheet, .book-page { animation: none !important; }
        }
      `}</style>
    </PageTransition>
  )
}
