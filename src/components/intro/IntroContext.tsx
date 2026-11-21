import { createContext, useContext, type ReactNode } from 'react'
import { useIntroGate } from '@/hooks/useIntroGate'

type IntroCtx = ReturnType<typeof useIntroGate>

const Ctx = createContext<IntroCtx | null>(null)

export function IntroProvider({ children }: { children: ReactNode }) {
  const value = useIntroGate()
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useIntro() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useIntro must be used within IntroProvider')
  return v
}
