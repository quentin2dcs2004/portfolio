import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function CustomCursor() {
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 350, damping: 28 })
  const sy = useSpring(y, { stiffness: 350, damping: 28 })

  useEffect(() => {
    if (reduced) return
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const interactive = target?.closest('a, button, input, textarea, [data-cursor]')
      setHovering(Boolean(interactive))
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [reduced, x, y])

  if (reduced || !visible) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference max-md:hidden"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <span
        className={`block rounded-full border border-cyan transition-all duration-200 ${
          hovering ? 'h-12 w-12 bg-cyan/20' : 'h-4 w-4 bg-cyan'
        }`}
      />
    </motion.div>
  )
}
