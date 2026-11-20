import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHero } from '@/components/ui/PageHero'
import { timeline } from '@/data/site'

export function Parcours() {
  const [openId, setOpenId] = useState<string | null>(timeline[0]?.id ?? null)

  return (
    <div className="page-pad wrap">
      <PageHero
        eyebrow="Parcours"
        title="Timeline interactive"
        lead="Formations, ambitions et emplacements pour expériences. Seules les infos vérifiées sont marquées comme telles."
      />

      <ol className="relative space-y-4 border-l border-cyan/25 pl-6 md:pl-8">
        {timeline.map((item) => {
          const open = openId === item.id
          return (
            <li key={item.id} className="relative">
              <span className="absolute top-4 -left-[1.9rem] h-3 w-3 rounded-full border-2 border-cyan bg-void md:-left-[2.15rem]" />
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                className="glass w-full rounded-2xl p-5 text-left transition hover:border-cyan/40"
                aria-expanded={open}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-electric/15 px-2 py-0.5 text-xs text-cyan">
                    {item.year}
                  </span>
                  {!item.verified ? (
                    <span className="rounded-md border border-white/15 px-2 py-0.5 text-[10px] tracking-wide text-muted uppercase">
                      Emplacement
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-2 font-display text-xl font-semibold">{item.title}</h2>
                <p className="mt-1 text-sm text-muted">{item.summary}</p>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden text-sm text-snow/90"
                    >
                      <span className="mt-3 block border-t border-white/10 pt-3">{item.details}</span>
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
