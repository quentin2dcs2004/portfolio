import { useEffect, useState } from 'react'
import { site } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/** Type → pause → erase → next role (classic terminal feel). */
export function TypewriterRoles() {
  const reduced = usePrefersReducedMotion()
  const roles = site.roles
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(reduced ? roles[0] : '')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduced) {
      setText(roles[index % roles.length])
      const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 2200)
      return () => window.clearInterval(id)
    }

    const full = roles[index]
    let timer: number

    if (!deleting && text === full) {
      timer = window.setTimeout(() => setDeleting(true), 1400)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % roles.length)
    } else {
      const speed = deleting ? 38 : 72
      timer = window.setTimeout(() => {
        const next = deleting
          ? full.slice(0, Math.max(0, text.length - 1))
          : full.slice(0, text.length + 1)
        setText(next)
      }, speed)
    }

    return () => window.clearTimeout(timer)
  }, [text, deleting, index, reduced, roles])

  return (
    <p className="mt-3 min-h-[1.75rem] text-lg text-cyan md:text-xl" aria-live="polite">
      <span className="text-muted">Je suis </span>
      <span className="font-display font-semibold neon-text">{text}</span>
      <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-0.5 animate-pulse bg-cyan align-middle" />
    </p>
  )
}
