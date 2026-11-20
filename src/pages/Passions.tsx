import { passions } from '@/data/site'

export function Passions() {
  return (
    <div className="wrap py-16 md:py-24">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">Passions</p>
      <h1 className="font-display mt-3 text-4xl font-semibold md:text-5xl">Ce qui m’anime</h1>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {passions.map((p) => (
          <article key={p.id} className="border-t border-line pt-5">
            <h3 className="font-display text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-muted">{p.text}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
