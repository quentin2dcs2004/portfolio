import { motion } from 'framer-motion'
import { PageHero } from '@/components/ui/PageHero'
import { passions } from '@/data/site'

export function Passions() {
  return (
    <div className="page-pad wrap">
      <PageHero
        eyebrow="Passions"
        title="Centres d’intérêt"
        lead="Galerie visuelle animée — photographie, dessin, jeux, auto, 3D, tech, création, voyages."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {passions.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.28) }}
            whileHover={{ y: -6 }}
            className="relative min-h-[180px] overflow-hidden rounded-3xl border border-white/10 p-5"
            style={{
              background: `linear-gradient(145deg, rgba(23,107,255,0.18), rgba(139,92,246,0.12) ${30 + i * 5}%, rgba(5,5,9,0.9))`,
            }}
          >
            <div className="absolute -right-6 -bottom-8 h-24 w-24 rounded-full bg-cyan/15 blur-2xl" />
            <p className="text-xs tracking-[0.25em] text-cyan uppercase">0{i + 1}</p>
            <h2 className="mt-3 font-display text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted">{item.text}</p>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
