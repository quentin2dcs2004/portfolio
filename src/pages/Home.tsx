import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { OrbitPortrait } from '@/components/home/OrbitPortrait'
import { LogoQ } from '@/components/brand/LogoQ'
import { useIntro } from '@/components/intro/IntroContext'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { PageTransition } from '@/components/ui/PageTransition'
import { TypewriterRoles } from '@/components/ui/TypewriterRoles'
import { HoverOrb } from '@/components/three/HoverOrb'
import { useGsapReveal } from '@/hooks/useGsapReveal'
import { site, skills, projects } from '@/data/site'

const GalaxyScene = lazy(() =>
  import('@/components/three/GalaxyScene').then((m) => ({ default: m.GalaxyScene })),
)
const HyperField = lazy(() =>
  import('@/components/three/HyperField').then((m) => ({ default: m.HyperField })),
)

export function Home() {
  useGsapReveal()
  const { replayIntro } = useIntro()

  return (
    <PageTransition>
      <section className="relative min-h-[100svh] overflow-hidden pt-20">
        <Suspense fallback={<div className="absolute inset-0 -z-10 bg-void" />}>
          <GalaxyScene mode="hero" className="-z-10" />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 -z-[9] bg-gradient-to-b from-black/20 via-transparent to-void" />

        {/* Floating brand mark top-left of hero composition */}
        <div className="wrap relative mb-2 flex items-center gap-2 md:absolute md:top-24 md:left-[max(1rem,calc((100%-1180px)/2))]">
          <LogoQ size={44} />
          <div>
            <p className="font-display text-sm font-semibold tracking-[0.22em] uppercase">{site.name}</p>
            <p className="text-[10px] tracking-[0.28em] text-white/50 uppercase">{site.brand}</p>
          </div>
        </div>

        <div className="wrap relative grid min-h-[calc(100svh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-xs tracking-[0.32em] text-[#00F5D4] uppercase"
            >
              Create your own universe
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display text-4xl font-extrabold leading-tight md:text-6xl"
            >
              <span className="bg-gradient-to-r from-[#00F5D4] via-white to-[#FF46A2] bg-clip-text text-transparent">
                {site.name}
              </span>
              <span className="mt-3 block text-balance text-snow">{site.greeting}</span>
            </motion.h1>
            <p className="mt-5 max-w-xl text-base text-muted md:text-lg">{site.tagline}</p>
            <TypewriterRoles />

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/projets"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Explorer le manoir
              </Link>
              <Link
                to="/story"
                className="rounded-full border border-[#FF46A2]/50 bg-[#FF46A2]/10 px-6 py-3 text-sm font-semibold text-[#FF46A2] transition hover:bg-[#FF46A2]/20"
              >
                Ouvrir la Story
              </Link>
              <button
                type="button"
                onClick={replayIntro}
                className="rounded-full border border-white/20 px-4 py-3 text-xs text-white/70 hover:text-white"
              >
                Revoir l’intro
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.7 }}
          >
            <OrbitPortrait />
          </motion.div>
        </div>

        <a
          href="#parcours-rapide"
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs tracking-widest text-muted uppercase"
        >
          Défiler
          <ChevronDown className="animate-bounce text-[#00F5D4]" size={18} />
        </a>
      </section>

      <section id="parcours-rapide" className="page-pad wrap">
        <div className="mb-8 max-w-2xl" data-reveal>
          <h2 className="font-display text-3xl font-bold">Parcours en bref</h2>
          <p className="mt-3 text-muted">
            Bac Pro RPIP, univers Luminart, formation testeur jeux vidéo. Détails dans Parcours.
          </p>
        </div>
        <Suspense fallback={null}>
          <div className="mb-8" data-reveal>
            <HyperField theme="mixed" density="panel" height="h-[200px] md:h-[260px]" />
          </div>
        </Suspense>
        <div className="grid gap-4 sm:grid-cols-3">
          {site.stats.map((s, i) => (
            <div key={s.label} data-reveal data-reveal-delay={i * 0.08}>
              <AnimatedCounter value={s.value} label={s.label} />
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16 wrap">
        <div className="mb-6 flex items-end justify-between gap-4" data-reveal>
          <h2 className="font-display text-3xl font-bold">Compétences clés</h2>
          <Link to="/apprendre" className="text-sm text-[#00F5D4] hover:underline">
            Tout voir
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {skills.slice(0, 4).map((skill, i) => (
            <article
              key={skill.id}
              data-reveal
              data-reveal-delay={i * 0.06}
              className="glass group rounded-2xl p-5 transition hover:-translate-y-1"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="h-1 w-12 rounded-full transition group-hover:w-20" style={{ background: skill.accent }} />
                <HoverOrb color={skill.accent} className="h-12 w-12" />
              </div>
              <p className="text-[10px] tracking-wide uppercase" style={{ color: skill.accent }}>
                {skill.level}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold">{skill.title}</h3>
              <p className="mt-2 text-sm text-muted">{skill.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-20 wrap">
        <div className="mb-6 flex items-end justify-between gap-4" data-reveal>
          <h2 className="font-display text-3xl font-bold">À explorer</h2>
          <Link to="/projets" className="text-sm text-[#FF46A2] hover:underline">
            Manoir projets
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {projects.slice(0, 3).map((p, i) => (
            <Link
              key={p.id}
              to="/projets"
              data-reveal
              data-reveal-delay={i * 0.07}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-night/50 transition hover:-translate-y-1"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#00F5D4]">{p.category}</p>
                <h3 className="mt-1 font-display font-semibold">{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
