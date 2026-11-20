import { motion } from 'framer-motion'

export function ScrollIndicator() {
  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-mist">
      <span className="font-display text-[10px] tracking-[0.35em] uppercase">Scroll</span>
      <motion.span
        className="h-10 w-px bg-gradient-to-b from-cyan to-transparent"
        animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
