import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import { HomeHero } from '@/components/home/HomeHero'
import { projects, skills, site } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function Home() {
  const stripRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || !stripRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stripRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: stripRef.current, start: 'top 80%' },
        },
      )
    })
    return () => ctx.revert()
  }, [reduced])

  return (
    <div>
      <HomeHero />

      <section ref={stripRef} className="wrap py-24 md:py-32">
        <p className="font-display text-xs tracking-[0.4em] text-cyan uppercase">Univers</p>
        <h2 className="font-display mt-4 max-w-3xl text-3xl leading-tight md:text-5xl">
          Design, fabrication numérique et relation humaine — un même fil créatif.
        </h2>
        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-mist">
          {skills.map((s) => (
            <Link key={s.id} to="/competences" className="hover:text-cyan">
              {s.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 py-24">
        <div className="wrap">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-xs tracking-[0.4em] text-cyan uppercase">Sélection</p>
              <h2 className="font-display mt-3 text-3xl md:text-4xl">Dernières réalisations</h2>
            </div>
            <Link to="/projets" className="text-sm text-mist hover:text-cyan">
              Tout voir →
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {projects.slice(0, 3).map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="overflow-hidden rounded-[1.5rem]">
                  <img
                    src={project.image}
                    alt=""
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="mt-4 text-xs tracking-[0.25em] text-cyan uppercase">{project.category}</p>
                <h3 className="font-display mt-2 text-lg">{project.title}</h3>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-24 text-center">
        <p className="font-display text-sm tracking-[0.35em] text-cyan uppercase">{site.signature}</p>
        <Link
          to="/contact"
          className="mt-8 inline-flex rounded-full border border-cyan/40 px-6 py-3 text-sm text-cyan hover:bg-cyan/10"
        >
          Démarrer une conversation
        </Link>
      </section>
    </div>
  )
}
