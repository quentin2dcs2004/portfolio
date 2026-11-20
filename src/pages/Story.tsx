import { AnimatePresence, motion } from 'framer-motion'
import { CheckCheck, Send } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { PageTransition } from '@/components/ui/PageTransition'
import { site } from '@/data/site'
import { storyCategories, storyQA, type StoryCategory, type StoryQA } from '@/data/story'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type ChatMsg = { id: string; from: 'me' | 'quentin'; text: string; time: string }

function nowLabel() {
  const d = new Date()
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function Story() {
  const reduced = usePrefersReducedMotion()
  const [category, setCategory] = useState<StoryCategory | 'Toutes'>('Toutes')
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'welcome',
      from: 'quentin',
      text: 'Salut ! Choisis une catégorie puis une question — je réponds comme en MP. (Contacts & fils = exemples illustratifs.)',
      time: nowLabel(),
    },
  ])
  const [typing, setTyping] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => (category === 'Toutes' ? storyQA : storyQA.filter((q) => q.category === category)),
    [category],
  )

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }, [messages, typing, reduced])

  const ask = (qa: StoryQA) => {
    if (typing || pendingId) return
    setPendingId(qa.id)
    const qMsg: ChatMsg = {
      id: `q-${qa.id}-${Date.now()}`,
      from: 'me',
      text: qa.question,
      time: nowLabel(),
    }
    setMessages((m) => [...m, qMsg])
    setTyping(true)

    const delay = reduced ? 200 : 900 + Math.min(qa.answer.length * 8, 1600)
    window.setTimeout(() => {
      setTyping(false)
      setMessages((m) => [
        ...m,
        {
          id: `a-${qa.id}-${Date.now()}`,
          from: 'quentin',
          text: qa.answer,
          time: nowLabel(),
        },
      ])
      setPendingId(null)
    }, delay)
  }

  return (
    <PageTransition>
      <div className="page-pad wrap">
        <PageHero
          eyebrow="Story"
          title="Instagram · Messagerie"
          lead="Interface type Instagram : catégories, questions au choix, réponses préparées (chatbot local, sans backend). Les fils sont des exemples."
        />

        <div className="glass grid min-h-[640px] overflow-hidden rounded-3xl lg:grid-cols-[300px_1fr]">
          {/* Sidebar — Instagram-like */}
          <aside className="flex flex-col border-b border-white/8 lg:border-r lg:border-b-0">
            <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
              <img
                src={site.photo}
                alt=""
                className="h-11 w-11 rounded-full object-cover ring-2 ring-cyan/40"
              />
              <div>
                <p className="text-sm font-semibold">{site.name}</p>
                <p className="text-xs text-muted">Portfolio · MP démo</p>
              </div>
            </div>

            <div className="border-b border-white/8 px-3 py-3">
              <p className="mb-2 text-[10px] tracking-[0.2em] text-cyan uppercase">Catégories</p>
              <div className="flex flex-wrap gap-1.5">
                <CatChip active={category === 'Toutes'} onClick={() => setCategory('Toutes')}>
                  Toutes
                </CatChip>
                {storyCategories.map((c) => (
                  <CatChip key={c} active={category === c} onClick={() => setCategory(c)}>
                    {c}
                  </CatChip>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <p className="px-2 py-1 text-[10px] tracking-wide text-muted uppercase">
                Questions ({filtered.length})
              </p>
              <ul className="space-y-1">
                {filtered.map((qa) => (
                  <li key={qa.id}>
                    <button
                      type="button"
                      disabled={typing}
                      onClick={() => ask(qa)}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-white/8 disabled:opacity-50"
                    >
                      <span className="block text-[10px] text-cyan">{qa.category}</span>
                      <span className="line-clamp-2 text-snow/90">{qa.question}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Chat thread */}
          <section className="flex min-h-[420px] flex-col bg-void/40">
            <header className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
              <img src={site.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold">{site.fullName}</p>
                <p className="text-xs text-muted">Réponses automatiques · démo</p>
              </div>
            </header>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[85%] ${msg.from === 'me' ? 'self-end' : 'self-start'}`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.from === 'me'
                          ? 'rounded-br-md bg-gradient-to-br from-electric to-violet text-white'
                          : 'rounded-bl-md border border-white/10 bg-white/8'
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
                <div className="self-start rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                  </span>
                </div>
              ) : null}
              <div ref={endRef} />
            </div>

            <div className="border-t border-white/8 px-4 py-3">
              <p className="flex items-center gap-2 text-xs text-muted">
                <Send size={14} className="text-cyan" />
                Sélectionne une question à gauche — pas de saisie libre (réponses préparées, RGPD-friendly).
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  )
}

function CatChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] transition ${
        active
          ? 'bg-gradient-to-r from-electric to-violet text-white'
          : 'border border-white/15 text-muted hover:text-snow'
      }`}
    >
      {children}
    </button>
  )
}
