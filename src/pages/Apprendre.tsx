import { lazy, Suspense, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/ui/PageTransition'
import { skillGroups } from '@/data/site'

const HyperField = lazy(() =>
  import('@/components/three/HyperField').then((m) => ({ default: m.HyperField })),
)
const SkillConstellation = lazy(() =>
  import('@/components/three/SkillConstellation').then((m) => ({ default: m.SkillConstellation })),
)

const LEVEL_LABEL = ['Découverte', 'Bases', 'Opérationnel', 'Solide', 'Avancé'] as const

export function Apprendre() {
  const nodes = useMemo(
    () =>
      skillGroups.flatMap((g) =>
        g.skills.map((s) => ({ name: s.name, level: s.level, accent: s.accent })),
      ),
    [],
  )

  return (
    <PageTransition>
      <div className="relative min-h-[100svh] overflow-hidden pt-24">
        <div className="wrap">
          <p className="text-xs tracking-[0.28em] text-[#7C5CFF] uppercase">Compétences</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Apprendre</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/65">
            Cartographie 3D de ce que j’ai réellement travaillé — constellation live + niveaux.
          </p>

          <Suspense fallback={<div className="mt-8 h-[280px] rounded-3xl bg-white/5" />}>
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <SkillConstellation nodes={nodes} />
              <HyperField theme="violet" density="hero" height="h-[280px] md:h-[360px]" />
            </div>
          </Suspense>

          <div className="mt-12 space-y-14">
            {skillGroups.map((group, gi) => (
              <section key={group.id}>
                <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold">{group.title}</h2>
                    <p className="mt-1 text-sm text-white/50">{group.blurb}</p>
                  </div>
                  <span className="text-[10px] tracking-[0.2em] text-white/35 uppercase">
                    {String(gi + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.skills.map((skill, si) => (
                    <motion.article
                      key={skill.name}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ delay: si * 0.04, duration: 0.45 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div
                        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl transition group-hover:opacity-70"
                        style={{ background: skill.accent }}
                      />
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg font-semibold">{skill.name}</h3>
                        <span className="shrink-0 text-[10px] tracking-wider text-white/45 uppercase">
                          {LEVEL_LABEL[skill.level - 1]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-white/55">{skill.detail}</p>
                      <div className="mt-4 flex gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className="h-1.5 flex-1 rounded-full"
                            style={{
                              background: i < skill.level ? skill.accent : 'rgba(255,255,255,0.08)',
                            }}
                          />
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
