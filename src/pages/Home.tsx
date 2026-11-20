import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { TypewriterRoles } from '@/components/ui/TypewriterRoles'
import { site, skills, projects } from '@/data/site'

const GalaxyScene = lazy(() =>
  import('@/components/three/GalaxyScene').then((m) => ({ default: m.GalaxyScene })),
)

export function Home() {
  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden pt-16">
        <Suspense fallback={<div className="absolute inset-0 -z-10 bg-void" />}>
          <GalaxyScene />
        </Suspense>

        <div className="wrap relative grid min-h-[calc(100svh-4rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-3 text-xs tracking-[0.3em] text-cyan uppercase">Univers créatif</p>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-snow md:text-6xl">
              <span className="block text-cyan neon-text">{site.name}</span>
              <span className="mt-2 block text-balance">{site.greeting}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted md:text-lg">{site.tagline}</p>
            <TypewriterRoles />

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/apprendre"
                className="rounded-xl bg-gradient-to-r from-electric to-violet px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(23,107,255,0.35)] transition hover:brightness-110"
              >
                Découvrir mon univers
              </Link>
              <Link
                to="/projets"
                className="rounded-xl border border-cyan/35 bg-white/5 px-5 py-3 text-sm font-semibold text-cyan backdrop-blur transition hover:border-cyan/60 hover:bg-white/10"
              >
                Voir mes projets
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan/25 via-electric/15 to-violet/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-night/60 p-2 shadow-[0_0_60px_rgba(23,107,255,0.25)]">
              <img
                src={site.photo}
                alt={`Portrait de ${site.fullName}`}
                width={640}
                height={800}
                className="aspect-[4/5] w-full rounded-[1.35rem] object-cover"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-2 rounded-[1.35rem] ring-1 ring-cyan/25" />
            </div>
          </motion.div>
        </div>

        <a
          href="#parcours-rapide"
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs tracking-widest text-muted uppercase"
        >
          Défiler
          <ChevronDown className="animate-bounce text-cyan" size={18} />
        </a>
      </section>

      <section id="parcours-rapide" className="page-pad wrap">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-display text-3xl font-bold">Parcours en bref</h2>
          <p className="mt-3 text-muted">
            Bac Pro RPIP, passion pour la création et formation en cours de testeur de jeux vidéo.
            Les détails se trouvent dans la rubrique Parcours.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {site.stats.map((s) => (
            <AnimatedCounter key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      <section className="pb-16 wrap">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold">Aperçu des compétences</h2>
          <Link to="/apprendre" className="text-sm text-cyan hover:underline">
            Tout voir
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {skills.slice(0, 4).map((skill) => (
            <article
              key={skill.id}
              className="glass group rounded-2xl p-5 transition hover:border-cyan/40"
            >
              <div
                className="mb-3 h-1 w-12 rounded-full"
                style={{ background: skill.accent }}
                aria-hidden
              />
              <h3 className="font-display text-lg font-semibold">{skill.title}</h3>
              <p className="mt-2 text-sm text-muted">{skill.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-20 wrap">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold">Dernières réalisations</h2>
          <Link to="/projets" className="text-sm text-cyan hover:underline">
            Galerie projets
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {projects.slice(0, 3).map((p) => (
            <Link
              key={p.id}
              to="/projets"
              className="group overflow-hidden rounded-2xl border border-white/10 bg-night/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {p.placeholder ? (
                  <span className="absolute top-3 left-3 rounded-md bg-void/70 px-2 py-1 text-[10px] tracking-wide text-cyan uppercase">
                    Placeholder
                  </span>
                ) : null}
              </div>
              <div className="p-4">
                <p className="text-xs text-cyan">{p.category}</p>
                <h3 className="mt-1 font-display font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
