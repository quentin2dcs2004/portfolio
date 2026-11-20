import { SectionHeading } from '@/components/ui/SectionHeading'
import { skills } from '@/data/site'

export function Competences() {
  return (
    <div className="container-page py-16">
      <SectionHeading
        eyebrow="Compétences"
        title="Mes spécialités"
        description="Chaque domaine avec ses savoir-faire et les logiciels associés."
      />

      <div className="space-y-8">
        {skills.map((skill) => (
          <section
            key={skill.id}
            id={skill.id}
            className="rounded-2xl border border-line bg-surface p-6 md:p-8"
          >
            <h3 className="font-display text-2xl font-semibold text-ink">{skill.title}</h3>
            <p className="mt-2 max-w-3xl text-muted">{skill.description}</p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {skill.items.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>

            {skill.softwares.length > 0 ? (
              <div className="mt-6">
                <p className="text-sm font-semibold text-ink">Logiciels</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skill.softwares.map((soft) => (
                    <span
                      key={soft}
                      className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
                    >
                      {soft}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  )
}
