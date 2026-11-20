import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { bookPages } from '@/data/site'

export function PortfolioBook() {
  const [page, setPage] = useState(0)
  const [opened, setOpened] = useState(false)
  const current = bookPages[page]

  if (!opened) {
    return (
      <button
        type="button"
        onClick={() => setOpened(true)}
        className="relative mx-auto flex min-h-[420px] w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-space via-void to-space p-10 text-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(23,107,255,0.28),transparent_55%)]" />
        <span className="font-display relative text-5xl text-gradient">Q</span>
        <h3 className="font-display relative mt-6 text-2xl tracking-wide">Quentin – Creative Portfolio</h3>
        <p className="relative mt-3 text-sm text-mist">Ouvrir le livre</p>
      </button>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex items-center justify-between text-xs tracking-widest text-mist uppercase">
        <span>
          Page {page + 1} / {bookPages.length}
        </span>
        <div className="flex gap-2">
          {bookPages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              className={page === i ? 'text-cyan' : 'hover:text-snow'}
            >
              {i === 0 ? 'Couverture' : `p.${i}`}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={current.id}
          initial={{ opacity: 0, rotateY: 35 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: -35 }}
          transition={{ duration: 0.45 }}
          className="min-h-[380px] rounded-[1.75rem] border border-white/15 bg-space/80 p-8 md:p-12"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <h3 className="font-display text-3xl text-snow">{current.title}</h3>
          {'body' in current && current.body ? (
            <p className="mt-6 text-mist">{current.body}</p>
          ) : (
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="text-cyan">Date</dt>
                <dd className="text-mist">{'date' in current ? current.date : ''}</dd>
              </div>
              <div>
                <dt className="text-cyan">Logiciels</dt>
                <dd className="text-mist">{'softwares' in current ? current.softwares : ''}</dd>
              </div>
              <div>
                <dt className="text-cyan">Objectifs</dt>
                <dd className="text-mist">{'objectives' in current ? current.objectives : ''}</dd>
              </div>
              <div>
                <dt className="text-cyan">Difficultés</dt>
                <dd className="text-mist">{'challenges' in current ? current.challenges : ''}</dd>
              </div>
              <div>
                <dt className="text-cyan">Résultat</dt>
                <dd className="text-mist">{'result' in current ? current.result : ''}</dd>
              </div>
            </dl>
          )}
        </motion.article>
      </AnimatePresence>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="inline-flex items-center gap-2 text-sm text-mist disabled:opacity-30"
        >
          <ChevronLeft size={16} /> Précédent
        </button>
        <button
          type="button"
          disabled={page === bookPages.length - 1}
          onClick={() => setPage((p) => Math.min(bookPages.length - 1, p + 1))}
          className="inline-flex items-center gap-2 text-sm text-mist disabled:opacity-30"
        >
          Suivant <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
