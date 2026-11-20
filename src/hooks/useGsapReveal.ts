import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/** Reveal elements with [data-reveal] on scroll via GSAP ScrollTrigger. */
export function useGsapReveal(rootSelector = 'main') {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const root = document.querySelector(rootSelector)
    if (!root) return

    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]')
    const ctx = gsap.context(() => {
      targets.forEach((el) => {
        const delay = Number(el.dataset.revealDelay ?? 0)
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          },
        )
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [reduced, rootSelector])
}
