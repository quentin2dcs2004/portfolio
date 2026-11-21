import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LogoQ } from '@/components/brand/LogoQ'
import { PageTransition } from '@/components/ui/PageTransition'
import { bookSpreads } from '@/data/site'

export function Portfolio() {
  const [index, setIndex] = useState(0)
  const [anim, setAnim] = useState<'idle' | 'next' | 'prev'>('idle')
  const safeIndex = Math.min(index, bookSpreads.length - 1)
  const spread = bookSpreads[safeIndex] ?? bookSpreads[0]!

  const go = (next: number, dir: 'next' | 'prev') => {
    if (anim !== 'idle' || next < 0 || next >= bookSpreads.length) return
    setAnim(dir)
    window.setTimeout(() => {
      setIndex(next)
      setAnim('idle')
    }, 700)
  }

  const opened = spread.kind === 'spread'

  return (
    <PageTransition>
      <div className="page-pad wrap !pt-24">
        <p className="text-xs tracking-[0.28em] text-cyan uppercase">Livre</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Portfolio ouvert</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          À l’ouverture : double page (photo + texte). Tourne les pages comme un vrai livre.
        </p>

        <div className="mx-auto mt-8 max-w-5xl [perspective:2200px]">
          <div
            className={`book relative min-h-[420px] rounded-md border border-white/10 bg-[#120b1f] p-3 shadow-[0_40px_100px_rgba(88,28,135,0.35)] md:min-h-[480px] md:p-4 ${
              anim === 'next' ? 'flip-next' : anim === 'prev' ? 'flip-prev' : ''
            } ${opened ? 'is-open' : 'is-cover'}`}
          >
            {!opened ? (
              <div className="grid min-h-[380px] place-items-center rounded bg-gradient-to-br from-[#1a1030] to-[#0a0614] text-center md:min-h-[440px]">
                <div>
                  <LogoQ size={80} className="mx-auto" />
                  <h2 className="mt-6 font-display text-3xl font-bold">{spread.title}</h2>
                  <p className="mt-2 tracking-[0.25em] text-cyan uppercase">{spread.subtitle}</p>
                  {index === 0 ? (
                    <button
                      type="button"
                      className="mt-8 rounded-full border border-white/30 px-5 py-2 text-sm"
                      onClick={() => go(1, 'next')}
                    >
                      Ouvrir le livre
                    </button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="grid min-h-[380px] grid-cols-1 gap-3 md:min-h-[440px] md:grid-cols-2 md:gap-0">
                {/* Left page */}
                <article className="relative rounded-l-sm bg-[#f4efe6] p-5 text-[#1a1424] md:rounded-none md:border-r md:border-[#d6cbb8] md:p-7">
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/10 to-transparent" />
                  {spread.left.image ? (
                    <img
                      src={spread.left.image}
                      alt={spread.left.caption ?? ''}
                      className="mb-4 aspect-[4/3] w-full rounded-sm object-cover shadow"
                    />
                  ) : null}
                  <h2 className="font-display text-xl font-bold">{spread.left.title}</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#3a3348]">
                    {spread.left.text}
                  </p>
                  {spread.left.caption ? (
                    <p className="mt-3 text-xs text-[#6b6478] italic">{spread.left.caption}</p>
                  ) : null}
                </article>

                {/* Right page */}
                <article className="relative rounded-r-sm bg-[#f7f2ea] p-5 text-[#1a1424] md:rounded-none md:p-7">
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/10 to-transparent" />
                  {spread.right.image ? (
                    <img
                      src={spread.right.image}
                      alt={spread.right.caption ?? ''}
                      className="mb-4 aspect-[4/3] w-full rounded-sm object-cover shadow"
                    />
                  ) : null}
                  <h2 className="font-display text-xl font-bold">{spread.right.title}</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#3a3348]">
                    {spread.right.text}
                  </p>
                  {spread.right.caption ? (
                    <p className="mt-3 text-xs text-[#6b6478] italic">{spread.right.caption}</p>
                  ) : null}
                </article>
              </div>
            )}

            <div className="page-curl" aria-hidden />
            <p className="mt-2 text-center text-xs text-white/45">
              {index + 1} / {bookSpreads.length}
            </p>
          </div>

          <div className="mt-5 flex justify-between">
            <button
              type="button"
              disabled={index === 0 || anim !== 'idle'}
              onClick={() => go(index - 1, 'prev')}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm disabled:opacity-35"
            >
              <ChevronLeft size={16} /> Page précédente
            </button>
            <button
              type="button"
              disabled={index >= bookSpreads.length - 1 || anim !== 'idle'}
              onClick={() => go(index + 1, 'next')}
              className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm text-cyan disabled:opacity-35"
            >
              Page suivante <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .book { transform-style: preserve-3d; }
        .page-curl {
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(90deg, transparent 55%, rgba(255,255,255,0.08));
          transform-origin: left center;
          opacity: 0;
        }
        .book.flip-next .page-curl { animation: curlNext 0.7s ease-in-out; }
        .book.flip-prev .page-curl { animation: curlPrev 0.7s ease-in-out; }
        @keyframes curlNext {
          0% { opacity: 0.15; transform: rotateY(0); }
          50% { opacity: 0.7; }
          100% { opacity: 0; transform: rotateY(-160deg); }
        }
        @keyframes curlPrev {
          0% { opacity: 0.15; transform: rotateY(-160deg); }
          50% { opacity: 0.7; }
          100% { opacity: 0; transform: rotateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-curl { animation: none !important; }
        }
      `}</style>
    </PageTransition>
  )
}
