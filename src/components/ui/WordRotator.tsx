import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function WordRotator({ words, interval = 2200 }: { words: readonly string[]; interval?: number }) {
  const [index, setIndex] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [words, interval, reduced])

  if (reduced) {
    return <span className="text-gradient font-semibold">{words[0]}</span>
  }

  return (
    <span className="relative inline-grid min-w-[12ch] text-left">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 18, opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -18, opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 text-gradient font-semibold"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
