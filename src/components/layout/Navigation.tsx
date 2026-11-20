import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LogoQ } from '@/components/brand/LogoQ'
import { navLinks, site } from '@/data/site'

export function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-void/70 backdrop-blur-xl">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <NavLink to="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <LogoQ size={36} />
          <span className="hidden font-display text-sm font-semibold tracking-[0.18em] uppercase sm:inline">
            {site.name}
          </span>
        </NavLink>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-2 py-1.5 text-[11px] tracking-wide transition ${
                  isActive
                    ? 'bg-white/8 text-cyan'
                    : 'text-muted hover:bg-white/5 hover:text-snow'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-snow xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="max-h-[70vh] overflow-y-auto border-t border-white/5 bg-void/95 px-4 py-3 xl:hidden"
          aria-label="Navigation mobile"
        >
          <ul className="grid gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm ${
                      isActive ? 'bg-white/10 text-cyan' : 'text-muted hover:text-snow'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
