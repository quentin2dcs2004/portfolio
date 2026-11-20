import { useState, type FormEvent } from 'react'
import { Loader2, Send } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { NotificationToast } from '@/components/ui/NotificationToast'
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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [toast, setToast] = useState(false)

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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      setStatus('error')
      return
    }
    setStatus('loading')
    // Mailto fallback — opérationnel sans backend
    await new Promise((r) => setTimeout(r, 900))
    const body = encodeURIComponent(
      `Nom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    )
    const subject = encodeURIComponent(form.subject)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setStatus('success')
    setToast(true)
    setForm(empty)
    window.setTimeout(() => setToast(false), 4200)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-20 md:px-6">
      <SectionHeading
        eyebrow="Contact"
        title="Entrons en contact"
        description="Formulaire validé, confirmation visuelle et notification « Vous avez un message »."
      />

      <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <aside className="glass rounded-[1.75rem] p-6 neon-border">
          <p className="font-display text-xs tracking-[0.3em] text-cyan uppercase">Coordonnées</p>
          <ul className="mt-5 space-y-4 text-sm text-mist">
            <li>
              <span className="block text-snow">E-mail</span>
              <a href={`mailto:${site.email}`} className="hover:text-cyan">
                {site.email}
              </a>
            </li>
            <li>
              <span className="block text-snow">Téléphone</span>
              <a href={`tel:+33${site.phone.replace(/\s/g, '').slice(1)}`} className="hover:text-cyan">
                {site.phone}
              </a>
            </li>
            <li>
              <span className="block text-snow">Localisation</span>
              {site.location}
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-3 py-1 text-xs hover:text-cyan"
            >
              LinkedIn
            </a>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-3 py-1 text-xs hover:text-cyan"
            >
              Instagram
            </a>
            <a
              href={site.socials.instagramArt}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-3 py-1 text-xs hover:text-cyan"
            >
              Luminart
            </a>
            <a
              href={site.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-3 py-1 text-xs hover:text-cyan"
            >
              Facebook
            </a>
          </div>
        </aside>

        <form onSubmit={onSubmit} className="glass space-y-4 rounded-[1.75rem] p-6 neon-border" noValidate>
          {(
            [
              ['name', 'Nom', 'text'],
              ['email', 'Adresse e-mail', 'email'],
              ['subject', 'Objet', 'text'],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm text-snow">{label}</span>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className={`w-full rounded-2xl border bg-void/50 px-4 py-3 text-snow outline-none transition ${
                  errors[key]
                    ? 'border-red-400/70 shadow-[0_0_16px_rgba(248,113,113,0.25)]'
                    : 'border-white/15 focus:border-cyan/50'
                }`}
                aria-invalid={Boolean(errors[key])}
              />
              {errors[key] ? (
                <span className="mt-1 block text-xs text-red-300">{errors[key]}</span>
              ) : null}
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-sm text-snow">Message</span>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className={`w-full resize-y rounded-2xl border bg-void/50 px-4 py-3 text-snow outline-none transition ${
                errors.message
                  ? 'border-red-400/70 shadow-[0_0_16px_rgba(248,113,113,0.25)]'
                  : 'border-white/15 focus:border-cyan/50'
              }`}
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message ? (
              <span className="mt-1 block text-xs text-red-300">{errors.message}</span>
            ) : null}
          </label>

          <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto">
            {status === 'loading' ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Envoi…
              </>
            ) : (
              <>
                Envoyer <Send size={16} />
              </>
            )}
          </Button>

          {status === 'success' ? (
            <p className="text-sm text-cyan" role="status">
              Message prêt — votre client mail s’ouvre pour l’envoi.
            </p>
          ) : null}
          {status === 'error' && Object.keys(errors).length > 0 ? (
            <p className="text-sm text-red-300" role="alert">
              Merci de corriger les champs en erreur.
            </p>
          ) : null}
        </form>
      </div>

      <NotificationToast open={toast} message="Vous avez un message" />
    </div>
  )
}
