import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoQ3D } from '@/components/three/LogoQ3D'
import { ParticleSystem } from '@/components/three/ParticleSystem'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useWebGLSupport } from '@/hooks/useWebGL'

function IntroScene({ phase }: { phase: number }) {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <spotLight position={[4, 5, 6]} intensity={2.2} color="#00E5FF" angle={0.5} penumbra={0.6} />
      <spotLight position={[-4, -2, 4]} intensity={1.6} color="#8B5CF6" angle={0.6} penumbra={0.5} />
      {phase >= 1 ? <ParticleSystem count={900} /> : null}
      <LogoQ3D
        scale={phase < 2 ? 0.2 + phase * 0.4 : 1.15}
        autoRotate
        interactive={false}
        position={[0, 0.1, 0]}
      />
    </>
  )
}

export function Intro3D({ onComplete }: { onComplete: () => void }) {
  const reduced = usePrefersReducedMotion()
  const webgl = useWebGLSupport()
  const [phase, setPhase] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (reduced || !webgl) {
      const t = window.setTimeout(onComplete, 700)
      return () => clearTimeout(t)
    }
    const timers = [
      window.setTimeout(() => setPhase(1), 400),
      window.setTimeout(() => setPhase(2), 1400),
      window.setTimeout(() => setPhase(3), 2600),
      window.setTimeout(() => setLeaving(true), 3800),
      window.setTimeout(onComplete, 4600),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete, reduced, webgl])

  const skip = () => onComplete()

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black"
        animate={{ opacity: leaving ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7 }}
      >
        {webgl && !reduced ? (
          <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <IntroScene phase={phase} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-6xl text-gradient">Q</span>
          </div>
        )}

        {phase >= 3 ? (
          <motion.h1
            initial={{ opacity: 0, letterSpacing: '0.8em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            className="pointer-events-none absolute inset-x-0 bottom-[22%] text-center font-display text-2xl text-snow md:text-4xl"
          >
            QUENTIN
          </motion.h1>
        ) : null}

        <button
          type="button"
          onClick={skip}
          className="absolute right-6 bottom-6 rounded-full border border-white/20 px-4 py-2 text-xs tracking-[0.25em] text-mist uppercase hover:text-snow"
        >
          Passer
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
