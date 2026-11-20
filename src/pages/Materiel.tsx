import { gear } from '@/data/site'

export function Materiel() {
  return (
    <div className="wrap pt-28 pb-24">
      <p className="font-display text-xs tracking-[0.4em] text-cyan uppercase">Matériel</p>
      <h1 className="font-display mt-4 text-4xl md:text-6xl">Équipement</h1>
      <p className="mt-4 max-w-2xl text-mist">Fiches techniques — complète les modèles quand tu veux.</p>
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {gear.map((item) => (
          <article key={item.id} className="border-t border-white/10 pt-6">
            <p className="text-xs tracking-[0.25em] text-cyan uppercase">{item.category}</p>
            <h3 className="font-display mt-3 text-2xl">{item.name}</h3>
            <p className="mt-2 text-mist">{item.usage}</p>
            <ul className="mt-4 space-y-1 text-sm text-snow/70">
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
