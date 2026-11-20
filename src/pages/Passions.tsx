import { motion } from 'framer-motion'
import { passions } from '@/data/site'

export function Passions() {
  return (
    <div className="wrap pt-28 pb-24">
      <p className="font-display text-xs tracking-[0.4em] text-cyan uppercase">Passions</p>
      <h1 className="font-display mt-4 text-4xl md:text-6xl">Ce qui m’anime</h1>
      <div className="mt-14 columns-1 gap-8 sm:columns-2 lg:columns-3">
        {passions.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="mb-8 break-inside-avoid"
          >
            <div
              className="mb-4 h-36 rounded-[1.5rem]"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${
                  i % 3 === 0
                    ? 'rgba(23,107,255,0.45)'
                    : i % 3 === 1
                      ? 'rgba(0,229,255,0.35)'
                      : 'rgba(139,92,246,0.4)'
                }, transparent 60%)`,
              }}
            />
            <h3 className="font-display text-xl">{p.title}</h3>
            <p className="mt-2 text-sm text-mist">{p.text}</p>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
