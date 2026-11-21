import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LogoQ } from '@/components/brand/LogoQ'
import { moreLinks, navLinks, site } from '@/data/site'

/** Simple galaxy-style bar: brand left, text links right, underline active. */
export function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="wrap flex h-[4.25rem] items-center justify-between gap-6">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 tracking-[0.2em]"
          onClick={() => setOpen(false)}
        >
          <LogoQ size={32} />
          <span className="font-display text-[13px] font-semibold uppercase text-snow">
            {site.name}
          </span>
        </NavLink>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative pb-1 text-[13px] font-light tracking-wide text-snow/85 transition hover:text-snow ${
                  isActive
                    ? 'text-snow after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-snow'
                    : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center text-snow md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-white/10 bg-black/90 px-5 py-4 backdrop-blur-md md:hidden"
          aria-label="Navigation mobile"
        >
          <ul className="grid gap-3">
            {[...navLinks, ...moreLinks].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm tracking-wide ${isActive ? 'text-snow' : 'text-snow/70'}`
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
