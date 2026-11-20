import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { site } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function TypewriterRoles() {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % site.roles.length)
    }, 2200)
    return () => window.clearInterval(id)
  }, [reduced])

  const role = site.roles[index]

  return (
    <p className="mt-3 min-h-[1.75rem] text-lg text-cyan md:text-xl" aria-live="polite">
      <span className="text-muted">Je suis </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={role}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="inline-block font-display font-semibold neon-text"
        >
          {role}
        </motion.span>
      </AnimatePresence>
      <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-0.5 animate-pulse bg-cyan align-middle" />
    </p>
  )
}
