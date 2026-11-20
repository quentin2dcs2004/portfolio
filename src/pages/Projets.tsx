import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { projectCategories, projects } from '@/data/site'

type Project = (typeof projects)[number]

export function Projets() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>('Tous')
  const [selected, setSelected] = useState<Project | null>(null)

  const filtered = useMemo(
    () => (filter === 'Tous' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <div className="page-pad wrap">
      <PageHero
        eyebrow="Projets"
        title="Réalisations"
        lead="Filtres interactifs et ouverture immersive. Les projets marqués Placeholder sont des emplacements à compléter."
      />

      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filtres projets">
        {projectCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={filter === cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg border px-3 py-1.5 text-xs tracking-wide transition ${
              filter === cat
                ? 'border-cyan/50 bg-cyan/15 text-cyan'
                : 'border-white/10 text-muted hover:border-white/25 hover:text-snow'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setSelected(project)}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-night/45 text-left transition hover:border-cyan/40 hover:shadow-[0_0_40px_rgba(0,229,255,0.12)]"
          >
            <div className="relative aspect-[16/11] overflow-hidden">
              <img
                src={project.image}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {project.placeholder ? (
                <span className="absolute top-3 left-3 rounded-md bg-void/75 px-2 py-1 text-[10px] tracking-wide text-cyan uppercase">
                  Placeholder
                </span>
              ) : null}
            </div>
            <div className="p-4">
              <p className="text-xs text-cyan">{project.category}</p>
              <h3 className="mt-1 font-display text-lg font-semibold">{project.title}</h3>
              <p className="mt-1 text-sm text-muted">{project.summary}</p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-void/80 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal
            aria-label={selected.title}
            onClick={() => setSelected(null)}
          >
            <motion.article
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              className="glass relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-void/60"
                onClick={() => setSelected(null)}
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
              <img
                src={selected.image}
                alt=""
                className="aspect-[21/9] w-full object-cover"
              />
              <div className="p-6 md:p-8">
                <p className="text-xs tracking-wide text-cyan uppercase">
                  {selected.category} · {selected.date}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold">{selected.title}</h2>
                <p className="mt-4 text-muted">{selected.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {selected.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-cyan/25 bg-cyan/10 px-2.5 py-1 text-xs text-cyan"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
