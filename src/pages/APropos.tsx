import { motion } from 'framer-motion'
import { site, timeline } from '@/data/site'

export function APropos() {
  return (
    <div className="pt-28 pb-24">
      <section className="wrap grid items-center gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="font-display text-xs tracking-[0.4em] text-cyan uppercase">À propos</p>
          <h1 className="font-display mt-4 text-4xl md:text-6xl">
            <span className="text-gradient">{site.fullName}</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-mist">{site.tagline}</p>
          <p className="mt-6 text-mist">
            Passionné par la créativité, je construis un parcours entre graphisme, impression,
            fabrication numérique et relation client — avec l’ambition de créer mon activité dans
            l’impression 3D.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-electric/25 to-violet/25 blur-2xl" />
          <img
            src={site.photo}
            alt=""
            className="relative aspect-[3/4] w-full max-w-md rounded-[2rem] object-cover object-top"
          />
        </motion.div>
      </section>

      <section className="wrap mt-24">
        <h2 className="font-display text-3xl">Repères</h2>
        <div className="mt-10 space-y-0">
          {timeline.map((item) => (
            <article
              key={item.id}
              className="grid gap-3 border-t border-white/10 py-8 md:grid-cols-[180px_1fr]"
            >
              <p className="text-sm text-cyan">{item.year}</p>
              <div>
                <h3 className="font-display text-xl">{item.title}</h3>
                <p className="mt-2 text-mist">{item.summary}</p>
                <p className="mt-2 text-sm text-snow/70">{item.details}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
