import { lazy, Suspense, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageTransition } from '@/components/ui/PageTransition'
import { LogoQ } from '@/components/brand/LogoQ'
import { site } from '@/data/site'

const HyperField = lazy(() =>
  import('@/components/three/HyperField').then((m) => ({ default: m.HyperField })),
)

type Status = 'idle' | 'loading' | 'success' | 'error'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [consent, setConsent] = useState(false)

  const validate = (data: FormData) => {
    const next: Record<string, string> = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const subject = String(data.get('subject') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    if (!name) next.name = 'Nom requis'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'E-mail invalide'
    if (!subject) next.subject = 'Objet requis'
    if (message.length < 10) next.message = '10 caractères minimum'
    if (!consent) next.consent = 'Consentement requis'
    return next
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const next = validate(data)
    setErrors(next)
    if (Object.keys(next).length) {
      setStatus('error')
      return
    }
    setStatus('loading')
    window.setTimeout(() => {
      const name = String(data.get('name'))
      const email = String(data.get('email'))
      const subject = String(data.get('subject'))
      const message = String(data.get('message'))
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}\nConsentement RGPD : oui`)
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${body}`
      setStatus('success')
      form.reset()
      setConsent(false)
    }, 600)
  }

  return (
    <PageTransition>
      <div className="relative min-h-[100svh] overflow-hidden pt-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 20% 0%, rgba(0,245,212,0.2), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255,70,162,0.18), transparent 45%), #050509',
          }}
        />

        <div className="wrap mb-8">
          <p className="text-xs tracking-[0.28em] text-[#FF46A2] uppercase">Discutons</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Contact</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/65">
            Brief clair, retour soigné. Identité, print, 3D ou web — on construit l’univers ensemble.
          </p>
          <Suspense fallback={null}>
            <div className="mt-6">
              <HyperField theme="cyan" density="panel" height="h-[180px] md:h-[240px]" />
            </div>
          </Suspense>
        </div>

        <div className="wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <aside className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
              style={{ background: 'rgba(0,245,212,0.25)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-8 h-44 w-44 rounded-full blur-3xl"
              style={{ background: 'rgba(255,70,162,0.2)' }}
            />
            <div className="relative">
              <LogoQ size={56} />
              <p className="mt-6 font-display text-2xl font-semibold">Luminart × Quentin</p>
              <p className="mt-3 text-sm text-white/65">
                Un message clair, un retour soigné. Pas de spam — juste une conversation.
              </p>
            </div>
            <ul className="mt-10 space-y-4 text-sm">
              <li>
                <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">E-mail</p>
                <a className="text-[#00F5D4] hover:underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li>
                <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Téléphone</p>
                <a className="text-white hover:text-[#FF46A2]" href={`tel:+33${site.phone.replace(/\s/g, '').slice(1)}`}>
                  {site.phone}
                </a>
              </li>
              <li>
                <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Réseaux</p>
                <div className="mt-1 flex flex-wrap gap-3">
                  <a href={site.socials.instagram} className="text-white/70 hover:text-white" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                  <a href={site.socials.instagramArt} className="text-[#FF46A2] hover:underline" target="_blank" rel="noreferrer">
                    Luminart
                  </a>
                  <a href={site.socials.linkedin} className="text-white/70 hover:text-white" target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </div>
              </li>
            </ul>
          </aside>

          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-6 md:p-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field id="name" label="Nom" error={errors.name} className="md:col-span-1">
                <input id="name" name="name" className="field" autoComplete="name" placeholder="Ton nom" />
              </Field>
              <Field id="email" label="E-mail" error={errors.email}>
                <input id="email" name="email" type="email" className="field" autoComplete="email" placeholder="toi@mail.com" />
              </Field>
              <Field id="subject" label="Objet" error={errors.subject} className="md:col-span-2">
                <input id="subject" name="subject" className="field" placeholder="Sujet" />
              </Field>
              <Field id="message" label="Message" error={errors.message} className="md:col-span-2">
                <textarea id="message" name="message" rows={6} className="field resize-y" placeholder="Parle-moi du projet…" />
              </Field>
            </div>

            <label className="mt-5 flex items-start gap-3 text-sm text-white/60">
              <input type="checkbox" className="mt-1" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>
                J’accepte d’être recontacté·e (voir{' '}
                <Link to="/confidentialite" className="text-[#00F5D4] underline">
                  confidentialité
                </Link>
                ).
              </span>
            </label>
            {errors.consent ? <p className="mt-2 text-xs text-red-300">{errors.consent}</p> : null}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-[#00F5D4] to-[#FF46A2] py-3.5 text-sm font-semibold text-black disabled:opacity-60 md:w-auto md:px-10"
            >
              {status === 'loading' ? 'Ouverture mail…' : 'Envoyer le message'}
            </button>
            {status === 'success' ? (
              <p className="mt-3 text-sm text-[#00F5D4]">Merci — ton client mail va s’ouvrir.</p>
            ) : null}
            {status === 'error' ? (
              <p className="mt-3 text-sm text-red-300">Vérifie les champs.</p>
            ) : null}
          </form>
        </div>

        <style>{`
          .field {
            width: 100%;
            margin-top: 0.4rem;
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 999px;
            background: rgba(0,0,0,0.35);
            padding: 0.85rem 1.1rem;
            color: white;
          }
          textarea.field { border-radius: 1.25rem; }
          .field:focus {
            outline: none;
            border-color: rgba(0,245,212,0.55);
            box-shadow: 0 0 0 3px rgba(0,245,212,0.12);
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
  className = '',
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label htmlFor={id} className={`block text-sm ${className}`}>
      <span className="text-white/80">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-300">{error}</span> : null}
    </label>
  )
}
