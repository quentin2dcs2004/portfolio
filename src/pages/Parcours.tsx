import { timeline } from '@/data/site'

export function Parcours() {
  return (
    <div className="wrap pt-28 pb-24">
      <p className="font-display text-xs tracking-[0.4em] text-cyan uppercase">Parcours</p>
      <h1 className="font-display mt-4 text-4xl md:text-6xl">Timeline</h1>
      <ol className="mt-14">
        {timeline.map((event, i) => (
          <li
            key={event.id}
            className={`grid gap-4 border-t border-white/10 py-10 md:grid-cols-[200px_1fr] ${
              i === timeline.length - 1 ? 'border-b' : ''
            }`}
          >
            <div>
              <p className="text-cyan">{event.year}</p>
            </div>
            <div>
              <h3 className="font-display text-2xl">{event.title}</h3>
              <p className="mt-3 text-mist">{event.summary}</p>
              <p className="mt-2 text-sm text-snow/70">{event.details}</p>
              {!event.verified ? (
                <p className="mt-2 text-xs text-violet">Emplacement modifiable</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
