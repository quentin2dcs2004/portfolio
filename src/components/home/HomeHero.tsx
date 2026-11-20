import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/data/site'

export function HomeHero() {
  const [role, setRole] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setRole((i) => (i + 1) % site.roles.length)
    }, 2400)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-[100svh]">
      <img
        src={site.photo}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />

      <div className="wrap relative flex min-h-[100svh] items-end pb-16 pt-28 md:items-center md:pb-20">
        <div className="max-w-2xl text-white">
          <p className="font-display text-5xl font-bold tracking-tight md:text-7xl">{site.name}</p>
          <h1 className="mt-5 text-xl text-white/90 md:text-2xl">{site.greeting}</h1>
          <p className="mt-4 max-w-xl text-base text-white/75 md:text-lg">{site.tagline}</p>
          <p className="mt-5 text-lg">
            Je suis <span className="font-semibold text-white">{site.roles[role]}</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/projets"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink hover:bg-white/90"
            >
              Voir mes projets
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Me contacter
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
