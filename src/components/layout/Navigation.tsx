import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { navLinks, site } from '@/data/site'

export function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="wrap flex h-20 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="font-display flex h-10 w-10 items-center justify-center rounded-full border border-cyan/40 text-sm text-cyan shadow-[0_0_24px_rgba(0,229,255,0.25)] transition group-hover:scale-105">
            Q
          </span>
          <span className="font-display text-sm tracking-[0.28em] uppercase">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-xs tracking-wide transition ${
                  isActive ? 'text-cyan' : 'text-mist hover:text-snow'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-full border border-white/15 p-2 text-snow xl:hidden"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mb-4 rounded-3xl border border-white/10 bg-space/95 p-4 backdrop-blur-xl xl:hidden"
          >
            <ul className="grid gap-1 sm:grid-cols-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
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
