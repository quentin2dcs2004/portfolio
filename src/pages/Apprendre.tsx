import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { skills } from '@/data/site'

export function Apprendre() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-6">
      <SectionHeading
        eyebrow="Apprendre"
        title="Mes compétences"
        description="Chaque spécialité est une expérience interactive : description, outils et savoir-faire associés."
      />

      <div className="space-y-24">
        {skills.map((skill, index) => (
          <motion.section
            key={skill.id}
            id={skill.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="grid items-start gap-8 md:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-[2rem] opacity-40 blur-2xl"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${skill.accent}66, transparent 60%)`,
                }}
              />
              <div className="glass relative overflow-hidden rounded-[2rem] p-8 neon-border">
                <p className="font-display text-xs tracking-[0.35em] text-cyan uppercase">
                  0{index + 1}
                </p>
                <h3 className="font-display mt-4 text-3xl text-snow">{skill.title}</h3>
                <p className="mt-2 text-mist">{skill.subtitle}</p>
                <div
                  className="mt-8 h-1 w-24 rounded-full"
                  style={{ background: skill.accent }}
                />
                <div className="mt-8 grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="anim-float h-10 rounded-xl border border-white/10 bg-white/5"
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        boxShadow: `inset 0 0 20px ${skill.accent}22`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-lg leading-relaxed text-snow/90">{skill.description}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {skill.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-mist transition hover:border-cyan/30 hover:text-snow"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              {skill.softwares.length > 0 ? (
                <div className="mt-8">
                  <p className="font-display text-xs tracking-[0.3em] text-cyan uppercase">
                    Logiciels
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skill.softwares.map((soft) => (
                      <span
                        key={soft}
                        className="rounded-full border border-white/15 px-3 py-1 text-xs text-snow"
                        style={{ boxShadow: `0 0 16px ${skill.accent}22` }}
                      >
                        {soft}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  )
}
