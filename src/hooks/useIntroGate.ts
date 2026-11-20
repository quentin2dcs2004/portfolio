import { useCallback, useState } from 'react'

const KEY = 'quentin-intro-seen'

export function useIntroGate() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem(KEY) !== '1'
    } catch {
      return true
    }
  })

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    setShowIntro(false)
  }, [])

  return { showIntro, finishIntro }
}
