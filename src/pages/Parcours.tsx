import { timeline } from '@/data/site'

export function Parcours() {
  return (
    <div className="wrap py-16 md:py-24">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">Parcours</p>
      <h1 className="font-display mt-3 text-4xl font-semibold md:text-5xl">Mon évolution</h1>
      <ol className="mt-12">
        {timeline.map((e, i) => (
          <li
            key={e.id}
            className={`grid gap-3 border-t border-line py-8 md:grid-cols-[180px_1fr] ${
              i === timeline.length - 1 ? 'border-b' : ''
            }`}
          >
            <p className="text-sm font-semibold text-accent">{e.year}</p>
            <div>
              <h3 className="font-display text-xl font-semibold">{e.title}</h3>
              <p className="mt-2 text-muted">{e.summary}</p>
              <p className="mt-1 text-sm text-muted">{e.details}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
