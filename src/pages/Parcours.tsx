import { useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { timeline } from '@/data/site'

export function Parcours() {
  const [openId, setOpenId] = useState<string | null>(timeline[0]?.id ?? null)

  return (
    <div className="container-page py-16">
      <SectionHeading
        eyebrow="Parcours"
        title="Mon évolution"
        description="Formations et objectifs confirmés. Les étapes non renseignées restent modifiables."
      />

      <ol className="space-y-4">
        {timeline.map((event) => {
          const open = openId === event.id
          return (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : event.id)}
                className="w-full rounded-2xl border border-line bg-surface p-5 text-left transition hover:border-accent/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wide text-accent uppercase">
                    {event.year}
                  </span>
                  <span className="rounded-full bg-paper px-2 py-0.5 text-xs text-muted">
                    {event.type}
                  </span>
                </div>
                <h3 className="font-display mt-3 text-xl font-semibold text-ink">{event.title}</h3>
                <p className="mt-2 text-sm text-muted">{event.summary}</p>
                {!event.verified ? (
                  <p className="mt-2 text-xs font-medium text-accent">Emplacement modifiable</p>
                ) : null}
                {open ? (
                  <p className="mt-4 border-t border-line pt-4 text-sm text-ink/80">
                    {event.details}
                  </p>
                ) : null}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
