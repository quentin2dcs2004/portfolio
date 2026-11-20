import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/ui/PageHero'
import { PageTransition } from '@/components/ui/PageTransition'
import { site } from '@/data/site'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notify, setNotify] = useState(false)
  const [consent, setConsent] = useState(false)

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
    if (!consent) next.consent = 'Merci d’accepter le traitement de tes données pour ce contact.'
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
      const body = encodeURIComponent(
        `${message}\n\n— ${name}\n(${email})\n\nConsentement contact / RGPD : oui`,
      )
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${body}`
      setStatus('success')
      setNotify(true)
      form.reset()
      setConsent(false)
      window.setTimeout(() => setNotify(false), 5000)
    }, 650)
  }

  return (
    <PageTransition>
      <div className="page-pad wrap">
        <PageHero
          eyebrow="Contact"
          title="Écrivons-nous"
          lead="Formulaire propre, validé, avec consentement RGPD. L’envoi ouvre ton client mail — aucun serveur ne stocke le message pour l’instant."
        />

        {notify ? (
          <div
            className="mb-6 flex items-center gap-3 rounded-2xl border border-cyan/35 bg-cyan/10 px-4 py-3 text-sm text-cyan"
            role="status"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
            Vous avez un message — confirmation prête.
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-[0_0_50px_rgba(23,107,255,0.12)] backdrop-blur-xl md:p-8"
            onSubmit={onSubmit}
            noValidate
          >
            <div className="grid gap-5">
              <Field id="name" label="Nom" error={errors.name}>
                <input id="name" name="name" autoComplete="name" className="field" placeholder="Ton nom" />
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
                  rows={6}
                  className="field resize-y"
                  placeholder="Ton message…"
                />
              </Field>

              <label className="flex items-start gap-3 text-sm text-muted">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  J’accepte que mes données soient utilisées uniquement pour me recontacter (voir{' '}
                  <Link className="text-cyan underline" to="/confidentialite">
                    Confidentialité
                  </Link>
                  ).
                </span>
              </label>
              {errors.consent ? (
                <p className="text-xs text-red-300" role="alert">
                  {errors.consent}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-neon mt-6 inline-flex min-w-[180px] items-center justify-center rounded-xl bg-gradient-to-r from-electric to-violet px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
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
                Vérifie les champs indiqués.
              </p>
            ) : null}
            {status === 'success' ? (
              <p className="mt-3 text-sm text-cyan" role="status">
                Merci — ton client mail va s’ouvrir.
              </p>
            ) : null}
          </form>

          <aside className="rounded-3xl border border-cyan/20 bg-void/50 p-6 md:p-8">
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
                <a
                  className="text-cyan hover:underline"
                  href={`tel:+33${site.phone.replace(/\s/g, '').slice(1)}`}
                >
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
            </div>
            <p className="mt-8 text-xs leading-relaxed text-muted">
              En envoyant un message, tu reconnais avoir lu les mentions légales et la politique de
              confidentialité. Pas de spam, pas de revente de données.
            </p>
          </aside>
        </div>

        <style>{`
          .field {
            width: 100%;
            margin-top: 0.4rem;
            border-radius: 0.85rem;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(5,5,9,0.55);
            padding: 0.8rem 1rem;
            color: #f5f5f5;
          }
          .field:focus {
            outline: none;
            border-color: rgba(0,229,255,0.55);
            box-shadow: 0 0 0 3px rgba(0,229,255,0.12);
          }
        `}</style>
      </div>
    </PageTransition>
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
