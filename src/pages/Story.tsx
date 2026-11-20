import { AnimatePresence, motion } from 'framer-motion'
import { CheckCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { storyThreads } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function Story() {
  const [activeId, setActiveId] = useState<string>(storyThreads[0]?.id ?? 'qui')
  const [visibleCount, setVisibleCount] = useState(0)
  const [typing, setTyping] = useState(false)
  const reduced = usePrefersReducedMotion()
  const active = storyThreads.find((t) => t.id === activeId) ?? storyThreads[0]

  useEffect(() => {
    if (!active) return
    setVisibleCount(0)
    setTyping(false)
    if (reduced) {
      setVisibleCount(active.messages.length)
      return
    }

    let step = 0
    let timer: number
    const run = () => {
      if (step >= active.messages.length) {
        setTyping(false)
        return
      }
      const msg = active.messages[step]
      if (msg?.from === 'me' && step > 0) {
        setTyping(true)
        timer = window.setTimeout(() => {
          setTyping(false)
          setVisibleCount((c) => c + 1)
          step += 1
          timer = window.setTimeout(run, 420)
        }, 700)
      } else {
        setVisibleCount((c) => c + 1)
        step += 1
        timer = window.setTimeout(run, 380)
      }
    }
    timer = window.setTimeout(run, 250)
    return () => window.clearTimeout(timer)
  }, [active, reduced])

  if (!active) return null

  return (
    <div className="page-pad wrap">
      <PageHero
        eyebrow="Story"
        title="Messagerie personnelle"
        lead="Interface inspirée d’Instagram DM. Les contacts sont des exemples fictifs pour découvrir Quentin en questions / réponses."
      />

      <div className="glass grid min-h-[560px] overflow-hidden rounded-3xl lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/8 lg:border-r lg:border-b-0">
          <div className="border-b border-white/8 px-4 py-3">
            <p className="font-display text-sm font-semibold">Conversations</p>
            <p className="text-xs text-muted">Exemples illustratifs</p>
          </div>
          <ul className="max-h-[320px] overflow-y-auto lg:max-h-none">
            {storyThreads.map((thread) => {
              const selected = thread.id === active.id
              return (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(thread.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      selected ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-electric to-violet text-xs font-semibold">
                      {thread.avatar}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{thread.contact}</span>
                        <span className="text-[10px] text-muted">{thread.time}</span>
                      </span>
                      <span className="block truncate text-xs text-muted">{thread.preview}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <section className="flex flex-col bg-void/35">
          <header className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan to-violet text-xs font-semibold text-void">
              {active.avatar}
            </span>
            <div>
              <p className="text-sm font-semibold">{active.contact}</p>
              <p className="text-xs text-muted">Conversation exemple</p>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            <AnimatePresence initial={false}>
              {active.messages.slice(0, visibleCount).map((msg, idx) => (
                <motion.div
                  key={`${active.id}-${idx}`}
                  initial={reduced ? false : { opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`max-w-[85%] ${msg.from === 'me' ? 'self-end' : 'self-start'}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.from === 'me'
                        ? 'rounded-br-md bg-gradient-to-br from-electric to-violet text-white'
                        : 'rounded-bl-md border border-white/10 bg-white/8 text-snow'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p
                    className={`mt-1 flex items-center gap-1 text-[10px] text-muted ${
                      msg.from === 'me' ? 'justify-end' : ''
                    }`}
                  >
                    {msg.time}
                    {msg.from === 'me' ? <CheckCheck size={12} className="text-cyan" /> : null}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {typing ? (
              <div className="self-start rounded-2xl rounded-bl-md border border-white/10 bg-white/8 px-4 py-3">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                </span>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
