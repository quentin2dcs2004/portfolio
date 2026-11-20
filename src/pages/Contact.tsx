import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { site } from '@/data/site'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

const empty: FormState = { name: '', email: '', subject: '', message: '' }

export function Contact() {
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<'idle' | 'success'>('idle')

  const validate = () => {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = 'Le nom est requis.'
    if (!form.email.trim()) next.email = 'L’e-mail est requis.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Adresse e-mail invalide.'
    if (!form.subject.trim()) next.subject = 'L’objet est requis.'
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = 'Le message doit contenir au moins 10 caractères.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const body = encodeURIComponent(
      `Nom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    )
    const subject = encodeURIComponent(form.subject)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setStatus('success')
    setForm(empty)
  }

  return (
    <div className="container-page py-16">
      <SectionHeading
        eyebrow="Contact"
        title="Entrons en contact"
        description="Envoie un message ou utilise les coordonnées ci-dessous."
      />

      <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="font-display text-lg font-semibold">Coordonnées</h3>
          <ul className="mt-5 space-y-4 text-sm text-muted">
            <li>
              <span className="block font-medium text-ink">E-mail</span>
              <a href={`mailto:${site.email}`} className="hover:text-accent">
                {site.email}
              </a>
            </li>
            <li>
              <span className="block font-medium text-ink">Téléphone</span>
              <a
                href={`tel:+33${site.phone.replace(/\s/g, '').slice(1)}`}
                className="hover:text-accent"
              >
                {site.phone}
              </a>
            </li>
            <li>
              <span className="block font-medium text-ink">Localisation</span>
              {site.location}
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-3 py-1 text-xs hover:text-accent"
            >
              LinkedIn
            </a>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-3 py-1 text-xs hover:text-accent"
            >
              Instagram
            </a>
            <a
              href={site.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-3 py-1 text-xs hover:text-accent"
            >
              Facebook
            </a>
          </div>
        </aside>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-line bg-surface p-6"
          noValidate
        >
          {(
            [
              ['name', 'Nom', 'text'],
              ['email', 'Adresse e-mail', 'email'],
              ['subject', 'Objet', 'text'],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className={`w-full rounded-xl border bg-paper px-4 py-3 outline-none transition ${
                  errors[key] ? 'border-red-400' : 'border-line focus:border-accent'
                }`}
              />
              {errors[key] ? (
                <span className="mt-1 block text-xs text-red-600">{errors[key]}</span>
              ) : null}
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink">Message</span>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className={`w-full resize-y rounded-xl border bg-paper px-4 py-3 outline-none transition ${
                errors.message ? 'border-red-400' : 'border-line focus:border-accent'
              }`}
            />
            {errors.message ? (
              <span className="mt-1 block text-xs text-red-600">{errors.message}</span>
            ) : null}
          </label>

          <Button type="submit">
            Envoyer <Send size={16} />
          </Button>

          {status === 'success' ? (
            <p className="text-sm text-accent" role="status">
              Ton client mail va s’ouvrir pour finaliser l’envoi.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  )
}
