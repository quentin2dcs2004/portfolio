/** Small decorative animations for the Laboratoire page */

export function CoffeeSteam() {
  return (
    <div className="relative h-24 w-20" aria-hidden>
      <div className="absolute bottom-0 left-1/2 h-10 w-14 -translate-x-1/2 rounded-b-xl border border-white/20 bg-white/10" />
      <div className="absolute bottom-10 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full border border-white/20 bg-white/5" />
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute bottom-14 left-1/2 h-8 w-1 -translate-x-1/2 rounded-full bg-cyan/50"
          style={{
            marginLeft: (i - 1) * 8,
            animation: 'steam 1.6s ease-out infinite',
            animationDelay: `${i * 0.25}s`,
          }}
        />
      ))}
    </div>
  )
}

export function PacManDemo() {
  return (
    <div className="relative flex h-20 items-center gap-3 overflow-hidden" aria-hidden>
      <div
        className="h-10 w-10 rounded-full bg-cyan"
        style={{ animation: 'pacman-chomp 0.45s steps(1) infinite' }}
      />
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-violet"
          style={{ animation: `drive 3s linear infinite`, animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  )
}

export function SubmarineDemo() {
  return (
    <div className="relative h-24 overflow-hidden rounded-2xl bg-night/80" aria-hidden>
      <div
        className="absolute top-8 left-6 h-8 w-16 rounded-full bg-electric/70"
        style={{ animation: 'submarine 3s ease-in-out infinite' }}
      >
        <span className="absolute top-1 right-2 h-3 w-3 rounded-full bg-cyan" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-cyan/20 to-transparent" />
    </div>
  )
}

export function TruckDemo() {
  return (
    <div className="relative h-20 overflow-hidden" aria-hidden>
      <div
        className="absolute top-6 flex items-end gap-1"
        style={{ animation: 'drive 5s linear infinite' }}
      >
        <div className="h-6 w-10 rounded-sm bg-violet" />
        <div className="h-8 w-12 rounded-sm bg-electric" />
        <span className="absolute bottom-0 left-2 h-2.5 w-2.5 rounded-full bg-snow" />
        <span className="absolute right-2 bottom-0 h-2.5 w-2.5 rounded-full bg-snow" />
      </div>
    </div>
  )
}

export function CatDemo() {
  return (
    <div className="flex h-24 items-end justify-center gap-1" aria-hidden>
      <div className="anim-float relative">
        <div className="h-12 w-16 rounded-2xl bg-white/15" />
        <span className="absolute -top-3 left-2 h-4 w-3 rotate-[-20deg] rounded-t-full bg-white/15" />
        <span className="absolute -top-3 right-2 h-4 w-3 rotate-[20deg] rounded-t-full bg-white/15" />
        <span className="absolute top-4 left-4 h-1.5 w-1.5 rounded-full bg-cyan" />
        <span className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-cyan" />
        <div className="absolute -right-6 bottom-2 h-3 w-8 rounded-full bg-white/10" />
      </div>
    </div>
  )
}

export function PortalDemo() {
  return (
    <div className="relative flex h-28 items-center justify-center" aria-hidden>
      <div
        className="h-20 w-20 rounded-full border-2 border-cyan/60"
        style={{
          boxShadow: '0 0 30px rgba(0,229,255,0.35), inset 0 0 30px rgba(139,92,246,0.35)',
          animation: 'portal-spin 8s linear infinite',
        }}
      />
      <div className="absolute h-10 w-10 rounded-full bg-gradient-to-br from-electric to-violet opacity-70 blur-sm" />
    </div>
  )
}

export function LaserDemo() {
  return (
    <div className="relative h-28 overflow-hidden rounded-2xl border border-white/10 bg-void" aria-hidden>
      <div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
        style={{ animation: 'laser-scan 2.4s ease-in-out infinite' }}
      />
      <div className="absolute inset-0 anim-shimmer opacity-30" />
    </div>
  )
}

export function NuancierDemo() {
  const colors = ['#176BFF', '#00E5FF', '#8B5CF6', '#F5F5F5', '#080D1C']
  return (
    <div className="flex h-24 items-end gap-2" aria-hidden>
      {colors.map((c, i) => (
        <div
          key={c}
          className="w-8 rounded-t-lg"
          style={{
            background: c,
            height: `${40 + i * 10}px`,
            animation: `float-y ${3 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}
