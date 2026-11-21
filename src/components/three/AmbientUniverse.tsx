import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'

const GalaxyScene = lazy(() =>
  import('@/components/three/GalaxyScene').then((m) => ({ default: m.GalaxyScene })),
)
const HyperField = lazy(() =>
  import('@/components/three/HyperField').then((m) => ({ default: m.HyperField })),
)

/** Persistent Three.js universe — denser ambient motion on every route. */
export function AmbientUniverse() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isHeavy3d =
    pathname.startsWith('/projets') || pathname.startsWith('/arena') || pathname.startsWith('/laboratoire')

  return (
    <div className="pointer-events-none fixed inset-0 -z-20" aria-hidden>
      <Suspense fallback={null}>
        <div className={`absolute inset-0 ${isHome ? 'opacity-45' : isHeavy3d ? 'opacity-35' : 'opacity-80'}`}>
          <GalaxyScene mode="ambient" />
        </div>
        {!isHome && !isHeavy3d ? (
          <div className="absolute inset-x-0 top-0 h-[55vh] opacity-40">
            <HyperField
              theme={
                pathname.includes('story')
                  ? 'pink'
                  : pathname.includes('contact')
                    ? 'cyan'
                    : pathname.includes('apprendre')
                      ? 'violet'
                      : pathname.includes('passions')
                        ? 'pink'
                        : 'mixed'
              }
              density="ambient"
              height="h-full"
              className="rounded-none border-0"
            />
          </div>
        ) : null}
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/85" />
    </div>
  )
}
