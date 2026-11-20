import { gear } from '@/data/site'

export function Materiel() {
  return (
    <div className="wrap py-16 md:py-24">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">Matériel</p>
      <h1 className="font-display mt-3 text-4xl font-semibold md:text-5xl">Équipement</h1>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {gear.map((item) => (
          <article key={item.id} className="border-t border-line pt-6">
            <p className="text-xs font-semibold tracking-wide text-accent uppercase">{item.category}</p>
            <h3 className="font-display mt-2 text-xl font-semibold">{item.name}</h3>
            <p className="mt-2 text-muted">{item.usage}</p>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {item.specs.map((s) => (
                <li key={s}>— {s}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
