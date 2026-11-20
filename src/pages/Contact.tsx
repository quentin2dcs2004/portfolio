import { useState, type FormEvent } from 'react'
import { site } from '@/data/site'

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [ok, setOk] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Nom requis'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'E-mail invalide'
    if (!form.subject.trim()) next.subject = 'Objet requis'
    if (form.message.trim().length < 10) next.message = 'Message trop court'
    setErrors(next)
    if (Object.keys(next).length) return
    const body = encodeURIComponent(`Nom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(form.subject)}&body=${body}`
    setOk(true)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="wrap pt-28 pb-24">
      <p className="font-display text-xs tracking-[0.4em] text-cyan uppercase">Contact</p>
      <h1 className="font-display mt-4 text-4xl md:text-6xl">Entrons en contact</h1>
      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <div className="space-y-5 text-mist">
          <p>
            <span className="block text-sm text-snow">E-mail</span>
            <a href={`mailto:${site.email}`} className="hover:text-cyan">
              {site.email}
            </a>
          </p>
          <p>
            <span className="block text-sm text-snow">Téléphone</span>
            <a href={`tel:+33${site.phone.replace(/\s/g, '').slice(1)}`} className="hover:text-cyan">
              {site.phone}
            </a>
          </p>
          <p>
            <span className="block text-sm text-snow">Localisation</span>
            {site.location}
          </p>
          <div className="flex gap-4 pt-2 text-sm">
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan">
              LinkedIn
            </a>
            <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-cyan">
              Instagram
            </a>
            <a href={site.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-cyan">
              Facebook
            </a>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-5" noValidate>
          {(
            [
              ['name', 'Nom'],
              ['email', 'E-mail'],
              ['subject', 'Objet'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm">{label}</span>
              <input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className={`w-full border-0 border-b bg-transparent py-3 outline-none ${
                  errors[key] ? 'border-red-400' : 'border-white/20 focus:border-cyan'
                }`}
              />
              {errors[key] ? <span className="mt-1 block text-xs text-red-300">{errors[key]}</span> : null}
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-sm">Message</span>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className={`w-full resize-y border-0 border-b bg-transparent py-3 outline-none ${
                errors.message ? 'border-red-400' : 'border-white/20 focus:border-cyan'
              }`}
            />
            {errors.message ? (
              <span className="mt-1 block text-xs text-red-300">{errors.message}</span>
            ) : null}
          </label>
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-electric to-violet px-6 py-3 text-sm font-semibold"
          >
            Envoyer
          </button>
          {ok ? <p className="text-sm text-cyan">Client mail prêt pour l’envoi.</p> : null}
        </form>
      </div>
    </div>
  )
}
