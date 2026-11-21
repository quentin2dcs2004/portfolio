import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { PageTransition } from '@/components/ui/PageTransition'
import { site } from '@/data/site'

const HyperField = lazy(() =>
  import('@/components/three/HyperField').then((m) => ({ default: m.HyperField })),
)
import {
  storyCategories,
  storyQA,
  type StoryCategory,
  type StoryPersona,
  type StoryQA,
} from '@/data/story'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type Msg = {
  id: string
  from: 'me' | 'them'
  text: string
  time: string
  typing?: boolean
}

const THREADS: {
  id: StoryPersona
  name: string
  handle: string
  accent: string
  blurb: string
}[] = [
  {
    id: 'quentin',
    name: 'Quentin',
    handle: '@quentin',
    accent: '#00F5D4',
    blurb: 'Parcours, skills, passions…',
  },
  {
    id: 'luminart',
    name: 'Luminart',
    handle: '@luminart2dcs',
    accent: '#FF46A2',
    blurb: 'Univers & projets créatifs',
  },
]

function clock() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

/** Typewriter helper: reveals text char by char into state. */
function useTypewriterReveal(
  full: string | null,
  enabled: boolean,
  onDone: (text: string) => void,
) {
  const [partial, setPartial] = useState('')
  useEffect(() => {
    if (!full || !enabled) return
    setPartial('')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setPartial(full.slice(0, i))
      if (i >= full.length) {
        window.clearInterval(id)
        onDone(full)
      }
    }, 22)
    return () => window.clearInterval(id)
  }, [full, enabled, onDone])
  return partial
}

export function Story() {
  const reduced = usePrefersReducedMotion()
  const [persona, setPersona] = useState<StoryPersona>('quentin')
  const [category, setCategory] = useState<StoryCategory | 'Tous'>('Tous')
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'hi',
      from: 'them',
      text: 'Salut. Choisis une catégorie, puis une question — je tape la réponse.',
      time: clock(),
    },
  ])
  const [busy, setBusy] = useState(false)
  const [typingAnswer, setTypingAnswer] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const catMeta = storyCategories.find((c) => c.id === category)

  const suggestions = useMemo(() => {
    return storyQA.filter((q) => {
      if (q.persona !== persona) return false
      if (category === 'Tous') return true
      return q.category === category
    })
  }, [persona, category])

  const typed = useTypewriterReveal(typingAnswer, !reduced && !!typingAnswer, (text) => {
    setTypingAnswer(null)
    setMessages((m) => [
      ...m.filter((x) => !x.typing),
      { id: `a-${Date.now()}`, from: 'them', text, time: clock() },
    ])
    setBusy(false)
  })

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }, [messages, typed, busy, reduced])

  const ask = (qa: StoryQA) => {
    if (busy) return
    setBusy(true)
    setMessages((m) => [
      ...m,
      { id: `q-${qa.id}-${Date.now()}`, from: 'me', text: qa.question, time: clock() },
    ])
    window.setTimeout(() => {
      if (reduced) {
        setMessages((m) => [
          ...m,
          { id: `a-${Date.now()}`, from: 'them', text: qa.answer, time: clock() },
        ])
        setBusy(false)
      } else {
        setTypingAnswer(qa.answer)
      }
    }, reduced ? 200 : 500)
  }

  const active = THREADS.find((t) => t.id === persona)!

  return (
    <PageTransition>
      <div className="relative min-h-[100svh] overflow-hidden pt-20">
        {/* Immersive GTA VI-ish backdrop */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 10% 20%, rgba(255,70,162,0.35), transparent 55%), radial-gradient(ellipse 70% 45% at 90% 10%, rgba(0,245,212,0.28), transparent 50%), linear-gradient(180deg,#050509,#120818 40%,#050509)',
          }}
        />

        <div className="wrap mb-6 text-center">
          <p className="text-xs tracking-[0.35em] text-[#FF46A2] uppercase">Story immersive</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Messagerie</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/65">
            Ambiance Vice / GTA VI — catégories colorées, questions au tap, réponses tapées en direct.
          </p>
          <Suspense fallback={null}>
            <div className="mx-auto mt-6 max-w-3xl">
              <HyperField theme="pink" density="panel" height="h-[160px] md:h-[200px]" />
            </div>
          </Suspense>
        </div>

        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black/55 shadow-[0_40px_100px_rgba(255,70,162,0.15)] backdrop-blur-xl lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-white/10 lg:border-r lg:border-b-0">
            <div className="border-b border-white/10 px-4 py-4">
              <p className="font-semibold">{site.name}</p>
              <p className="text-xs text-white/45">Choisis un contact</p>
            </div>
            <ul>
              {THREADS.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setPersona(t.id)
                      setCategory('Tous')
                      setMessages([
                        {
                          id: 'switch',
                          from: 'them',
                          text:
                            t.id === 'luminart'
                              ? 'Luminart à l’écoute — questions créatives & projets.'
                              : 'Quentin ici — parcours, skills, passions.',
                          time: clock(),
                        },
                      ])
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      persona === t.id ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <span
                      className="grid h-11 w-11 place-items-center rounded-full text-xs font-bold text-black"
                      style={{ background: t.accent }}
                    >
                      {t.name[0]}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{t.name}</span>
                      <span className="block text-xs text-white/45">{t.blurb}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="flex min-h-[580px] flex-col">
            <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-black"
                style={{ background: active.accent }}
              >
                {active.name[0]}
              </span>
              <div>
                <p className="text-sm font-semibold">{active.name}</p>
                <p className="text-[11px] text-white/45">{active.handle}</p>
              </div>
            </header>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[80%] ${msg.from === 'me' ? 'self-end' : 'self-start'}`}
                  >
                    <div
                      className={`rounded-[22px] px-3.5 py-2 text-[14px] leading-snug ${
                        msg.from === 'me'
                          ? 'rounded-br-md text-black'
                          : 'rounded-bl-md bg-white/10 text-white'
                      }`}
                      style={
                        msg.from === 'me'
                          ? {
                              background: `linear-gradient(135deg, ${catMeta?.color ?? '#00F5D4'}, ${active.accent})`,
                            }
                          : undefined
                      }
                    >
                      {msg.text}
                    </div>
                    <p className={`mt-1 text-[10px] text-white/35 ${msg.from === 'me' ? 'text-right' : ''}`}>
                      {msg.time}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {typingAnswer ? (
                <div className="max-w-[80%] self-start">
                  <div className="rounded-[22px] rounded-bl-md bg-white/10 px-3.5 py-2 text-[14px] text-white">
                    {typed}
                    <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[#00F5D4] align-middle" />
                  </div>
                </div>
              ) : null}
              <div ref={endRef} />
            </div>

            <div className="border-t border-white/10 bg-black/40 px-3 py-3">
              <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
                {storyCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition"
                    style={{
                      background: category === c.id ? c.color : 'rgba(255,255,255,0.08)',
                      color: category === c.id ? '#0a0a0a' : c.color,
                      boxShadow: category === c.id ? `0 0 20px ${c.color}55` : undefined,
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {suggestions.map((qa) => (
                  <button
                    key={qa.id}
                    type="button"
                    disabled={busy}
                    onClick={() => ask(qa)}
                    className="max-w-[240px] shrink-0 rounded-2xl border px-3 py-2 text-left text-xs leading-snug text-white/90 transition hover:bg-white/5 disabled:opacity-40"
                    style={{ borderColor: `${active.accent}66` }}
                  >
                    {qa.question}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  )
}
