import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { gear } from '@/data/site'

const categories = [
  'Tous',
  ...Array.from(new Set(gear.map((g) => g.category))),
] as const

export function Materiel() {
  const [filter, setFilter] = useState<(typeof categories)[number]>('Tous')
  const items = filter === 'Tous' ? gear : gear.filter((g) => g.category === filter)

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-6">
      <SectionHeading
        eyebrow="Matériel"
        title="Mon équipement"
        description="Fiches techniques futuristes. Complète les modèles et spécifications quand tu le souhaites."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-2 text-xs ${
              filter === cat
                ? 'bg-electric/25 text-cyan neon-border'
                : 'border border-white/10 text-mist'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            className="glass group overflow-hidden rounded-[1.75rem] neon-border"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={item.image}
                alt=""
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:rotate-1"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
              <span className="absolute top-3 left-3 rounded-full bg-void/60 px-3 py-1 text-[10px] tracking-wider text-cyan uppercase">
                {item.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg text-snow">{item.name}</h3>
              <p className="mt-2 text-sm text-mist">{item.usage}</p>
              <ul className="mt-4 space-y-1 border-t border-white/10 pt-4">
                {item.specs.map((spec) => (
                  <li key={spec} className="text-xs text-mist">
                    ▸ {spec}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
