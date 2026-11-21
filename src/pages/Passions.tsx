import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/ui/PageTransition'
import { passions } from '@/data/site'

const HyperField = lazy(() =>
  import('@/components/three/HyperField').then((m) => ({ default: m.HyperField })),
)

export function Passions() {
  return (
    <PageTransition>
      <div className="relative min-h-[100svh] overflow-hidden pt-24">
        <div className="wrap">
          <p className="text-xs tracking-[0.28em] text-[#FF46A2] uppercase">Centres d’intérêt</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Passions</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/65">
            Photo, 3D, jeux, création — univers vivants avec motion Three.js partout.
          </p>

          <Suspense fallback={null}>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <HyperField theme="pink" density="hero" height="h-[240px] md:h-[320px]" />
              <HyperField theme="violet" density="hero" height="h-[240px] md:h-[320px]" />
            </div>
          </Suspense>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {passions.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 mix-blend-soft-light opacity-55"
                    style={{ background: `linear-gradient(135deg, ${p.accent}, transparent 60%)` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <p className="absolute bottom-4 left-4 font-display text-2xl font-bold">{p.title}</p>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed text-white/60">{p.body}</p>
                  {p.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-white/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
