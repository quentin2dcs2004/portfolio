import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCheck } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { storyThreads } from '@/data/site'

export function Story() {
  const [activeId, setActiveId] = useState(storyThreads[0]?.id ?? '')
  const [visibleCount, setVisibleCount] = useState(0)
  const [typing, setTyping] = useState(false)

  const active = storyThreads.find((t) => t.id === activeId) ?? storyThreads[0]

  useEffect(() => {
    setVisibleCount(0)
    setTyping(false)
    if (!active) return

    const timers: number[] = []
    active.messages.forEach((_, i) => {
      if (i === 0) {
        timers.push(window.setTimeout(() => setVisibleCount(1), 250))
      } else {
        timers.push(
          window.setTimeout(() => setTyping(true), 250 + i * 900 - 500),
          window.setTimeout(() => {
            setTyping(false)
            setVisibleCount(i + 1)
          }, 250 + i * 900),
        )
      }
    })
    return () => timers.forEach(clearTimeout)
  }, [active])

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-6">
      <SectionHeading
        eyebrow="Story"
        title="Conversation inspirée d’Instagram"
        description="Des échanges fictifs clairement identifiés comme exemples pour découvrir mon univers."
      />

      <div className="glass overflow-hidden rounded-[2rem] border border-white/10 md:grid md:grid-cols-[320px_1fr]">
        <aside className="border-b border-white/10 md:border-r md:border-b-0">
          <div className="border-b border-white/10 px-5 py-4">
            <p className="font-display text-sm tracking-widest text-cyan uppercase">Messages</p>
            <p className="mt-1 text-xs text-mist">Contacts d’exemple</p>
          </div>
          <ul className="max-h-[50vh] overflow-y-auto md:max-h-[70vh]">
            {storyThreads.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(thread.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                    activeId === thread.id ? 'bg-electric/15' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-electric to-violet text-xs font-semibold">
                    {thread.avatar}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-snow">{thread.contact}</span>
                    <span className="block truncate text-xs text-mist">{thread.preview}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex min-h-[60vh] flex-col">
          <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-violet text-xs font-semibold">
              {active?.avatar}
            </span>
            <div>
              <p className="text-sm text-snow">{active?.contact}</p>
              <p className="text-xs text-mist">Exemple · conversation fictive</p>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-6">
            <AnimatePresence initial={false}>
              {active?.messages.slice(0, visibleCount).map((msg, i) => (
                <motion.div
                  key={`${active.id}-${i}`}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                      msg.from === 'me'
                        ? 'rounded-br-md bg-gradient-to-br from-electric to-violet text-snow'
                        : 'rounded-bl-md bg-white/10 text-snow'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`mt-2 flex items-center gap-1 text-[10px] ${
                        msg.from === 'me' ? 'justify-end text-white/70' : 'text-mist'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {msg.from === 'me' ? <CheckCheck size={12} className="text-cyan" /> : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {typing ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-3xl rounded-bl-md bg-white/10 px-4 py-3">
                  <span className="typing-dot h-2 w-2 rounded-full bg-mist" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-mist" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-mist" />
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
