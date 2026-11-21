import { AnimatePresence, motion } from 'framer-motion'
import { Check, Info, Phone, Video } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PageTransition } from '@/components/ui/PageTransition'
import { site } from '@/data/site'
import { storyCategories, storyQA, type StoryCategory, type StoryQA } from '@/data/story'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type Msg = {
  id: string
  from: 'them' | 'me'
  text: string
  time: string
}

const THREADS = [
  { id: 'quentin', name: 'Quentin', handle: '@quentin', preview: 'Pose-moi une question…' },
  { id: 'luminart', name: 'Luminart', handle: '@luminart2dcs', preview: 'Univers créatif (exemple)' },
] as const

function clock() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Instagram DM-like chatbot:
 * pick a thread → pick category → tap a suggested question → Quentin replies.
 */
export function Story() {
  const reduced = usePrefersReducedMotion()
  const [threadId, setThreadId] = useState<(typeof THREADS)[number]['id']>('quentin')
  const [category, setCategory] = useState<StoryCategory | 'Tous'>('Tous')
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'hi',
      from: 'them',
      text: 'Salut 👋 Choisis une question en bas — je te réponds comme en MP.',
      time: clock(),
    },
  ])
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => {
    const list = category === 'Tous' ? storyQA : storyQA.filter((q) => q.category === category)
    return list
  }, [category])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }, [messages, typing, reduced])

  const sendQuestion = (qa: StoryQA) => {
    if (typing) return
    setMessages((m) => [
      ...m,
      { id: `q-${qa.id}-${Date.now()}`, from: 'me', text: qa.question, time: clock() },
    ])
    setTyping(true)
    const delay = reduced ? 250 : 850 + Math.min(qa.answer.length * 6, 1400)
    window.setTimeout(() => {
      setTyping(false)
      setMessages((m) => [
        ...m,
        { id: `a-${qa.id}-${Date.now()}`, from: 'them', text: qa.answer, time: clock() },
      ])
    }, delay)
  }

  const active = THREADS.find((t) => t.id === threadId) ?? THREADS[0]

  return (
    <PageTransition>
      <div className="page-pad wrap !pt-24">
        <p className="mb-2 text-center text-xs tracking-[0.25em] text-white/50 uppercase">
          Story · Instagram DM
        </p>
        <h1 className="mb-6 text-center font-display text-3xl font-bold md:text-4xl">Messagerie</h1>

        {/* Phone / IG chrome */}
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_rgba(0,0,0,0.55)] lg:grid-cols-[280px_1fr]">
          {/* Threads */}
          <aside className="border-b border-white/10 lg:border-r lg:border-b-0">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="font-semibold">{site.name}</p>
              <p className="text-xs text-white/45">Messages · exemples</p>
            </div>
            <ul>
              {THREADS.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setThreadId(t.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      threadId === t.id ? 'bg-white/8' : 'hover:bg-white/5'
                    }`}
                  >
                    <img
                      src={site.photo}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{t.name}</span>
                      <span className="block truncate text-xs text-white/45">{t.preview}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="px-4 py-3 text-[11px] leading-relaxed text-white/35">
              Fils fictifs à but illustratif — pas une vraie messagerie Instagram.
            </p>
          </aside>

          {/* Chat */}
          <section className="flex min-h-[560px] flex-col bg-black">
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <img src={site.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold leading-tight">{active.name}</p>
                  <p className="text-[11px] text-white/45">{active.handle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/70" aria-hidden>
                <Phone size={18} />
                <Video size={18} />
                <Info size={18} />
              </div>
            </header>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
              <p className="mb-2 text-center text-[11px] text-white/35">Aujourd’hui</p>
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[78%] ${msg.from === 'me' ? 'self-end' : 'self-start'}`}
                  >
                    <div
                      className={`rounded-[22px] px-3.5 py-2 text-[14px] leading-snug ${
                        msg.from === 'me'
                          ? 'rounded-br-md bg-[#3797f0] text-white'
                          : 'rounded-bl-md bg-[#262626] text-white'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p
                      className={`mt-1 flex items-center gap-1 text-[10px] text-white/35 ${
                        msg.from === 'me' ? 'justify-end' : ''
                      }`}
                    >
                      {msg.time}
                      {msg.from === 'me' ? <Check size={11} className="text-[#3797f0]" /> : null}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {typing ? (
                <div className="self-start rounded-[22px] rounded-bl-md bg-[#262626] px-4 py-3">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50" />
                  </span>
                </div>
              ) : null}
              <div ref={endRef} />
            </div>

            {/* Composer = suggested questions (no free text = controlled answers) */}
            <div className="border-t border-white/10 bg-[#0a0a0a] px-3 py-3">
              <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
                <Chip active={category === 'Tous'} onClick={() => setCategory('Tous')}>
                  Tous
                </Chip>
                {storyCategories.map((c) => (
                  <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {suggestions.map((qa) => (
                  <button
                    key={qa.id}
                    type="button"
                    disabled={typing}
                    onClick={() => sendQuestion(qa)}
                    className="shrink-0 rounded-full border border-[#3797f0]/70 px-3 py-1.5 text-left text-xs text-[#3797f0] transition hover:bg-[#3797f0]/10 disabled:opacity-40"
                  >
                    {qa.question}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-white/30">
                Questions préparées uniquement (pas de saisie libre) — clair pour le RGPD.
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
        active ? 'bg-white text-black' : 'bg-white/10 text-white/70'
      }`}
    >
      {children}
    </button>
  )
}
