import { motion } from 'framer-motion'
import { PageHero } from '@/components/ui/PageHero'
import { skills } from '@/data/site'

export function Apprendre() {
  return (
    <div className="page-pad wrap">
      <PageHero
        eyebrow="Apprendre"
        title="Mes compétences, une par une"
        lead="Chaque spécialité est une expérience : description, savoir-faire et logiciels. Contenu modifiable dans src/data/site.ts."
      />

      <div className="grid gap-8">
        {skills.map((skill, i) => (
          <motion.section
            key={skill.id}
            id={skill.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.25) }}
            className="glass overflow-hidden rounded-3xl"
          >
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(90deg, ${skill.accent}, transparent)`,
              }}
            />
            <div className="grid gap-6 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
              <div>
                <p className="text-xs tracking-[0.25em] text-cyan uppercase">Spécialité</p>
                <h2 className="mt-2 font-display text-3xl font-bold">{skill.title}</h2>
                <p className="mt-3 text-muted">{skill.description}</p>
                {skill.softwares.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-xs tracking-wide text-snow/70 uppercase">Logiciels</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {skill.softwares.map((s) => (
                        <li
                          key={s}
                          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-cyan"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <ul className="grid gap-2 sm:grid-cols-2">
                {skill.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-white/8 bg-void/40 px-4 py-3 text-sm transition hover:border-cyan/35 hover:bg-white/5"
                  >
                    <span
                      className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
                      style={{ background: skill.accent }}
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  )
}
