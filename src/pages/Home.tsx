import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { WordRotator } from '@/components/ui/WordRotator'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { ScrollIndicator } from '@/components/ui/ScrollIndicator'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { projects, site, skills } from '@/data/site'
import { Link } from 'react-router-dom'
import { useGsapReveal } from '@/hooks/useGsapReveal'

const GalaxyScene = lazy(() =>
  import('@/components/three/GalaxyScene').then((m) => ({ default: m.GalaxyScene })),
)

export function Home() {
  const featured = projects.filter((p) => p.featured).slice(0, 3)
  const parcoursRef = useGsapReveal<HTMLElement>()

  return (
    <div>
      <section className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16">
        <Suspense fallback={null}>
          <GalaxyScene />
        </Suspense>
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 md:grid-cols-[1.1fr_0.9fr] md:px-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 font-display text-xs tracking-[0.4em] text-cyan uppercase"
            >
              Univers créatif
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl leading-tight font-bold tracking-wide md:text-6xl"
            >
              <span className="text-gradient">{site.name}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-xl text-snow md:text-2xl"
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
              Je suis <WordRotator words={site.rotatingRoles} />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/apprendre">
                Découvrir mon univers <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink to="/projets" variant="outline">
                Voir mes projets
              </ButtonLink>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-electric/30 via-transparent to-violet/30 blur-2xl" />
            <div className="neon-border relative overflow-hidden rounded-[2rem] border border-white/15 bg-night/40">
              <img
                src={site.photo}
                alt={`Portrait de ${site.fullName}`}
                className="aspect-[3/4] w-full object-cover object-top"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
              <div className="absolute right-4 bottom-4 left-4 glass rounded-2xl px-4 py-3">
                <p className="font-display text-xs tracking-widest text-cyan uppercase">
                  Créatif polyvalent
                </p>
                <p className="mt-1 text-sm text-snow">{site.fullName}</p>
              </div>
            </div>
          </motion.div>
        </div>
        <ScrollIndicator />
      </section>

      <section ref={parcoursRef} className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <SectionHeading
          eyebrow="Parcours"
          title="Une trajectoire créative et technique"
          description="Diplômé d’un Bac Pro RPIP, je poursuis une formation de testeur de jeux vidéo tout en développant mes compétences en graphisme, impression et fabrication numérique."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Projets présentés', value: projects.length, suffix: '+' },
            { label: 'Spécialités', value: skills.length, suffix: '' },
            { label: 'Univers explorés', value: 7, suffix: '' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-3xl p-6 neon-border">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm text-mist">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <SectionHeading
          eyebrow="Compétences"
          title="Aperçu de mon savoir-faire"
          description="Un spectre large : du design à la relation client, en passant par la 3D et le web."
        />
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <Link
              key={skill.id}
              to={`/apprendre#${skill.id}`}
              className="glass rounded-full px-4 py-2 text-sm text-snow transition hover:border-cyan/40 hover:text-cyan"
              style={{ borderColor: `${skill.accent}55` }}
            >
              {skill.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Réalisations"
            title="Mes dernières réalisations"
            description="Emplacements prêts à accueillir tes vrais projets."
          />
          <ButtonLink to="/projets" variant="ghost" className="hidden md:inline-flex">
            Tout voir
          </ButtonLink>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10"
            >
              <img
                src={project.image}
                alt=""
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs tracking-widest text-cyan uppercase">{project.category}</p>
                <h3 className="mt-1 font-display text-lg text-snow">{project.title}</h3>
                <p className="mt-2 text-sm text-mist">{project.summary}</p>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="mt-10 flex justify-center md:hidden">
          <ButtonLink to="/projets" variant="outline">
            Voir mes projets <Sparkles size={16} />
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
