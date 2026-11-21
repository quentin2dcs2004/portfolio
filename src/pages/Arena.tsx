import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { BlackCat } from '@/components/three/BlackCat'
import { PageTransition } from '@/components/ui/PageTransition'

/**
 * Unique mini-game: "Nebula Whiskers"
 * Steer the black cat through a particle river, collect cyan motes,
 * avoid violet shards. Score + combo. Particular neon/particle style.
 */
function GameWorld({
  onScore,
  onHit,
}: {
  onScore: (n: number) => void
  onHit: () => void
}) {
  const pos = useRef(new THREE.Vector3(0, 0, 4))
  const facing = useRef(Math.PI)
  const walking = useRef(false)
  const keys = useRef<Record<string, boolean>>({})
  const motes = useRef<THREE.Points>(null)
  const hazards = useRef<THREE.Points>(null)
  const scoreRef = useRef(0)

  const motePos = useMemo(() => {
    const a = new Float32Array(90)
    let seed = 1337
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 0xffffffff
    }
    for (let i = 0; i < 30; i++) {
      a[i * 3] = (rnd() - 0.5) * 10
      a[i * 3 + 1] = 0.35
      a[i * 3 + 2] = (rnd() - 0.5) * 10
    }
    return a
  }, [])

  const hazPos = useMemo(() => {
    const a = new Float32Array(36)
    let seed = 4242
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 0xffffffff
    }
    for (let i = 0; i < 12; i++) {
      a[i * 3] = (rnd() - 0.5) * 10
      a[i * 3 + 1] = 0.4
      a[i * 3 + 2] = (rnd() - 0.5) * 10
    }
    return a
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
    let wx = 0
    let wz = 0
    const sp = 4.2 * dt
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
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -5.5, 5.5)
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -5.5, 5.5)

    // drift mote field
    if (motes.current) {
      const arr = motePos
      for (let i = 0; i < 30; i++) {
        arr[i * 3 + 2]! += Math.sin(state.clock.elapsedTime + i) * 0.004
        const dx = pos.current.x - arr[i * 3]!
        const dz = pos.current.z - arr[i * 3 + 2]!
        if (dx * dx + dz * dz < 0.35) {
          arr[i * 3] = ((i * 97) % 100) / 10 - 5
          arr[i * 3 + 2] = ((i * 53) % 100) / 10 - 5
          scoreRef.current += 1
          onScore(scoreRef.current)
        }
      }
      motes.current.geometry.attributes.position!.needsUpdate = true
    }

    if (hazards.current) {
      const arr = hazPos
      for (let i = 0; i < 12; i++) {
        arr[i * 3]! += Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.01
        const dx = pos.current.x - arr[i * 3]!
        const dz = pos.current.z - arr[i * 3 + 2]!
        if (dx * dx + dz * dz < 0.38) {
          arr[i * 3] = ((i * 71) % 100) / 10 - 5
          arr[i * 3 + 2] = ((i * 41) % 100) / 10 - 5
          scoreRef.current = Math.max(0, scoreRef.current - 2)
          onScore(scoreRef.current)
          onHit()
        }
      }
      hazards.current.geometry.attributes.position!.needsUpdate = true
    }

    state.camera.position.lerp(
      new THREE.Vector3(pos.current.x, 7.5, pos.current.z + 7),
      0.06,
    )
    state.camera.lookAt(pos.current.x, 0, pos.current.z)
  })

  return (
    <>
      <color attach="background" args={['#03010a']} />
      <fog attach="fog" args={['#03010a', 8, 22]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 6, 0]} intensity={1.4} color="#00E5FF" />
      <pointLight position={[4, 3, -2]} intensity={1.1} color="#a855f7" />
      <Stars radius={40} depth={30} count={2500} factor={3} fade speed={0.7} />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7.5, 64]} />
        <meshStandardMaterial
          color="#0b0618"
          emissive="#1e1b4b"
          emissiveIntensity={0.25}
          roughness={0.85}
        />
      </mesh>

      <points ref={motes}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[motePos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          color="#00E5FF"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={hazards}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[hazPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          color="#c026d3"
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <BlackCat position={pos} facing={facing} walking={walking} />
    </>
  )
}

export function Arena() {
  const [score, setScore] = useState(0)
  const [flash, setFlash] = useState(false)

  return (
    <PageTransition>
      <div className="page-pad wrap !pt-24">
        <p className="text-xs tracking-[0.28em] text-cyan uppercase">Jeu unique</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Nebula Whiskers</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Guide le chat noir dans une rivière de particules. Attrape les orbes cyan, évite les
          éclats violets. Style néon / nébuleuse — flèches ou ZQSD.
        </p>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="rounded-full border border-cyan/40 px-3 py-1 text-cyan">
            Score {score}
          </span>
          {flash ? <span className="text-fuchsia-300">Ouch — éclat violet</span> : null}
        </div>

        <div
          className={`mt-4 h-[min(70vh,560px)] overflow-hidden rounded-2xl border border-white/15 ${
            flash ? 'ring-2 ring-fuchsia-500/70' : ''
          }`}
        >
          <Canvas camera={{ position: [0, 8, 8], fov: 45 }}>
            <GameWorld
              onScore={setScore}
              onHit={() => {
                setFlash(true)
                window.setTimeout(() => setFlash(false), 350)
              }}
            />
          </Canvas>
        </div>
      </div>
    </PageTransition>
  )
}
