import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { timeline } from '@/data/site'

export function Parcours() {
  const [openId, setOpenId] = useState<string | null>(timeline[0]?.id ?? null)

  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-20 md:px-6">
      <SectionHeading
        eyebrow="Parcours"
        title="Timeline interactive"
        description="Formations, diplômes et ambitions confirmés. Les étapes non renseignées restent des emplacements modifiables."
      />

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b from-cyan via-electric to-violet md:left-1/2" />
        <ul className="space-y-8">
          {timeline.map((event, i) => {
            const open = openId === event.id
            const left = i % 2 === 0
            return (
              <li
                key={event.id}
                className={`relative md:flex ${left ? 'md:justify-start' : 'md:justify-end'}`}
              >
                <span className="absolute top-6 left-4 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_16px_#00E5FF] md:left-1/2" />
                <motion.button
                  type="button"
                  onClick={() => setOpenId(open ? null : event.id)}
                  className={`glass ml-10 w-[calc(100%-3rem)] rounded-3xl p-5 text-left neon-border md:ml-0 md:w-[calc(50%-2rem)] ${
                    left ? 'md:mr-auto' : 'md:ml-auto'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-xs tracking-widest text-cyan uppercase">
                      {event.year}
                    </span>
                    <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-mist">
                      {event.type}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl text-snow">{event.title}</h3>
                  <p className="mt-2 text-sm text-mist">{event.summary}</p>
                  {!event.verified ? (
                    <p className="mt-2 text-[10px] tracking-wider text-violet uppercase">
                      Emplacement modifiable
                    </p>
                  ) : null}
                  <AnimatePresence>
                    {open ? (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 overflow-hidden border-t border-white/10 pt-4 text-sm leading-relaxed text-snow/85"
                      >
                        {event.details}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </motion.button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
