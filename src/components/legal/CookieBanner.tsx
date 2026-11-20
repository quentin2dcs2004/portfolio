import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const KEY = 'quentin-cookie-consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const save = (value: 'accepted' | 'essential') => {
    try {
      localStorage.setItem(KEY, value)
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-white/10 bg-void/95 p-4 backdrop-blur-xl md:p-5"
      role="dialog"
      aria-label="Consentement cookies"
    >
      <div className="wrap flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-sm text-muted">
          Ce site utilise un stockage technique (intro + mémorisation de ce choix). Pas de pubs par
          défaut.{' '}
          <Link to="/cookies" className="text-cyan underline">
            En savoir plus
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-white/20 px-3 py-2 text-xs text-muted hover:text-snow"
            onClick={() => save('essential')}
          >
            Essentiels uniquement
          </button>
          <button
            type="button"
            className="rounded-lg bg-gradient-to-r from-electric to-violet px-3 py-2 text-xs font-semibold text-white"
            onClick={() => save('accepted')}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
