import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/ui/PageTransition'
import { HoverOrb } from '@/components/three/HoverOrb'
import { gearCategories } from '@/data/site'

const HyperField = lazy(() =>
  import('@/components/three/HyperField').then((m) => ({ default: m.HyperField })),
)

export function Materiel() {
  return (
    <PageTransition>
      <div className="relative min-h-[100svh] overflow-hidden pt-24">
        <div className="wrap">
          <p className="text-xs tracking-[0.28em] text-[#FF46A2] uppercase">Setup</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Matériel</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/65">
            Inventaire vivant — machines, captation, logiciels — avec motion Three.js.
          </p>

          <Suspense fallback={null}>
            <div className="mt-8">
              <HyperField theme="gold" density="hero" height="h-[220px] md:h-[300px]" />
            </div>
          </Suspense>

          <div className="mt-12 space-y-12">
            {gearCategories.map((cat, ci) => (
              <section key={cat.id}>
                <div className="mb-5 flex items-center gap-3">
                  <HoverOrb color={cat.accent} className="h-12 w-12" />
                  <div>
                    <h2 className="font-display text-xl font-semibold">{cat.title}</h2>
                    <p className="text-xs text-white/45">{cat.subtitle}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.items.map((item, ii) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: ii * 0.03 + ci * 0.02 }}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                        {'tag' in item && item.tag ? (
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                            style={{ background: `${cat.accent}25`, color: cat.accent }}
                          >
                            {item.tag}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-white/50">{item.note}</p>
                    </motion.div>
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
