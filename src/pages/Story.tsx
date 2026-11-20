import { useState } from 'react'
import { storyThreads } from '@/data/site'

/** Simple FAQ-style page — not a messaging app UI */
export function Story() {
  const [open, setOpen] = useState(0)

  return (
    <div className="wrap py-16 md:py-24">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">Story</p>
      <h1 className="font-display mt-3 text-4xl font-semibold md:text-5xl">Questions & réponses</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Exemples de conversations pour découvrir mon univers (contenu fictif d’illustration).
      </p>
      <div className="mt-12 space-y-0">
        {storyThreads.map((t, i) => (
          <article key={t.id} className="border-t border-line">
            <button
              type="button"
              className="flex w-full items-center justify-between py-5 text-left"
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <span className="font-display text-lg font-semibold">{t.contact}</span>
              <span className="text-muted">{open === i ? '−' : '+'}</span>
            </button>
            {open === i ? (
              <div className="pb-6">
                <p className="text-sm font-medium text-ink">{t.q}</p>
                <p className="mt-3 text-muted">{t.a}</p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
