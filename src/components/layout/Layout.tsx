import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Navigation } from './Navigation'
import { AmbientUniverse } from '@/components/three/AmbientUniverse'
import { useEffect } from 'react'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="relative min-h-screen">
      <AmbientUniverse />
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
