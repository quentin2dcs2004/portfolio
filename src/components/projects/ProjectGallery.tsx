import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { projects } from '@/data/site'

const categories = ['Tous', ...Array.from(new Set(projects.map((p) => p.category)))]

export function ProjectGallery() {
  const [filter, setFilter] = useState('Tous')
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null)

  const filtered = useMemo(
    () => (filter === 'Tous' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`text-sm tracking-wide transition ${
              filter === cat ? 'text-cyan' : 'text-mist hover:text-snow'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {filtered.map((project, i) => (
          <motion.button
            key={project.id}
            type="button"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(project)}
            className="group text-left"
          >
            <div className="overflow-hidden rounded-[1.5rem]">
              <img
                src={project.image}
                alt=""
                className="aspect-[16/11] w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-xs tracking-[0.25em] text-cyan uppercase">{project.category}</p>
            <h3 className="font-display mt-2 text-xl text-snow">{project.title}</h3>
            <p className="mt-2 text-sm text-mist">{project.summary}</p>
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
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-white/10 bg-space"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal
            >
              <button
                type="button"
                className="absolute top-4 right-4 z-10 rounded-full bg-void/70 p-2"
                onClick={() => setSelected(null)}
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
              <img src={selected.image} alt="" className="aspect-video w-full object-cover" />
              <div className="p-6 md:p-8">
                <p className="text-xs tracking-[0.25em] text-cyan uppercase">{selected.category}</p>
                <h3 className="font-display mt-2 text-2xl">{selected.title}</h3>
                <p className="mt-2 text-sm text-mist">{selected.date}</p>
                <p className="mt-5 text-mist">{selected.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {selected.technologies.map((t) => (
                    <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs text-mist">
                      {t}
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
