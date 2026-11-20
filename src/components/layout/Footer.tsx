import { Link } from 'react-router-dom'
import { site } from '@/data/site'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="container-page flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display font-semibold text-ink">{site.fullName}</p>
          <p className="mt-1 text-sm text-muted">{site.location}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <a href={`mailto:${site.email}`} className="hover:text-accent">
            {site.email}
          </a>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">
            LinkedIn
          </a>
          <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-accent">
            Instagram
          </a>
          <Link to="/contact" className="hover:text-accent">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
