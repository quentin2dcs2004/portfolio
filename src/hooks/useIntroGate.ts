import { useCallback, useState } from 'react'

const KEY = 'quentin-intro-seen'

function readSeen() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function useIntroGate() {
  // Show intro until skipped/finished this session. Force with ?intro=1
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      const force = new URLSearchParams(window.location.search).get('intro') === '1'
      if (force) {
        sessionStorage.removeItem(KEY)
        return true
      }
    } catch {
      /* ignore */
    }
    return !readSeen()
  })

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    setShowIntro(false)
  }, [])

  const replayIntro = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
    setShowIntro(true)
  }, [])

  return { showIntro, finishIntro, replayIntro }
}
