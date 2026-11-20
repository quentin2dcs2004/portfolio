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
    <div className="wrap py-16 md:py-24">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">Contact</p>
      <h1 className="font-display mt-3 text-4xl font-semibold md:text-5xl">Entrons en contact</h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div className="space-y-4 text-muted">
          <p>
            <span className="block text-sm font-semibold text-ink">E-mail</span>
            <a href={`mailto:${site.email}`} className="hover:text-accent">{site.email}</a>
          </p>
          <p>
            <span className="block text-sm font-semibold text-ink">Téléphone</span>
            <a href={`tel:+33${site.phone.replace(/\s/g, '').slice(1)}`} className="hover:text-accent">
              {site.phone}
            </a>
          </p>
          <p>
            <span className="block text-sm font-semibold text-ink">Localisation</span>
            {site.location}
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          {(
            [
              ['name', 'Nom'],
              ['email', 'E-mail'],
              ['subject', 'Objet'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1 block text-sm font-medium">{label}</span>
              <input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className={`w-full border px-3 py-2.5 outline-none focus:border-accent ${
                  errors[key] ? 'border-red-400' : 'border-line'
                }`}
              />
              {errors[key] ? <span className="mt-1 block text-xs text-red-600">{errors[key]}</span> : null}
            </label>
          ))}
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Message</span>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className={`w-full border px-3 py-2.5 outline-none focus:border-accent ${
                errors.message ? 'border-red-400' : 'border-line'
              }`}
            />
            {errors.message ? (
              <span className="mt-1 block text-xs text-red-600">{errors.message}</span>
            ) : null}
          </label>
          <button type="submit" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
            Envoyer
          </button>
          {ok ? <p className="text-sm text-accent">Ton client mail va s’ouvrir.</p> : null}
        </form>
      </div>
    </div>
  )
}
