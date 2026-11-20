import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { projects, site, skills, timeline } from '@/data/site'

export function Home() {
  const featured = projects.slice(0, 3)

  return (
    <div>
      <section className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Portfolio</p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-ink md:text-5xl">
            {site.greeting}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{site.tagline}</p>
          <p className="mt-4 text-ink">
            <span className="text-muted">Compétences : </span>
            {site.roles.join(' · ')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/projets">
              Voir mes projets <ArrowRight size={16} />
            </ButtonLink>
            <ButtonLink to="/contact" variant="secondary">
              Me contacter
            </ButtonLink>
          </div>
        </div>

        <div className="justify-self-center md:justify-self-end">
          <img
            src={site.photo}
            alt={`Portrait de ${site.fullName}`}
            className="aspect-[3/4] w-full max-w-sm rounded-3xl object-cover object-top shadow-sm ring-1 ring-line"
          />
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page py-16">
          <SectionHeading
            eyebrow="À propos"
            title="Qui suis-je ?"
            description="Passionné par la créativité, je développe un profil polyvalent entre design, impression, fabrication numérique et relation client."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {timeline.filter((t) => t.verified).slice(0, 3).map((item) => (
              <article key={item.id} className="rounded-2xl border border-line bg-paper p-5">
                <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                  {item.type}
                </p>
                <h3 className="font-display mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.summary}</p>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink to="/parcours" variant="ghost">
              Voir mon parcours <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Compétences"
          title="Ce que je sais faire"
          description="Un aperçu rapide de mes spécialités."
        />
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Link
              key={skill.id}
              to="/competences"
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink transition hover:border-accent hover:text-accent"
            >
              {skill.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="container-page py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Projets"
              title="Quelques réalisations"
              description="Des emplacements prêts à accueillir tes vrais projets."
            />
            <ButtonLink to="/projets" variant="secondary" className="mb-10">
              Tous les projets
            </ButtonLink>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-2xl border border-line bg-paper"
              >
                <img
                  src={project.image}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                    {project.category}
                  </p>
                  <h3 className="font-display mt-2 text-lg font-semibold">{project.title}</h3>
                  <p className="mt-2 text-sm text-muted">{project.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
