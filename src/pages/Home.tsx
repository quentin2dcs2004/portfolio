import { useState, type FormEvent } from 'react'
import { site, skills, projects, timeline } from '@/data/site'

export function Home() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Nom requis'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'E-mail invalide'
    if (!form.subject.trim()) next.subject = 'Objet requis'
    if (form.message.trim().length < 10) next.message = 'Message trop court'
    setErrors(next)
    if (Object.keys(next).length) return

    const body = encodeURIComponent(`Nom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(form.subject)}&body=${body}`
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div>
      {/* HERO plein écran */}
      <section id="accueil" className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${site.photo})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />

        <div className="wrap relative flex min-h-screen items-end pb-16 pt-28 md:items-center md:pb-0">
          <div className="max-w-2xl text-white">
            <p className="font-display text-5xl font-bold tracking-tight md:text-7xl">{site.name}</p>
            <h1 className="mt-5 text-xl font-medium text-white/90 md:text-2xl">{site.greeting}</h1>
            <p className="mt-4 max-w-xl text-base text-white/75 md:text-lg">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#projets"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white/90"
              >
                Voir mes projets
              </a>
              <a
                href="#contact"
                className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Me contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* À PROPOS */}
      <section id="apropos" className="section">
        <div className="wrap grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">À propos</p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Qui suis-je ?
            </h2>
          </div>
          <div className="space-y-5 text-lg text-muted">
            <p>
              Passionné par la créativité, je développe un profil polyvalent entre design,
              impression, fabrication numérique et relation client.
            </p>
            <p>
              Diplômé d’un Bac Pro RPIP, je poursuis une formation de testeur de jeux vidéo tout
              en renforçant mes compétences en graphisme, 3D et développement web.
            </p>
            <p className="text-base text-ink">
              {site.roles.join(' · ')}
            </p>
          </div>
        </div>
      </section>

      {/* COMPÉTENCES */}
      <section id="competences" className="section bg-soft">
        <div className="wrap">
          <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">Compétences</p>
          <h2 className="font-display mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
            Mes spécialités
          </h2>

          <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <article key={skill.id}>
                <h3 className="font-display text-xl font-semibold">{skill.title}</h3>
                <p className="mt-2 text-sm text-muted">{skill.description}</p>
                <ul className="mt-4 space-y-1 text-sm text-ink">
                  {skill.items.map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
                {skill.softwares.length > 0 ? (
                  <p className="mt-4 text-xs tracking-wide text-muted uppercase">
                    {skill.softwares.join(' · ')}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROJETS */}
      <section id="projets" className="section">
        <div className="wrap">
          <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">Projets</p>
          <h2 className="font-display mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
            Mes réalisations
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Emplacements prêts à accueillir tes vrais projets. Remplace les textes dans{' '}
            <code className="text-sm">src/data/site.ts</code>.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.id} className="group">
                <div className="overflow-hidden">
                  <img
                    src={project.image}
                    alt=""
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                  {project.category}
                </p>
                <h3 className="font-display mt-2 text-lg font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm text-muted">{project.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PARCOURS */}
      <section id="parcours" className="section bg-soft">
        <div className="wrap">
          <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">Parcours</p>
          <h2 className="font-display mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
            Mon évolution
          </h2>

          <ol className="mt-12 space-y-0">
            {timeline.map((event, i) => (
              <li
                key={event.id}
                className={`grid gap-4 border-t border-line py-8 md:grid-cols-[160px_1fr] ${
                  i === timeline.length - 1 ? 'border-b' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-accent">{event.year}</p>
                  <p className="mt-1 text-xs tracking-wide text-muted uppercase">{event.type}</p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">{event.title}</h3>
                  <p className="mt-2 text-muted">{event.summary}</p>
                  <p className="mt-2 text-sm text-ink/80">{event.details}</p>
                  {!event.verified ? (
                    <p className="mt-2 text-xs font-medium text-accent">Emplacement modifiable</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="wrap grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">Contact</p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Entrons en contact
            </h2>
            <div className="mt-8 space-y-4 text-muted">
              <p>
                <span className="block text-sm font-semibold text-ink">E-mail</span>
                <a href={`mailto:${site.email}`} className="hover:text-accent">
                  {site.email}
                </a>
              </p>
              <p>
                <span className="block text-sm font-semibold text-ink">Téléphone</span>
                <a
                  href={`tel:+33${site.phone.replace(/\s/g, '').slice(1)}`}
                  className="hover:text-accent"
                >
                  {site.phone}
                </a>
              </p>
              <p>
                <span className="block text-sm font-semibold text-ink">Localisation</span>
                {site.location}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-sm">
                <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">
                  LinkedIn
                </a>
                <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-accent">
                  Instagram
                </a>
                <a href={site.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-accent">
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {(
              [
                ['name', 'Nom', 'text'],
                ['email', 'E-mail', 'email'],
                ['subject', 'Objet', 'text'],
              ] as const
            ).map(([key, label, type]) => (
              <label key={key} className="block">
                <span className="mb-2 block text-sm font-medium">{label}</span>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className={`w-full border-0 border-b bg-transparent px-0 py-3 outline-none transition ${
                    errors[key] ? 'border-red-500' : 'border-line focus:border-accent'
                  }`}
                />
                {errors[key] ? <span className="mt-1 block text-xs text-red-600">{errors[key]}</span> : null}
              </label>
            ))}
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Message</span>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className={`w-full resize-y border-0 border-b bg-transparent px-0 py-3 outline-none transition ${
                  errors.message ? 'border-red-500' : 'border-line focus:border-accent'
                }`}
              />
              {errors.message ? (
                <span className="mt-1 block text-xs text-red-600">{errors.message}</span>
              ) : null}
            </label>
            <button
              type="submit"
              className="mt-4 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Envoyer
            </button>
            {sent ? (
              <p className="text-sm text-accent" role="status">
                Ton client mail va s’ouvrir pour finaliser l’envoi.
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </div>
  )
}
