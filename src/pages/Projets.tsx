import { useMemo, useState } from 'react'
import { projects } from '@/data/site'

const cats = ['Tous', ...Array.from(new Set(projects.map((p) => p.category)))]

export function Projets() {
  const [filter, setFilter] = useState('Tous')
  const list = useMemo(
    () => (filter === 'Tous' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <div className="wrap py-16 md:py-24">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">Projets</p>
      <h1 className="font-display mt-3 text-4xl font-semibold md:text-5xl">Réalisations</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Emplacements modifiables dans <code>src/data/site.ts</code>.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`text-sm ${filter === c ? 'font-semibold text-accent' : 'text-muted hover:text-ink'}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <article key={p.id}>
            <img src={p.image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
            <p className="mt-4 text-xs font-semibold tracking-wide text-accent uppercase">{p.category}</p>
            <h3 className="font-display mt-2 text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-muted">{p.summary}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
