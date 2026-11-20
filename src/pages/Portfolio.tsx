import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { bookPages } from '@/data/site'

export function Portfolio() {
  const [index, setIndex] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const page = bookPages[index]
  const projectPages = useMemo(() => bookPages.filter((p) => p.kind === 'project'), [])

  const go = (next: number) => {
    if (flipping || next < 0 || next >= bookPages.length) return
    setFlipping(true)
    window.setTimeout(() => {
      setIndex(next)
      setFlipping(false)
    }, 280)
  }

  if (!page) return null

  return (
    <div className="page-pad wrap">
      <PageHero
        eyebrow="Portfolio"
        title="Le livre de mes créations"
        lead="Livre numérique interactif : couverture, sommaire et pages projet. Complète les fiches dans src/data/site.ts."
      />

      <div className="mx-auto max-w-3xl">
        <div
          className={`relative min-h-[420px] origin-left rounded-r-2xl rounded-l-md border border-violet/30 bg-gradient-to-br from-[#0c1024] via-[#0a0e1c] to-[#12081f] p-6 shadow-[0_25px_80px_rgba(139,92,246,0.2)] transition duration-300 md:p-10 ${
            flipping ? 'scale-[0.985] opacity-70' : 'opacity-100'
          }`}
          style={{
            boxShadow:
              'inset 8px 0 20px rgba(0,0,0,0.35), 0 25px 80px rgba(139, 92, 246, 0.2)',
          }}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/50 to-transparent" />

          {page.kind === 'cover' ? (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl border border-cyan/40 font-display text-3xl font-bold text-cyan neon-text">
                Q
              </span>
              <h2 className="mt-6 font-display text-3xl font-bold md:text-4xl">{page.title}</h2>
              <p className="mt-3 text-cyan tracking-[0.2em] uppercase">{page.body}</p>
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
                      className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-left text-sm hover:border-cyan/35"
                      onClick={() => go(bookPages.findIndex((b) => b.id === p.id))}
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
              <dl className="mt-6 grid gap-4 text-sm">
                <div>
                  <dt className="text-muted">Logiciels</dt>
                  <dd className="mt-1 text-snow">{page.softwares}</dd>
                </div>
                <div>
                  <dt className="text-muted">Objectifs</dt>
                  <dd className="mt-1 text-snow">{page.objectives}</dd>
                </div>
                <div>
                  <dt className="text-muted">Difficultés</dt>
                  <dd className="mt-1 text-snow">{page.challenges}</dd>
                </div>
                <div>
                  <dt className="text-muted">Résultat</dt>
                  <dd className="mt-1 text-snow">{page.result}</dd>
                </div>
              </dl>
            </div>
          ) : null}

          <p className="absolute right-5 bottom-4 text-xs text-muted">
            {index + 1} / {bookPages.length}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0 || flipping}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Précédent
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index >= bookPages.length - 1 || flipping}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm text-cyan disabled:opacity-40"
          >
            Suivant <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
