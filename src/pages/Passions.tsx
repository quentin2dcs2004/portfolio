import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { passions } from '@/data/site'

const accents = ['#176BFF', '#00E5FF', '#8B5CF6', '#176BFF', '#00E5FF', '#8B5CF6', '#00E5FF', '#176BFF']

export function Passions() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-6">
      <SectionHeading
        eyebrow="Passions"
        title="Ce qui m’anime"
        description="Une galerie visuelle animée autour de la photographie, du dessin, des jeux, de l’auto et de la création."
      />

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {passions.map((passion, i) => (
          <motion.article
            key={passion.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="mb-5 break-inside-avoid overflow-hidden rounded-[1.75rem] border border-white/10"
            style={{
              background: `linear-gradient(160deg, ${accents[i]}22, rgba(5,5,9,0.9))`,
            }}
          >
            <div
              className="relative h-40 overflow-hidden"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${accents[i]}55, transparent 55%)`,
              }}
            >
              <div
                className="anim-float absolute inset-6 rounded-3xl border border-white/10 bg-white/5"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
              <div
                className="absolute top-4 right-6 h-2 w-2 rounded-full"
                style={{
                  background: accents[i],
                  boxShadow: `0 0 16px ${accents[i]}`,
                  animation: 'shooting-star 4s linear infinite',
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl text-snow">{passion.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{passion.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
