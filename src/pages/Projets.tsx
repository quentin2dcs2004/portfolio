import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  projectCategories,
  projects,
  type Project,
  type ProjectCategory,
} from '@/data/site'

export function Projets() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>('Tous')
  const [selected, setSelected] = useState<Project | null>(null)

  const filtered = useMemo(() => {
    if (filter === 'Tous') return projects
    return projects.filter((p) => p.category === filter)
  }, [filter])

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-6">
      <SectionHeading
        eyebrow="Projets"
        title="Mes réalisations"
        description="Filtres interactifs et aperçus immersifs. Les fiches marquées « à compléter » sont des emplacements modifiables."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {projectCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-2 text-xs tracking-wide transition ${
              filter === cat
                ? 'bg-electric/25 text-cyan neon-border'
                : 'border border-white/10 text-mist hover:text-snow'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <motion.button
            key={project.id}
            type="button"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(project)}
            className="group overflow-hidden rounded-3xl border border-white/10 text-left transition hover:border-cyan/40"
            data-cursor
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={project.image}
                alt=""
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80" />
              {project.placeholder ? (
                <span className="absolute top-3 left-3 rounded-full bg-violet/30 px-2 py-1 text-[10px] tracking-wider text-snow uppercase">
                  Emplacement
                </span>
              ) : null}
            </div>
            <div className="p-4">
              <p className="text-[11px] tracking-widest text-cyan uppercase">
                {project.category as ProjectCategory}
              </p>
              <h3 className="mt-1 font-display text-base text-snow">{project.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-mist">{project.summary}</p>
              <p className="mt-3 text-xs text-mist/70">{project.date}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-void/80 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] neon-border"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={selected.title}
            >
              <button
                type="button"
                className="absolute top-4 right-4 z-10 rounded-full bg-void/60 p-2 text-snow"
                onClick={() => setSelected(null)}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
              <img
                src={selected.image}
                alt=""
                className="aspect-video w-full object-cover"
              />
              <div className="p-6 md:p-8">
                <p className="text-xs tracking-widest text-cyan uppercase">{selected.category}</p>
                <h3 className="font-display mt-2 text-2xl text-snow">{selected.title}</h3>
                <p className="mt-2 text-sm text-mist">{selected.date}</p>
                <p className="mt-5 leading-relaxed text-snow/90">{selected.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {selected.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs text-mist"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
