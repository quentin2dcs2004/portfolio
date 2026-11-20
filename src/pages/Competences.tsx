import { motion } from 'framer-motion'
import { skills } from '@/data/site'

export function Competences() {
  return (
    <div className="wrap pt-28 pb-24">
      <p className="font-display text-xs tracking-[0.4em] text-cyan uppercase">Compétences</p>
      <h1 className="font-display mt-4 max-w-3xl text-4xl md:text-6xl">
        Un spectre créatif et technique
      </h1>
      <p className="mt-5 max-w-2xl text-mist">
        Chaque spécialité est présentée comme une expérience : description, savoir-faire et outils.
      </p>
      <div className="mt-20 space-y-24">
        {skills.map((skill, i) => (
          <motion.section
            key={skill.id}
            id={skill.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"
          >
            <div>
              <p className="font-display text-cyan">0{i + 1}</p>
              <h2 className="font-display mt-3 text-3xl md:text-4xl">{skill.title}</h2>
              <p className="mt-4 text-mist">{skill.description}</p>
            </div>
            <div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {skill.items.map((item) => (
                  <li key={item} className="border-b border-white/10 py-3 text-snow/90">
                    {item}
                  </li>
                ))}
              </ul>
              {skill.softwares.length > 0 ? (
                <p className="mt-6 text-xs tracking-[0.2em] text-mist uppercase">
                  {skill.softwares.join(' · ')}
                </p>
              ) : null}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  )
}
