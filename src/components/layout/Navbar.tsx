import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { navLinks, site } from '@/data/site'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="pointer-events-auto fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="font-display flex h-10 w-10 items-center justify-center rounded-xl border border-electric/40 bg-night/70 text-lg text-cyan shadow-[0_0_20px_rgba(23,107,255,0.35)] transition group-hover:scale-105">
            Q
          </span>
          <span className="font-display text-sm tracking-[0.2em] text-snow uppercase">
            {site.name}
          </span>
        </Link>

        <nav className="glass hidden items-center gap-1 rounded-full px-2 py-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-xs tracking-wide transition ${
                  isActive
                    ? 'bg-electric/20 text-cyan'
                    : 'text-mist hover:text-snow'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="glass rounded-full p-2 text-snow lg:hidden"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass mx-4 mb-4 rounded-3xl p-4 lg:hidden"
          >
            <ul className="grid gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 text-sm ${
                        isActive ? 'bg-electric/20 text-cyan' : 'text-mist'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
