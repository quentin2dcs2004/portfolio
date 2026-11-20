import { PageHero } from '@/components/ui/PageHero'
import { gear } from '@/data/site'

export function Materiel() {
  return (
    <div className="page-pad wrap">
      <PageHero
        eyebrow="Matériel"
        title="Équipement créatif"
        lead="Fiches techniques futuristes. Remplace les emplacements « à compléter » dès que tu as les specs exactes."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {gear.map((item) => (
          <article
            key={item.id}
            className="group glass relative overflow-hidden rounded-3xl p-6 transition hover:-translate-y-1 hover:border-cyan/40"
          >
            <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-cyan/10 blur-2xl transition group-hover:bg-violet/20" />
            <p className="text-xs tracking-[0.2em] text-cyan uppercase">{item.category}</p>
            <h2 className="mt-2 font-display text-xl font-semibold">{item.name}</h2>
            <p className="mt-2 text-sm text-muted">{item.usage}</p>
            <ul className="mt-5 space-y-2 border-t border-white/8 pt-4">
              {item.specs.map((spec) => (
                <li key={spec} className="flex gap-2 text-sm">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-electric" aria-hidden />
                  {spec}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
