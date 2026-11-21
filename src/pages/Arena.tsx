import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Stars, Text } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { BlackCat } from '@/components/three/BlackCat'
import { PageTransition } from '@/components/ui/PageTransition'

type Orb = { id: number; pos: THREE.Vector3; kind: 'star' | 'shard' }

function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function World({
  onScore,
  onLife,
  paused,
}: {
  onScore: (n: number) => void
  onLife: (n: number) => void
  paused: boolean
}) {
  const pos = useRef(new THREE.Vector3(0, 0.25, 4))
  const facing = useRef(Math.PI)
  const walking = useRef(false)
  const keys = useRef<Record<string, boolean>>({})
  const score = useRef(0)
  const lives = useRef(3)
  const orbs = useRef<Orb[]>([])
  const group = useRef<THREE.Group>(null)

  useMemo(() => {
    const rnd = seeded(90)
    orbs.current = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      kind: i % 4 === 0 ? 'shard' : 'star',
      pos: new THREE.Vector3((rnd() - 0.5) * 12, 0.4, (rnd() - 0.5) * 12),
    }))
  }, [])

  useEffect(() => {
    const d = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true
    }
    const u = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false
    }
    window.addEventListener('keydown', d)
    window.addEventListener('keyup', u)
    return () => {
      window.removeEventListener('keydown', d)
      window.removeEventListener('keyup', u)
    }
  }, [])

  useFrame((state, dt) => {
    if (paused) return
    let wx = 0
    let wz = 0
    const sp = 4.4 * dt
    if (keys.current['arrowleft'] || keys.current['a'] || keys.current['q']) wx -= 1
    if (keys.current['arrowright'] || keys.current['d']) wx += 1
    if (keys.current['arrowup'] || keys.current['w'] || keys.current['z']) wz -= 1
    if (keys.current['arrowdown'] || keys.current['s']) wz += 1
    walking.current = wx !== 0 || wz !== 0
    if (walking.current) {
      const len = Math.hypot(wx, wz) || 1
      pos.current.x += (wx / len) * sp
      pos.current.z += (wz / len) * sp
      facing.current = Math.atan2(wx, -wz)
    }
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -6.5, 6.5)
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -6.5, 6.5)

    // collect / hit
    for (const o of orbs.current) {
      const d = pos.current.distanceTo(o.pos)
      if (d < 0.55) {
        if (o.kind === 'star') {
          score.current += 1
          onScore(score.current)
        } else {
          lives.current = Math.max(0, lives.current - 1)
          onLife(lives.current)
        }
        o.pos.set((Math.sin(state.clock.elapsedTime + o.id) * 5), 0.4, (Math.cos(state.clock.elapsedTime * 0.7 + o.id) * 5))
      } else {
        // gentle drift
        o.pos.x += Math.sin(state.clock.elapsedTime + o.id) * 0.004
        o.pos.z += Math.cos(state.clock.elapsedTime * 0.8 + o.id) * 0.004
      }
    }

    if (group.current) {
      group.current.children.forEach((child, i) => {
        const o = orbs.current[i]
        if (o) child.position.copy(o.pos)
      })
    }

    state.camera.position.lerp(new THREE.Vector3(pos.current.x, 9, pos.current.z + 9), 0.06)
    state.camera.lookAt(pos.current.x, 0, pos.current.z)
  })

  return (
    <>
      <color attach="background" args={['#0b1026']} />
      <fog attach="fog" args={['#0b1026', 14, 34]} />
      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#7dd3fc', '#1e1b4b', 0.4]} />
      <pointLight position={[0, 8, 0]} intensity={2} color="#00F5D4" />
      <pointLight position={[5, 4, -3]} intensity={1.4} color="#FF46A2" />
      <pointLight position={[-4, 3, 4]} intensity={1} color="#a78bfa" />
      <Stars radius={50} depth={40} count={2800} factor={3.2} fade speed={0.75} />
      <Sparkles count={90} scale={[16, 4, 16]} size={3} speed={0.55} opacity={0.7} color="#00F5D4" />
      <Sparkles count={50} scale={[14, 3, 14]} size={2.5} speed={0.4} opacity={0.5} color="#FF46A2" />

      {/* Arena island */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <cylinderGeometry args={[8.2, 8.6, 0.5, 64]} />
        <meshStandardMaterial color="#1a2758" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.24, 0]}>
        <circleGeometry args={[7.8, 64]} />
        <meshStandardMaterial color="#243868" metalness={0.28} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.26, 0]}>
        <ringGeometry args={[5.8, 7.2, 64]} />
        <meshStandardMaterial color="#2f3f7a" emissive="#7C5CFF" emissiveIntensity={0.35} />
      </mesh>
      {/* Center glyph */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.28, 0]}>
        <ringGeometry args={[1.2, 1.45, 48]} />
        <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.5} />
      </mesh>
      {/* Soft walls / banisters */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={`p${i}`} position={[Math.cos(a) * 7.9, 0.7, Math.sin(a) * 7.9]}>
            <boxGeometry args={[0.35, 1.1, 0.35]} />
            <meshStandardMaterial color="#33487a" emissive="#7C5CFF" emissiveIntensity={0.12} />
          </mesh>
        )
      })}

      {/* Landmark crystals */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2
        return (
          <Float key={i} speed={1 + i * 0.2} floatIntensity={0.4}>
            <mesh position={[Math.cos(a) * 5.2, 0.9, Math.sin(a) * 5.2]}>
              <octahedronGeometry args={[0.45, 0]} />
              <meshStandardMaterial
                color={i % 2 ? '#00F5D4' : '#FF46A2'}
                emissive={i % 2 ? '#00F5D4' : '#FF46A2'}
                emissiveIntensity={0.7}
              />
            </mesh>
          </Float>
        )
      })}

      <group ref={group}>
        {orbs.current.map((o) => (
          <mesh key={o.id} position={o.pos}>
            {o.kind === 'star' ? (
              <icosahedronGeometry args={[0.22, 0]} />
            ) : (
              <tetrahedronGeometry args={[0.28, 0]} />
            )}
            <meshStandardMaterial
              color={o.kind === 'star' ? '#00F5D4' : '#c026d3'}
              emissive={o.kind === 'star' ? '#00F5D4' : '#c026d3'}
              emissiveIntensity={0.85}
            />
          </mesh>
        ))}
      </group>

      <Text position={[0, 0.15, -7.2]} fontSize={0.35} color="#e8ecff" anchorX="center">
        NEBULA WHISKERS
      </Text>

      <BlackCat posRef={pos} facingRef={facing} walkingRef={walking} />
    </>
  )
}

export function Arena() {
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(true)
  const won = score >= 12
  const lost = lives <= 0

  return (
    <PageTransition>
      <div className="page-pad wrap !pt-24">
        <p className="text-xs tracking-[0.28em] text-[#00F5D4] uppercase">Jeu complet</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Nebula Whiskers</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Guide le chat noir sur l’île néon. Collecte les cristaux cyan (★), évite les shards violets.
          Objectif : 12 étoiles. Flèches / ZQSD pour bouger.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-[#00F5D4]/40 px-3 py-1 text-[#00F5D4]">
            Score {score} / 12
          </span>
          <span className="rounded-full border border-[#FF46A2]/40 px-3 py-1 text-[#FF46A2]">
            Vies {lives}
          </span>
          {!started ? (
            <button
              type="button"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black"
              onClick={() => {
                setStarted(true)
                setPaused(false)
                setScore(0)
                setLives(3)
              }}
            >
              Démarrer
            </button>
          ) : (
            <button
              type="button"
              className="rounded-full border border-white/25 px-4 py-1.5 text-sm"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? 'Reprendre' : 'Pause'}
            </button>
          )}
        </div>

        <div className="relative mt-4 h-[min(70vh,580px)] overflow-hidden rounded-2xl border border-white/15">
          <Canvas camera={{ position: [0, 10, 10], fov: 45 }}>
            <World
              paused={!started || paused || won || lost}
              onScore={setScore}
              onLife={setLives}
            />
          </Canvas>

          {!started ? (
            <div className="absolute inset-0 grid place-items-center bg-black/55 p-6 text-center backdrop-blur-sm">
              <div className="max-w-md">
                <h2 className="font-display text-2xl font-bold">Mission</h2>
                <ul className="mt-4 space-y-2 text-left text-sm text-white/75">
                  <li>• Cristaux cyan = +1 point</li>
                  <li>• Shards violets = −1 vie</li>
                  <li>• Atteins 12 points avant 0 vie</li>
                  <li>• Repères : 4 cristaux géants sur le bord</li>
                </ul>
                <button
                  type="button"
                  className="mt-6 rounded-full bg-gradient-to-r from-[#00F5D4] to-[#FF46A2] px-6 py-2.5 text-sm font-semibold text-black"
                  onClick={() => {
                    setStarted(true)
                    setPaused(false)
                  }}
                >
                  Lancer la partie
                </button>
              </div>
            </div>
          ) : null}

          {(won || lost) && (
            <div className="absolute inset-0 grid place-items-center bg-black/70 backdrop-blur">
              <div className="text-center">
                <p className="font-display text-3xl font-bold">{won ? 'Victoire' : 'Game over'}</p>
                <p className="mt-2 text-sm text-white/70">Score final : {score}</p>
                <button
                  type="button"
                  className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
                  onClick={() => {
                    setScore(0)
                    setLives(3)
                    setPaused(false)
                    setStarted(true)
                  }}
                >
                  Rejouer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
