import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { storyThreads } from '@/data/site'

export function Story() {
  const [active, setActive] = useState(0)
  const thread = storyThreads[active]

  return (
    <div className="wrap pt-28 pb-24">
      <p className="font-display text-xs tracking-[0.4em] text-cyan uppercase">Story</p>
      <h1 className="font-display mt-4 text-4xl md:text-6xl">Conversations</h1>
      <p className="mt-4 max-w-2xl text-mist">
        Une série de questions/réponses fictives (exemples) pour découvrir mon univers.
      </p>
      <div className="mt-14 grid gap-10 lg:grid-cols-[280px_1fr]">
        <ul className="space-y-2">
          {storyThreads.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                  active === i ? 'bg-electric/20 text-cyan' : 'text-mist hover:text-snow'
                }`}
              >
                {t.contact}
              </button>
            </li>
          ))}
        </ul>
        <AnimatePresence mode="wait">
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-[2rem] border border-white/10 bg-space/50 p-6 md:p-10"
          >
            <p className="text-xs tracking-[0.25em] text-mist uppercase">Exemple · conversation</p>
            <div className="mt-8 space-y-6">
              <div className="max-w-[85%] rounded-3xl rounded-bl-md bg-white/10 px-5 py-4">
                <p>{thread.q}</p>
              </div>
              <div className="ml-auto max-w-[85%] rounded-3xl rounded-br-md bg-gradient-to-br from-electric to-violet px-5 py-4">
                <p>{thread.a}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
