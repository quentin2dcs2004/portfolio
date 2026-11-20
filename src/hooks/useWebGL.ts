import { useEffect, useState } from 'react'

export function useWebGLSupport() {
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      setSupported(Boolean(gl))
    } catch {
      setSupported(false)
    }
  }, [])

  return supported
}
