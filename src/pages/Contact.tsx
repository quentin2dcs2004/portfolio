import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { site } from '@/data/site'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notify, setNotify] = useState(false)

  const validate = (data: FormData) => {
    const next: Record<string, string> = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const subject = String(data.get('subject') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    if (!name) next.name = 'Indique ton nom.'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'E-mail invalide.'
    if (!subject) next.subject = 'Ajoute un objet.'
    if (message.length < 10) next.message = 'Message trop court (10 caractères min.).'
    return next
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const nextErrors = validate(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setStatus('error')
      return
    }

    setStatus('loading')
    window.setTimeout(() => {
      const name = String(data.get('name'))
      const email = String(data.get('email'))
      const subject = String(data.get('subject'))
      const message = String(data.get('message'))
      const body = encodeURIComponent(`${message}\n\n— ${name}`)
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${body}%0A%0A(${encodeURIComponent(email)})`
      setStatus('success')
      setNotify(true)
      form.reset()
      window.setTimeout(() => setNotify(false), 4500)
    }, 700)
  }

  return (
    <div className="page-pad wrap">
      <PageHero
        eyebrow="Contact"
        title="Écrivons-nous"
        lead="Formulaire avec validation. L’envoi ouvre ton client mail vers Quentin (pas de backend pour l’instant)."
      />

      {notify ? (
        <div
          className="mb-6 flex items-center gap-3 rounded-2xl border border-cyan/35 bg-cyan/10 px-4 py-3 text-sm text-cyan"
          role="status"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
          Vous avez un message — confirmation envoyée.
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="glass rounded-3xl p-6 md:p-8" onSubmit={onSubmit} noValidate>
          <div className="grid gap-4">
            <Field id="name" label="Nom" error={errors.name}>
              <input
                id="name"
                name="name"
                autoComplete="name"
                className="field"
                placeholder="Ton nom"
              />
            </Field>
            <Field id="email" label="Adresse e-mail" error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="field"
                placeholder="toi@exemple.com"
              />
            </Field>
            <Field id="subject" label="Objet" error={errors.subject}>
              <input id="subject" name="subject" className="field" placeholder="Sujet du message" />
            </Field>
            <Field id="message" label="Message" error={errors.message}>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="field resize-y"
                placeholder="Ton message…"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="mt-6 inline-flex min-w-[160px] items-center justify-center rounded-xl bg-gradient-to-r from-electric to-violet px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {status === 'loading' ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Envoi…
              </span>
            ) : (
              'Envoyer'
            )}
          </button>

          {status === 'error' ? (
            <p className="mt-3 text-sm text-red-300" role="alert">
              Vérifie les champs en rouge.
            </p>
          ) : null}
          {status === 'success' ? (
            <p className="mt-3 text-sm text-cyan" role="status">
              Merci — ton client mail va s’ouvrir.
            </p>
          ) : null}
        </form>

        <aside className="glass rounded-3xl p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold">Coordonnées</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <span className="text-snow">E-mail · </span>
              <a className="text-cyan hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <span className="text-snow">Téléphone · </span>
              <a className="text-cyan hover:underline" href={`tel:+33${site.phone.replace(/\s/g, '').slice(1)}`}>
                {site.phone}
              </a>
            </li>
            <li>
              <span className="text-snow">Ville · </span>
              {site.location}
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a className="text-cyan hover:underline" href={site.socials.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="text-cyan hover:underline" href={site.socials.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a className="text-cyan hover:underline" href={site.socials.instagramArt} target="_blank" rel="noreferrer">
              Luminart
            </a>
            <a className="text-cyan hover:underline" href={site.socials.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          </div>
        </aside>
      </div>

      <style>{`
        .field {
          width: 100%;
          margin-top: 0.35rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(5,5,9,0.55);
          padding: 0.7rem 0.9rem;
          color: #f5f5f5;
        }
        .field:focus {
          outline: none;
          border-color: rgba(0,229,255,0.55);
          box-shadow: 0 0 0 3px rgba(0,229,255,0.12);
        }
      `}</style>
    </div>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label htmlFor={id} className="block text-sm">
      <span className="text-snow/90">{label}</span>
      <div className={error ? '[&_.field]:border-red-400/60' : ''}>{children}</div>
      {error ? (
        <span className="mt-1 block text-xs text-red-300" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}
