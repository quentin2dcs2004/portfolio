import { Link } from 'react-router-dom'
import { site } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-soft">
      <div className="wrap flex flex-col gap-3 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-sm font-semibold">{site.fullName}</p>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <a href={`mailto:${site.email}`} className="hover:text-accent">{site.email}</a>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">
            LinkedIn
          </a>
          <Link to="/contact" className="hover:text-accent">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
