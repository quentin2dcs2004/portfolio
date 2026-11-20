import { PageHero } from '@/components/ui/PageHero'
import { labExperiments } from '@/data/site'

export function Laboratoire() {
  return (
    <div className="page-pad wrap">
      <PageHero
        eyebrow="Laboratoire créatif"
        title="Expérimentations"
        lead="Espace pour essais graphiques, démos techniques, prototypes et tests d’animation. Ajoute tes propres expériences dans les données du site."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {labExperiments.map((exp) => (
          <article
            key={exp.id}
            className="glass relative overflow-hidden rounded-3xl p-6 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyan/60 before:to-transparent"
          >
            <p className="text-xs tracking-wide text-violet uppercase">{exp.type}</p>
            <h2 className="mt-2 font-display text-xl font-semibold">{exp.title}</h2>
            <p className="mt-2 text-sm text-muted">{exp.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 glass rounded-3xl p-6 md:p-8">
        <h3 className="font-display text-lg font-semibold">Micro-animations intégrées au site</h3>
        <ul className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
          <li>Intro Q cinématique + son discret</li>
          <li>Alternance de rôles (accueil)</li>
          <li>Compteurs au scroll</li>
          <li>Particules Three.js réactives</li>
          <li>Story : typing + lecture</li>
          <li>Livre : flip de pages</li>
          <li>Projets : modal immersive</li>
          <li>Respect prefers-reduced-motion</li>
        </ul>
      </div>
    </div>
  )
}
