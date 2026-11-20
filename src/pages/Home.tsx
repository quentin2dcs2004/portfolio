import { lazy, Suspense, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ChevronDown } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { PageTransition } from '@/components/ui/PageTransition'
import { TypewriterRoles } from '@/components/ui/TypewriterRoles'
import { useGsapReveal } from '@/hooks/useGsapReveal'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { site, skills, projects } from '@/data/site'

const GalaxyScene = lazy(() =>
  import('@/components/three/GalaxyScene').then((m) => ({ default: m.GalaxyScene })),
)

export function Home() {
  useGsapReveal()
  const reduced = usePrefersReducedMotion()
  const portraitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !portraitRef.current) return
    const el = portraitRef.current
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      gsap.to(el, {
        rotateY: x * 10,
        rotateX: -y * 8,
        transformPerspective: 900,
        duration: 0.45,
        ease: 'power2.out',
      })
    }
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' })
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  return (
    <PageTransition>
      <section className="relative min-h-[100svh] overflow-hidden pt-16">
        {/* Full-bleed Three.js hero universe */}
        <Suspense fallback={<div className="absolute inset-0 -z-10 bg-void" />}>
          <GalaxyScene mode="hero" className="-z-10" />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 -z-[9] bg-gradient-to-b from-void/20 via-transparent to-void/90" />

        <div className="wrap relative grid min-h-[calc(100svh-4rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.9fr_0.85fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-xs tracking-[0.3em] text-cyan uppercase"
            >
              Univers créatif · Three.js
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.6 }}
              className="font-display text-4xl font-extrabold leading-tight tracking-tight text-snow md:text-6xl"
            >
              <span className="block text-cyan neon-text animate-pulse-soft">{site.name}</span>
              <span className="mt-2 block text-balance">{site.greeting}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-5 max-w-xl text-base text-muted md:text-lg"
            >
              {site.tagline}
            </motion.p>
            <TypewriterRoles />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/apprendre"
                className="btn-neon rounded-xl bg-gradient-to-r from-electric to-violet px-5 py-3 text-sm font-semibold text-white"
              >
                Découvrir mon univers
              </Link>
              <Link
                to="/projets"
                className="rounded-xl border border-cyan/35 bg-white/5 px-5 py-3 text-sm font-semibold text-cyan backdrop-blur transition hover:border-cyan/60 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(0,229,255,0.25)]"
              >
                Voir mes projets
              </Link>
            </motion.div>
          </div>

          {/* Dedicated visible 3D stage — unmistakable Three.js */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.7 }}
            className="relative mx-auto hidden h-[420px] w-full max-w-md overflow-hidden rounded-[1.75rem] border border-cyan/30 bg-void/40 shadow-[0_0_60px_rgba(0,229,255,0.2)] lg:block"
          >
            <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted">Chargement 3D…</div>}>
              <GalaxyScene mode="stage" />
            </Suspense>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/80 to-transparent p-4">
              <p className="text-center text-[11px] tracking-[0.25em] text-cyan uppercase">
                Logo Q · WebGL / Three.js
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md [perspective:1000px]"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan/25 via-electric/15 to-violet/30 blur-2xl animate-glow-breathe" />
            <div
              ref={portraitRef}
              className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-night/60 p-2 shadow-[0_0_60px_rgba(23,107,255,0.25)] will-change-transform"
            >
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

        {/* Mobile-only compact 3D stage */}
        <div className="wrap relative mb-8 md:hidden">
          <div className="relative h-[260px] overflow-hidden rounded-2xl border border-cyan/30">
            <Suspense fallback={null}>
              <GalaxyScene mode="stage" />
            </Suspense>
          </div>
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
        <div className="mb-8 max-w-2xl" data-reveal>
          <h2 className="font-display text-3xl font-bold">Parcours en bref</h2>
          <p className="mt-3 text-muted">
            Bac Pro RPIP, passion pour la création et formation en cours de testeur de jeux vidéo.
            Les détails se trouvent dans la rubrique Parcours.
          </p>
        </div>

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
          <h2 className="font-display text-3xl font-bold">Aperçu des compétences</h2>
          <Link to="/apprendre" className="text-sm text-cyan hover:underline">
            Tout voir
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {skills.slice(0, 4).map((skill, i) => (
            <article
              key={skill.id}
              data-reveal
              data-reveal-delay={i * 0.06}
              className="glass group rounded-2xl p-5 transition hover:-translate-y-1 hover:border-cyan/40 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)]"
            >
              <div
                className="mb-3 h-1 w-12 rounded-full transition group-hover:w-20"
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
        <div className="mb-6 flex items-end justify-between gap-4" data-reveal>
          <h2 className="font-display text-3xl font-bold">Dernières réalisations</h2>
          <Link to="/projets" className="text-sm text-cyan hover:underline">
            Galerie projets
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {projects.slice(0, 3).map((p, i) => (
            <Link
              key={p.id}
              to="/projets"
              data-reveal
              data-reveal-delay={i * 0.07}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-night/50 transition hover:-translate-y-1 hover:border-cyan/35"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
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
    </PageTransition>
  )
}
