import { useCallback, useState } from 'react'

const KEY = 'quentin-intro-v2'

export function useIntro() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem(KEY) !== '1'
  })

  const finish = useCallback(() => {
    sessionStorage.setItem(KEY, '1')
    setShowIntro(false)
  }, [])

  return { showIntro, finish }
}
