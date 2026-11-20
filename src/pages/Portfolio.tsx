import { bookPages } from '@/data/site'

/** Simple project pages list — not a software book UI */
export function Portfolio() {
  const pages = bookPages.filter((p) => p.id !== 'cover')

  return (
    <div className="wrap py-16 md:py-24">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">Portfolio</p>
      <h1 className="font-display mt-3 text-4xl font-semibold md:text-5xl">Livre de créations</h1>
      <p className="mt-4 max-w-2xl text-muted">Fiches projet détaillées (emplacements à compléter).</p>
      <div className="mt-12 space-y-12">
        {pages.map((page, i) => (
          <article key={page.id} className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
            <div>
              <p className="text-sm text-accent">Projet {String(i + 1).padStart(2, '0')}</p>
              <h2 className="font-display mt-2 text-2xl font-semibold">{page.title}</h2>
              {'date' in page ? <p className="mt-2 text-sm text-muted">{page.date}</p> : null}
            </div>
            <dl className="space-y-3 text-sm">
              {'objectives' in page ? (
                <>
                  <div>
                    <dt className="font-semibold">Objectifs</dt>
                    <dd className="text-muted">{page.objectives}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Difficultés</dt>
                    <dd className="text-muted">{page.challenges}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Résultat</dt>
                    <dd className="text-muted">{page.result}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Logiciels</dt>
                    <dd className="text-muted">{page.softwares}</dd>
                  </div>
                </>
              ) : null}
            </dl>
          </article>
        ))}
      </div>
    </div>
  )
}
