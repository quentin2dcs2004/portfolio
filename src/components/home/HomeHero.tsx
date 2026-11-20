import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { site } from '@/data/site'

const GalaxyScene = lazy(() =>
  import('@/components/three/GalaxyScene').then((m) => ({ default: m.GalaxyScene })),
)

export function HomeHero() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % site.roles.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-void" />}>
        <GalaxyScene />
      </Suspense>

      <div className="wrap relative z-10 grid min-h-screen items-center gap-10 pt-24 pb-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-xs tracking-[0.45em] text-cyan uppercase"
          >
            Create your own universe
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display mt-5 text-5xl leading-[1.05] font-bold tracking-tight md:text-7xl"
          >
            <span className="text-gradient text-glow">{site.name}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-snow md:text-2xl"
          >
            {site.greeting}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-mist md:text-lg"
          >
            {site.tagline}
          </motion.p>

          <p className="mt-6 text-lg text-snow">
            Je suis{' '}
            <span className="relative inline-grid min-w-[14ch] align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={site.roles[roleIndex]}
                  initial={{ y: 18, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -18, opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.4 }}
                  className="col-start-1 row-start-1 font-semibold text-cyan"
                >
                  {site.roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/projets"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-electric via-cyan to-violet px-6 py-3 text-sm font-semibold text-void"
            >
              Découvrir mes projets <ArrowDownRight size={16} />
            </Link>
            <Link
              to="/a-propos"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-snow hover:border-cyan/50 hover:text-cyan"
            >
              Mon univers
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-electric/30 via-transparent to-violet/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15">
            <img
              src={site.photo}
              alt={`Portrait de ${site.fullName}`}
              className="aspect-[3/4] w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
            <div className="absolute right-5 bottom-5 left-5">
              <p className="font-display text-xs tracking-[0.3em] text-cyan uppercase">Créatif polyvalent</p>
              <p className="mt-1 text-sm text-snow">{site.fullName}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
