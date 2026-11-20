import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { bookPages } from '@/data/site'
import { Button } from '@/components/ui/Button'

export function Portfolio() {
  const [page, setPage] = useState(0)
  const [opened, setOpened] = useState(false)
  const [dir, setDir] = useState(1)
  const current = bookPages[page]

  const go = (next: number) => {
    setDir(next > page ? 1 : -1)
    setPage(next)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-6">
      <SectionHeading
        eyebrow="Portfolio"
        title="Le livre de mes créations"
        description="Un livre numérique interactif : couverture, tourne-pages, sommaire et fiches projet."
      />

      {!opened ? (
        <motion.button
          type="button"
          onClick={() => setOpened(true)}
          className="relative mx-auto flex min-h-[420px] w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/15 bg-gradient-to-br from-night via-void to-night p-8 text-center neon-border"
          whileHover={{ scale: 1.02 }}
          data-cursor
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(23,107,255,0.25),transparent_50%)]" />
          <span className="font-display relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan/40 text-3xl text-cyan">
            Q
          </span>
          <h3 className="font-display relative mt-6 text-2xl tracking-wide text-snow">
            Quentin – Creative Portfolio
          </h3>
          <p className="relative mt-3 flex items-center gap-2 text-sm text-mist">
            <BookOpen size={16} /> Ouvrir le livre
          </p>
        </motion.button>
      ) : (
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {bookPages.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => go(i)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    page === i ? 'bg-electric/25 text-cyan' : 'text-mist hover:text-snow'
                  }`}
                >
                  {i === 0 ? 'Couverture' : `p.${i}`}
                </button>
              ))}
            </div>
            <p className="font-display text-xs tracking-widest text-mist uppercase">
              Page {page + 1} / {bookPages.length}
            </p>
          </div>

          <div className="relative perspective-[1600px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.article
                key={current.id}
                custom={dir}
                initial={{ rotateY: dir * 70, opacity: 0, x: dir * 40 }}
                animate={{ rotateY: 0, opacity: 1, x: 0 }}
                exit={{ rotateY: dir * -70, opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="glass overflow-hidden rounded-[1.5rem] border border-white/15 neon-border"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {page === 0 ? (
                  <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 p-10 text-center">
                    <span className="font-display text-5xl text-gradient">Q</span>
                    <h3 className="font-display text-3xl text-snow">{current.title}</h3>
                    <p className="text-mist">Create your own universe</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2">
                    <img
                      src={current.image}
                      alt=""
                      className="aspect-[4/5] h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="flex flex-col justify-center p-6 md:p-8">
                      {current.placeholder ? (
                        <span className="mb-2 w-fit rounded-full bg-violet/25 px-2 py-1 text-[10px] uppercase">
                          Emplacement
                        </span>
                      ) : null}
                      <h3 className="font-display text-2xl text-snow">{current.title}</h3>
                      <p className="mt-2 text-sm text-mist">{current.date}</p>
                      <dl className="mt-6 space-y-4 text-sm">
                        <div>
                          <dt className="text-cyan">Objectifs</dt>
                          <dd className="mt-1 text-mist">{current.objectives}</dd>
                        </div>
                        <div>
                          <dt className="text-cyan">Difficultés</dt>
                          <dd className="mt-1 text-mist">{current.challenges}</dd>
                        </div>
                        <div>
                          <dt className="text-cyan">Résultat</dt>
                          <dd className="mt-1 text-mist">{current.result}</dd>
                        </div>
                        <div>
                          <dt className="text-cyan">Logiciels</dt>
                          <dd className="mt-2 flex flex-wrap gap-2">
                            {current.softwares.map((s) => (
                              <span
                                key={s}
                                className="rounded-full border border-white/15 px-2 py-1 text-xs"
                              >
                                {s}
                              </span>
                            ))}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => go(Math.max(0, page - 1))}
              disabled={page === 0}
              aria-label="Page précédente"
            >
              <ChevronLeft size={16} /> Précédent
            </Button>
            <Button
              variant="outline"
              onClick={() => go(Math.min(bookPages.length - 1, page + 1))}
              disabled={page === bookPages.length - 1}
              aria-label="Page suivante"
            >
              Suivant <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
