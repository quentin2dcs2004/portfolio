import { Link } from 'react-router-dom'
import { HomeHero } from '@/components/home/HomeHero'
import { projects, skills, site, timeline } from '@/data/site'

export function Home() {
  return (
    <div>
      <HomeHero />

      <section className="wrap py-20 md:py-28">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">À propos</p>
        <h2 className="font-display mt-3 max-w-3xl text-3xl font-semibold md:text-4xl">Qui suis-je ?</h2>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Passionné par la créativité, je développe un profil polyvalent entre design, impression,
          fabrication numérique et relation client.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {timeline.filter((t) => t.verified).slice(0, 3).map((item) => (
            <article key={item.id} className="border-t border-line pt-5">
              <p className="text-sm font-semibold text-accent">{item.year}</p>
              <h3 className="font-display mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.summary}</p>
            </article>
          ))}
        </div>
        <Link to="/a-propos" className="mt-8 inline-block text-sm font-semibold text-accent hover:underline">
          En savoir plus →
        </Link>
      </section>

      <section className="bg-soft py-20 md:py-28">
        <div className="wrap">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Compétences</p>
          <h2 className="font-display mt-3 text-3xl font-semibold md:text-4xl">Ce que je sais faire</h2>
          <div className="mt-10 flex flex-wrap gap-3">
            {skills.map((s) => (
              <Link
                key={s.id}
                to="/competences"
                className="rounded-full border border-line bg-paper px-4 py-2 text-sm hover:border-accent hover:text-accent"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-20 md:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">Projets</p>
            <h2 className="font-display mt-3 text-3xl font-semibold md:text-4xl">Réalisations</h2>
          </div>
          <Link to="/projets" className="text-sm font-semibold text-accent hover:underline">
            Tous les projets →
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p) => (
            <article key={p.id}>
              <img src={p.image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <p className="mt-4 text-xs font-semibold tracking-wide text-accent uppercase">{p.category}</p>
              <h3 className="font-display mt-2 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-soft py-16 text-center">
        <p className="font-display text-sm tracking-wide text-muted uppercase">{site.signature}</p>
        <Link
          to="/contact"
          className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Me contacter
        </Link>
      </section>
    </div>
  )
}
