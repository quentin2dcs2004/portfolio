import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { PageTransition } from '@/components/ui/PageTransition'
import { site } from '@/data/site'
import {
  storyCategories,
  storyQA,
  type StoryCategory,
  type StoryPersona,
  type StoryQA,
} from '@/data/story'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const HyperField = lazy(() =>
  import('@/components/three/HyperField').then((m) => ({ default: m.HyperField })),
)

type Msg = {
  id: string
  from: 'me' | 'them'
  text: string
  time: string
  /** Still typing this bubble (cursor visible). */
  live?: boolean
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

/** Type full string into a message id, char by char (Graphiste-style). */
function typeInto(
  full: string,
  speed: number,
  onChar: (partial: string) => void,
  onDone: () => void,
) {
  let i = 0
  let timer = 0
  const tick = () => {
    i += 1
    onChar(full.slice(0, i))
    if (i >= full.length) {
      onDone()
      return
    }
    timer = window.setTimeout(tick, speed)
  }
  timer = window.setTimeout(tick, speed)
  return () => window.clearTimeout(timer)
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
  const [waiting, setWaiting] = useState(false)
  const cancelRef = useRef<(() => void) | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const catMeta = storyCategories.find((c) => c.id === category)
  const active = THREADS.find((t) => t.id === persona)!

  const suggestions = useMemo(() => {
    return storyQA.filter((q) => {
      if (q.persona !== persona) return false
      if (category === 'Tous') return true
      return q.category === category
    })
  }, [persona, category])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }, [messages, waiting, reduced])

  useEffect(() => () => cancelRef.current?.(), [])

  const ask = (qa: StoryQA) => {
    if (busy) return
    cancelRef.current?.()
    setBusy(true)
    setWaiting(false)

    if (reduced) {
      setMessages((m) => [
        ...m,
        { id: `q-${qa.id}-${Date.now()}`, from: 'me', text: qa.question, time: clock() },
        { id: `a-${Date.now()}`, from: 'them', text: qa.answer, time: clock() },
      ])
      setBusy(false)
      return
    }

    const qId = `q-${qa.id}-${Date.now()}`
    setMessages((m) => [...m, { id: qId, from: 'me', text: '', time: clock(), live: true }])

    cancelRef.current = typeInto(
      qa.question,
      40,
      (partial) => {
        setMessages((m) => m.map((msg) => (msg.id === qId ? { ...msg, text: partial } : msg)))
      },
      () => {
        setMessages((m) => m.map((msg) => (msg.id === qId ? { ...msg, live: false } : msg)))
        setWaiting(true)
        const pause = window.setTimeout(() => {
          setWaiting(false)
          const aId = `a-${Date.now()}`
          setMessages((m) => [...m, { id: aId, from: 'them', text: '', time: clock(), live: true }])
          cancelRef.current = typeInto(
            qa.answer,
            26,
            (partial) => {
              setMessages((m) => m.map((msg) => (msg.id === aId ? { ...msg, text: partial } : msg)))
            },
            () => {
              setMessages((m) => m.map((msg) => (msg.id === aId ? { ...msg, live: false } : msg)))
              setBusy(false)
              cancelRef.current = null
            },
          )
        }, 520)
        cancelRef.current = () => window.clearTimeout(pause)
      },
    )
  }

  const switchPersona = (t: (typeof THREADS)[number]) => {
    cancelRef.current?.()
    cancelRef.current = null
    setBusy(false)
    setWaiting(false)
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
  }

  return (
    <PageTransition>
      <div className="relative min-h-[100svh] overflow-hidden pt-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 10% 20%, rgba(255,70,162,0.35), transparent 55%), radial-gradient(ellipse 70% 45% at 90% 10%, rgba(0,245,212,0.28), transparent 50%), linear-gradient(180deg,#050509,#120818 40%,#050509)',
          }}
        />

        <div className="wrap mb-5 text-center">
          <p className="text-xs tracking-[0.35em] text-[#FF46A2] uppercase">Story immersive</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Messagerie</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/65">
            Clique une question — elle s’écrit lettre à lettre, puis la réponse aussi.
          </p>
          <Suspense fallback={null}>
            <div className="mx-auto mt-5 max-w-3xl">
              <HyperField theme="pink" density="panel" height="h-[100px] md:h-[130px]" />
            </div>
          </Suspense>
        </div>

        <div className="mx-auto mb-10 grid max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black/55 shadow-[0_40px_100px_rgba(255,70,162,0.15)] backdrop-blur-xl lg:grid-cols-[260px_1fr]">
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
                    onClick={() => switchPersona(t)}
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

          <section className="flex min-h-[560px] flex-col">
            <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-black"
                style={{ background: active.accent }}
              >
                {active.name[0]}
              </span>
              <div>
                <p className="text-sm font-semibold">{active.name}</p>
                <p className="text-[11px] text-white/45">
                  {active.handle}
                  {busy || waiting ? ' · en train d’écrire…' : ''}
                </p>
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
                      {msg.live ? (
                        <span
                          className={`ml-0.5 inline-block h-4 w-[2px] animate-pulse align-middle ${
                            msg.from === 'me' ? 'bg-black/70' : 'bg-[#00F5D4]'
                          }`}
                        />
                      ) : null}
                    </div>
                    {!msg.live ? (
                      <p className={`mt-1 text-[10px] text-white/35 ${msg.from === 'me' ? 'text-right' : ''}`}>
                        {msg.time}
                      </p>
                    ) : null}
                  </motion.div>
                ))}
              </AnimatePresence>

              {waiting ? (
                <div className="max-w-[80%] self-start">
                  <div className="rounded-[22px] rounded-bl-md bg-white/10 px-4 py-3">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00F5D4]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00F5D4] [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00F5D4] [animation-delay:240ms]" />
                    </span>
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
