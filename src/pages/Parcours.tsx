import { motion } from 'framer-motion'
import { PageTransition } from '@/components/ui/PageTransition'
import { timeline } from '@/data/site'

export function Parcours() {
  return (
    <PageTransition>
      <div className="relative min-h-[100svh] overflow-hidden pt-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(0,245,212,0.14), transparent 50%), #050509',
          }}
        />

        <div className="wrap">
          <p className="text-xs tracking-[0.28em] text-[#00F5D4] uppercase">Timeline</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Parcours</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/65">
            Formation, stages, créations et tournants — chaque étape avec un vrai marqueur.
          </p>

          <ol className="relative mt-14 space-y-0 border-l border-white/15 pl-8 md:pl-10">
            {timeline.map((step, i) => (
              <motion.li
                key={`${step.year}-${step.title}`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                className="relative pb-12 last:pb-0"
              >
                <span
                  className="absolute -left-[2.05rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#050509] md:-left-[2.55rem]"
                  style={{ background: step.accent, boxShadow: `0 0 16px ${step.accent}` }}
                />
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-display text-sm font-semibold" style={{ color: step.accent }}>
                    {step.year}
                  </span>
                  {step.place ? (
                    <span className="text-[10px] tracking-[0.18em] text-white/40 uppercase">
                      {step.place}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-1 font-display text-xl font-semibold md:text-2xl">{step.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">{step.body}</p>
                {step.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {step.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-white/55"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </PageTransition>
  )
}
