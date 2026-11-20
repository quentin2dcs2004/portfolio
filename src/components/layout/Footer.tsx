import { site } from '@/data/site'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5 py-10">
      <div className="wrap flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold tracking-wide">{site.name}</p>
          <p className="mt-1 text-sm text-muted">{site.signature}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <a className="hover:text-cyan" href={site.socials.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="hover:text-cyan" href={site.socials.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="hover:text-cyan" href={site.socials.instagramArt} target="_blank" rel="noreferrer">
            Luminart
          </a>
          <a className="hover:text-cyan" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
