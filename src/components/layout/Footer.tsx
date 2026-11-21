import { Link } from 'react-router-dom'
import { LogoQ } from '@/components/brand/LogoQ'
import { legalLinks, moreLinks, site } from '@/data/site'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 py-10">
      <div className="wrap flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-3">
            <LogoQ size={40} />
            <div>
              <p className="font-display text-lg font-semibold tracking-wide">{site.name}</p>
              <p className="mt-1 text-sm text-muted">{site.signature}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            {moreLinks.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-snow">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 border-t border-white/10 pt-4 text-xs text-muted">
          {legalLinks.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-cyan">
              {l.label}
            </Link>
          ))}
          <span className="text-white/20">·</span>
          <a className="hover:text-cyan" href={site.socials.instagramArt} target="_blank" rel="noreferrer">
            Luminart
          </a>
          <span className="text-white/20">·</span>
          <span>
            © {new Date().getFullYear()} {site.fullName}
          </span>
        </div>
      </div>
    </footer>
  )
}
