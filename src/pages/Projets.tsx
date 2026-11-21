import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles, Text } from '@react-three/drei'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { ArrowLeft } from 'lucide-react'
import { BlackCat } from '@/components/three/BlackCat'
import { PageTransition } from '@/components/ui/PageTransition'
import { projects } from '@/data/site'

type Project = (typeof projects)[number]
type Mode = 'mansion' | 'room'

function MansionScene({
  items,
  onNear,
  onEnter,
}: {
  items: Project[]
  onNear: (p: Project | null, close: boolean) => void
  onEnter: (p: Project) => void
}) {
  const pos = useRef(new THREE.Vector3(0, 0, 5))
  const facing = useRef(0)
  const walking = useRef(false)
  const keys = useRef<Record<string, boolean>>({})
  const nearId = useRef<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const { camera } = useThree()

  const frames = useMemo(
    () => items.map((p, i) => ({ project: p, x: -5 + i * 2.1, z: -1.2 })),
    [items],
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true
      if (e.code === 'Space') {
        e.preventDefault()
        const hit = frames.find((f) => f.project.id === nearId.current)
        if (hit) onEnter(hit.project)
      }
    }
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [frames, onEnter])

  useFrame((_, dt) => {
    const speed = 3.5 * dt
    let wx = 0
    let wz = 0
    if (keys.current['arrowleft'] || keys.current['a'] || keys.current['q']) wx -= 1
    if (keys.current['arrowright'] || keys.current['d']) wx += 1
    if (keys.current['arrowup'] || keys.current['w'] || keys.current['z']) wz -= 1
    if (keys.current['arrowdown'] || keys.current['s']) wz += 1
    walking.current = wx !== 0 || wz !== 0
    if (walking.current) {
      const len = Math.hypot(wx, wz) || 1
      pos.current.x += (wx / len) * speed
      pos.current.z += (wz / len) * speed
      facing.current = Math.atan2(wx, -wz)
    }
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -7, 7)
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -0.4, 7)

    let best: Project | null = null
    let bestD = Infinity
    for (const f of frames) {
      const d = Math.hypot(pos.current.x - f.x, pos.current.z - f.z)
      if (d < bestD) {
        bestD = d
        best = f.project
      }
    }
    const close = bestD < 1.45
    const nextId = close && best ? best.id : null
    if (nearId.current !== nextId) {
      nearId.current = nextId
      setActiveId(nextId)
      onNear(best, close)
    }

    camera.position.lerp(new THREE.Vector3(pos.current.x, 5.2, pos.current.z + 7.2), 0.07)
    camera.lookAt(pos.current.x, 1.2, pos.current.z - 1.5)
  })

  return (
    <>
      <color attach="background" args={['#2a1f35']} />
      <fog attach="fog" args={['#2a1f35', 14, 32]} />
      <ambientLight intensity={0.85} />
      <hemisphereLight args={['#ffe8c8', '#3a2a4a', 0.55]} />
      <pointLight position={[0, 5.5, 2]} intensity={2.2} color="#ffe0b0" distance={22} />
      <pointLight position={[-4, 3.5, 4]} intensity={1.2} color="#ffd6a0" distance={14} />
      <pointLight position={[4, 3.2, 3]} intensity={1} color="#c4b5fd" distance={14} />
      <spotLight position={[0, 7, 4]} angle={0.55} penumbra={0.6} intensity={1.4} color="#fff2d8" castShadow />
      <Sparkles count={80} scale={[16, 4, 12]} size={2.5} speed={0.4} opacity={0.55} color="#f5d0a9" />
      <Sparkles count={40} scale={[14, 3, 10]} size={3} speed={0.25} opacity={0.4} color="#00F5D4" />

      {/* Floor marble warm */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2.5]} receiveShadow>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial color="#4a3d52" roughness={0.45} metalness={0.12} />
      </mesh>
      {/* Floor inlays */}
      {[-4, -2, 0, 2, 4].map((x) => (
        <mesh key={`tile${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, 3]}>
          <planeGeometry args={[1.4, 1.4]} />
          <meshStandardMaterial color="#5c4d66" roughness={0.5} />
        </mesh>
      ))}
      {/* Carpet runner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 2.2]}>
        <planeGeometry args={[2.4, 12]} />
        <meshStandardMaterial color="#8b3a4a" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2.2]}>
        <planeGeometry args={[1.6, 11]} />
        <meshStandardMaterial color="#a8485c" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.4, 2]}>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#3d3248" roughness={0.9} />
      </mesh>

      {/* Back wall — wallpaper tone */}
      <mesh position={[0, 2.2, -2.2]}>
        <boxGeometry args={[18, 4.5, 0.35]} />
        <meshStandardMaterial color="#5a4a68" roughness={0.75} />
      </mesh>
      {/* Wainscoting */}
      <mesh position={[0, 0.55, -2.0]}>
        <boxGeometry args={[17.5, 1.1, 0.12]} />
        <meshStandardMaterial color="#3e3048" roughness={0.6} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-8.5, 2.2, 2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 4.5, 0.3]} />
        <meshStandardMaterial color="#524260" />
      </mesh>
      <mesh position={[8.5, 2.2, 2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 4.5, 0.3]} />
        <meshStandardMaterial color="#524260" />
      </mesh>

      {/* Windows with warm light */}
      {[-5.5, 0, 5.5].map((x) => (
        <group key={`win${x}`} position={[x, 2.4, -2.0]}>
          <mesh>
            <boxGeometry args={[1.6, 1.8, 0.08]} />
            <meshStandardMaterial color="#2a2035" />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[1.3, 1.5]} />
            <meshStandardMaterial
              color="#f5e6c8"
              emissive="#ffcc88"
              emissiveIntensity={0.55}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>
      ))}

      {/* Chandeliers */}
      {[-3, 0, 3].map((x) => (
        <group key={x} position={[x, 3.85, 1]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
            <meshStandardMaterial color="#c9a227" metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshStandardMaterial color="#ffe6b3" emissive="#ffb703" emissiveIntensity={1.6} />
          </mesh>
          <pointLight position={[0, -0.5, 0]} intensity={0.9} color="#ffe0a0" distance={8} />
        </group>
      ))}

      {/* Columns + bases */}
      {[-6, -2, 2, 6].map((x) => (
        <group key={`c${x}`} position={[x, 0, -1.55]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.22, 0.28, 3, 12]} />
            <meshStandardMaterial color="#7a6a8a" metalness={0.25} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.4, 0.42, 0.24, 12]} />
            <meshStandardMaterial color="#6b5a7a" />
          </mesh>
        </group>
      ))}

      {/* Side consoles / furniture silhouettes */}
      {[-7.2, 7.2].map((x) => (
        <mesh key={`desk${x}`} position={[x, 0.45, 1.5]}>
          <boxGeometry args={[1.2, 0.9, 0.55]} />
          <meshStandardMaterial color="#4a3848" roughness={0.7} />
        </mesh>
      ))}

      {frames.map((f) => {
        const active = activeId === f.project.id
        return (
          <group key={f.project.id} position={[f.x, 1.45, f.z]}>
            {/* ornate gold frame */}
            <mesh>
              <boxGeometry args={[1.75, 1.3, 0.14]} />
              <meshStandardMaterial
                color={active ? '#d4a84b' : '#b8923f'}
                metalness={0.55}
                roughness={0.35}
                emissive={active ? '#00F5D4' : '#5a4010'}
                emissiveIntensity={active ? 0.4 : 0.08}
              />
            </mesh>
            <mesh position={[0, 0, 0.09]}>
              <planeGeometry args={[1.4, 1.0]} />
              <meshStandardMaterial
                color={active ? '#3d5a80' : '#6b5a4a'}
                emissive={active ? '#1b4d6e' : '#2a2018'}
                emissiveIntensity={0.25}
              />
            </mesh>
            <Text position={[0, -0.9, 0.12]} fontSize={0.13} color="#f8f0e0" anchorX="center">
              {f.project.category}
            </Text>
            {active ? (
              <Float speed={2} floatIntensity={0.3}>
                <Text position={[0, 0.95, 0.2]} fontSize={0.12} color="#00F5D4" anchorX="center">
                  Espace · entrer
                </Text>
              </Float>
            ) : null}
          </group>
        )
      })}

      <BlackCat posRef={pos} facingRef={facing} walkingRef={walking} />
    </>
  )
}

function ProjectRoom({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="relative h-full overflow-hidden">
      <Canvas camera={{ position: [0, 2.4, 6.5], fov: 48 }}>
        <color attach="background" args={['#3a2d48']} />
        <ambientLight intensity={0.75} />
        <pointLight position={[2, 4, 3]} intensity={1.8} color="#f5d0a9" />
        <pointLight position={[-3, 2, 1]} intensity={1.2} color="#7C5CFF" />
        <pointLight position={[0, 3, 2]} intensity={1} color="#00F5D4" />
        {/* Room box */}
        <mesh position={[0, 1.5, -2]}>
          <boxGeometry args={[10, 4, 0.3]} />
          <meshStandardMaterial color="#5a4a68" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 10]} />
          <meshStandardMaterial color="#4a3d52" />
        </mesh>
        <mesh position={[-3.2, 1.4, 1]} rotation={[0, 0.4, 0]}>
          <circleGeometry args={[0.55, 32]} />
          <meshStandardMaterial color="#0a2030" emissive="#00F5D4" emissiveIntensity={0.45} />
        </mesh>
        {/* Floating magical book opens */}
        <Float speed={1.4} floatIntensity={0.5}>
          <group position={[0, 1.2, 0]} rotation={[-0.4, 0.25, 0]}>
            <mesh position={[-0.35, 0, 0]}>
              <boxGeometry args={[0.7, 0.1, 0.95]} />
              <meshStandardMaterial color="#4c1d95" emissive="#7c3aed" emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[0.4, 0.15, 0]} rotation={[0, -1.1, 0.35]}>
              <boxGeometry args={[0.7, 0.1, 0.95]} />
              <meshStandardMaterial color="#312e81" emissive="#00F5D4" emissiveIntensity={0.35} />
            </mesh>
          </group>
        </Float>
        {/* Return portal ring */}
        <mesh position={[-3.2, 1.4, 1]} rotation={[0, 0.4, 0]}>
          <torusGeometry args={[0.7, 0.06, 16, 48]} />
          <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.9} />
        </mesh>
      </Canvas>

      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#00F5D4]/50 bg-black/55 px-4 py-2 text-xs text-[#00F5D4] shadow-[0_0_24px_rgba(0,245,212,0.25)] backdrop-blur transition hover:scale-[1.03] hover:bg-black/70"
      >
        <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#00F5D4]/10 to-[#FF46A2]/10" />
        <ArrowLeft size={14} className="relative" />
        <span className="relative">Portail · retour manoir</span>
      </button>

      <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-[#1a1424]/90 p-5 backdrop-blur md:inset-x-auto md:right-4 md:w-[380px]">
        <p className="text-[10px] tracking-wide text-[#00F5D4] uppercase">{project.category}</p>
        <h2 className="mt-1 font-display text-xl font-semibold">{project.title}</h2>
        <p className="mt-2 text-sm text-white/70">{project.description}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.map((t) => (
            <li key={t} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-[#FF46A2]">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Projets() {
  const items = useMemo(() => [...projects], [])
  const [mode, setMode] = useState<Mode>('mansion')
  const [near, setNear] = useState<Project | null>(null)
  const [canEnter, setCanEnter] = useState(false)
  const [entered, setEntered] = useState<Project | null>(null)
  const [transitioning, setTransitioning] = useState(false)

  const onNear = useCallback((p: Project | null, close: boolean) => {
    setNear(p)
    setCanEnter(close)
  }, [])

  const onEnter = useCallback((p: Project) => {
    setTransitioning(true)
    window.setTimeout(() => {
      setEntered(p)
      setMode('room')
      setTransitioning(false)
    }, 550)
  }, [])

  return (
    <PageTransition>
      <div className="page-pad !pt-24">
        <div className="wrap mb-4">
          <p className="text-xs tracking-[0.28em] text-[#FF46A2] uppercase">Projets</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Manoir des cadres</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Visite le hall : flèches pour marcher, place le chat devant un cadre, Espace pour passer
            le portail. Chaque salle raconte un projet.
          </p>
        </div>

        <div className="relative mx-auto h-[min(72vh,640px)] w-[min(1180px,calc(100%-1.5rem))] overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          {mode === 'mansion' ? (
            <Canvas camera={{ position: [0, 5, 10], fov: 48 }}>
              <MansionScene items={items} onNear={onNear} onEnter={onEnter} />
            </Canvas>
          ) : entered ? (
            <ProjectRoom
              project={entered}
              onBack={() => {
                setTransitioning(true)
                window.setTimeout(() => {
                  setMode('mansion')
                  setEntered(null)
                  setTransitioning(false)
                }, 400)
              }}
            />
          ) : null}

          {transitioning ? (
            <div className="absolute inset-0 z-20 grid place-items-center bg-black/70 backdrop-blur-sm">
              <div className="h-16 w-16 animate-spin rounded-full border-2 border-[#00F5D4]/30 border-t-[#FF46A2]" />
            </div>
          ) : null}

          {mode === 'mansion' ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 text-sm">
              {canEnter && near ? (
                <p className="text-[#00F5D4]">
                  Cadre « {near.title} » — appuie sur <kbd className="text-white">Espace</kbd>
                </p>
              ) : (
                <p className="text-white/60">Explore le manoir · trouve les cadres dorés</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </PageTransition>
  )
}
