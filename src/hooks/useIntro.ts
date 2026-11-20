import { useCallback, useState } from 'react'

const INTRO_KEY = 'quentin-intro-seen'

export function useIntro() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem(INTRO_KEY) !== '1'
  })

  const completeIntro = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, '1')
    setShowIntro(false)
  }, [])

  const skipIntro = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, '1')
    setShowIntro(false)
  }, [])

  return { showIntro, completeIntro, skipIntro }
}
