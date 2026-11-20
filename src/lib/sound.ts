/** Subtle cinematic tone via Web Audio — no external file required. */
export function playIntroTone(reducedMotion = false) {
  if (reducedMotion || typeof window === 'undefined') return

  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const now = ctx.currentTime

    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.08, now + 0.15)
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)
    master.connect(ctx.destination)

    const notes = [110, 165, 220]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = i === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, now)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.35 / (i + 1), now + 0.2 + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6)
      osc.connect(gain)
      gain.connect(master)
      osc.start(now)
      osc.stop(now + 1.9)
    })

    window.setTimeout(() => void ctx.close(), 2200)
  } catch {
    // Audio may be blocked — silently ignore
  }
}
