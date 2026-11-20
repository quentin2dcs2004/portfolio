import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'

const GalaxyScene = lazy(() =>
  import('@/components/three/GalaxyScene').then((m) => ({ default: m.GalaxyScene })),
)

/** Subtle Three.js backdrop on every page so the 3D universe never disappears. */
export function AmbientUniverse() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Home already has a full hero scene — keep a lighter ambient layer underneath.
  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-20 ${isHome ? 'opacity-40' : 'opacity-70'}`}
      aria-hidden
    >
      <Suspense fallback={null}>
        <GalaxyScene mode="ambient" />
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-void/50 via-transparent to-void/80" />
    </div>
  )
}
