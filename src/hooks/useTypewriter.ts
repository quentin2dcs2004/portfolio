import { useEffect, useRef, useState } from 'react'

/** Char-by-char typewriter (same feel as « Je suis Graphiste »). */
export function useTypewriter(
  full: string | null,
  opts?: { speed?: number; enabled?: boolean; onDone?: (text: string) => void },
) {
  const speed = opts?.speed ?? 36
  const enabled = opts?.enabled ?? true
  const onDoneRef = useRef(opts?.onDone)
  onDoneRef.current = opts?.onDone

  const [text, setText] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!full || !enabled) {
      setText(full && !enabled ? full : '')
      setDone(!!full && !enabled)
      return
    }
    setText('')
    setDone(false)
    let i = 0
    let timer = 0

    const tick = () => {
      i += 1
      const next = full.slice(0, i)
      setText(next)
      if (i >= full.length) {
        setDone(true)
        onDoneRef.current?.(full)
        return
      }
      timer = window.setTimeout(tick, speed)
    }
    timer = window.setTimeout(tick, speed)
    return () => window.clearTimeout(timer)
  }, [full, enabled, speed])

  return { text, done }
}
