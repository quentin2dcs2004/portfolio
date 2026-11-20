import { skills } from '@/data/site'

export function Competences() {
  return (
    <div className="wrap py-16 md:py-24">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">Compétences</p>
      <h1 className="font-display mt-3 text-4xl font-semibold md:text-5xl">Mes spécialités</h1>
      <div className="mt-14 space-y-14">
        {skills.map((skill) => (
          <section key={skill.id} id={skill.id} className="border-t border-line pt-8">
            <h2 className="font-display text-2xl font-semibold">{skill.title}</h2>
            <p className="mt-2 max-w-2xl text-muted">{skill.description}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {skill.items.map((item) => (
                <li key={item} className="text-sm text-ink">— {item}</li>
              ))}
            </ul>
            {skill.softwares.length > 0 ? (
              <p className="mt-4 text-xs tracking-wide text-muted uppercase">
                {skill.softwares.join(' · ')}
              </p>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  )
}
