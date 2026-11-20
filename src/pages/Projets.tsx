import { useMemo, useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { projectCategories, projects, type Project } from '@/data/site'

export function Projets() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>('Tous')
  const [selected, setSelected] = useState<Project | null>(null)

  const filtered = useMemo(() => {
    if (filter === 'Tous') return projects
    return projects.filter((p) => p.category === filter)
  }, [filter])

  return (
    <div className="container-page py-16">
      <SectionHeading
        eyebrow="Projets"
        title="Mes réalisations"
        description="Filtre par catégorie. Les fiches « à compléter » sont des emplacements modifiables."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {projectCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === cat
                ? 'bg-accent text-white'
                : 'border border-line bg-surface text-muted hover:text-ink'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setSelected(project)}
            className="overflow-hidden rounded-2xl border border-line bg-surface text-left transition hover:border-accent/40"
          >
            <img
              src={project.image}
              alt=""
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <div className="p-5">
              <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                {project.category}
              </p>
              <h3 className="font-display mt-2 text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{project.summary}</p>
              <p className="mt-3 text-xs text-muted">{project.date}</p>
            </div>
          </button>
        ))}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
          >
            <img src={selected.image} alt="" className="aspect-video w-full object-cover" />
            <div className="p-6">
              <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                {selected.category}
              </p>
              <h3 className="font-display mt-2 text-2xl font-semibold">{selected.title}</h3>
              <p className="mt-1 text-sm text-muted">{selected.date}</p>
              <p className="mt-4 text-muted">{selected.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {selected.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line px-3 py-1 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="mt-6 rounded-xl border border-line px-4 py-2 text-sm font-semibold"
                onClick={() => setSelected(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
