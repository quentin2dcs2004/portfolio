import { lazy, Suspense } from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { PageTransition } from '@/components/ui/PageTransition'
import { useGsapReveal } from '@/hooks/useGsapReveal'
import { labExperiments } from '@/data/site'

const GalaxyScene = lazy(() =>
  import('@/components/three/GalaxyScene').then((m) => ({ default: m.GalaxyScene })),
)

export function Laboratoire() {
  useGsapReveal()

  return (
    <PageTransition>
      <div className="page-pad wrap">
        <PageHero
          eyebrow="Laboratoire créatif"
          title="Expérimentations"
          lead="Espace pour essais graphiques, démos techniques, prototypes et tests d’animation — avec une scène Three.js live."
        />

        <div
          data-reveal
          className="relative mb-10 h-[320px] overflow-hidden rounded-3xl border border-cyan/35 shadow-[0_0_50px_rgba(0,229,255,0.15)] md:h-[420px]"
        >
          <Suspense
            fallback={<div className="grid h-full place-items-center text-muted">Chargement WebGL…</div>}
          >
            <GalaxyScene mode="stage" />
          </Suspense>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/40 to-transparent p-5">
            <p className="font-display text-sm text-cyan">Playground Three.js — logo Q, anneaux, nébuleuse</p>
            <p className="text-xs text-muted">Bouge la souris pour piloter la caméra</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {labExperiments.map((exp, i) => (
            <article
              key={exp.id}
              data-reveal
              data-reveal-delay={i * 0.05}
              className="glass relative overflow-hidden rounded-3xl p-6 transition hover:-translate-y-1 hover:border-cyan/40 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyan/60 before:to-transparent"
            >
              <p className="text-xs tracking-wide text-violet uppercase">{exp.type}</p>
              <h2 className="mt-2 font-display text-xl font-semibold">{exp.title}</h2>
              <p className="mt-2 text-sm text-muted">{exp.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 glass rounded-3xl p-6 md:p-8" data-reveal>
          <h3 className="font-display text-lg font-semibold">Animations actives</h3>
          <ul className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
            <li>Intro Q cinématique + son</li>
            <li>Univers Three.js (hero + ambient + lab)</li>
            <li>GSAP ScrollTrigger reveals</li>
            <li>Portrait tilt 3D (GSAP)</li>
            <li>Alternance de rôles</li>
            <li>Story typing + livre flip</li>
            <li>Particules / sparkles / orbites</li>
            <li>prefers-reduced-motion</li>
          </ul>
        </div>
      </div>
    </PageTransition>
  )
}
