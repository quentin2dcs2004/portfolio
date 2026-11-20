import { Link } from 'react-router-dom'
import { site } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="wrap flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-sm tracking-[0.25em] text-cyan uppercase">{site.name}</p>
          <p className="mt-2 text-sm text-mist">{site.signature}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-mist">
          <a href={`mailto:${site.email}`} className="hover:text-cyan">{site.email}</a>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan">
            LinkedIn
          </a>
          <Link to="/contact" className="hover:text-cyan">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
