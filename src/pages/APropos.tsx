import { site, timeline } from '@/data/site'

export function APropos() {
  return (
    <div className="wrap py-16 md:py-24">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">À propos</p>
          <h1 className="font-display mt-3 text-4xl font-semibold md:text-5xl">{site.fullName}</h1>
          <p className="mt-6 text-lg text-muted">{site.tagline}</p>
          <p className="mt-4 text-muted">
            Diplômé d’un Bac Pro RPIP, je poursuis une formation de testeur de jeux vidéo tout en
            développant mes compétences en graphisme, impression 3D et développement web.
          </p>
        </div>
        <img
          src={site.photo}
          alt={`Portrait de ${site.fullName}`}
          className="aspect-[3/4] w-full max-w-md object-cover object-top"
        />
      </div>

      <section className="mt-20">
        <h2 className="font-display text-2xl font-semibold">Repères</h2>
        <div className="mt-8 space-y-0">
          {timeline.map((item) => (
            <article key={item.id} className="grid gap-2 border-t border-line py-6 md:grid-cols-[160px_1fr]">
              <p className="text-sm font-semibold text-accent">{item.year}</p>
              <div>
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted">{item.summary}</p>
                <p className="mt-1 text-sm text-muted">{item.details}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
