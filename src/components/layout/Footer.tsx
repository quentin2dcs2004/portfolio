import { site } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-col gap-3 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-sm font-semibold">{site.fullName}</p>
        <p className="text-sm text-muted">
          <a href={`mailto:${site.email}`} className="hover:text-accent">
            {site.email}
          </a>
          <span className="mx-2">·</span>
          {site.location}
        </p>
      </div>
    </footer>
  )
}
