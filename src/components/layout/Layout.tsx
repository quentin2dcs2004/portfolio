import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Navigation } from './Navigation'
import { useEffect } from 'react'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="relative min-h-screen">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
