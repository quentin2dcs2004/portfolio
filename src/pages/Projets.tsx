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

const THEME_COLORS: Record<Project['roomTheme'], { wall: string; floor: string; glow: string }> = {
  atelier: { wall: '#5a4a68', floor: '#4a3d52', glow: '#FF46A2' },
  studio3d: { wall: '#3a3558', floor: '#2a2744', glow: '#7C5CFF' },
  cyber: { wall: '#1e3a4a', floor: '#152832', glow: '#00F5D4' },
  print: { wall: '#4a4038', floor: '#3a322c', glow: '#FFB020' },
  gallery: { wall: '#4a3550', floor: '#3a2a40', glow: '#FF46A2' },
}

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
      <spotLight position={[0, 7, 4]} angle={0.55} penumbra={0.6} intensity={1.4} color="#fff2d8" />
      <Sparkles count={80} scale={[16, 4, 12]} size={2.5} speed={0.4} opacity={0.55} color="#f5d0a9" />
      <Sparkles count={40} scale={[14, 3, 10]} size={3} speed={0.25} opacity={0.4} color="#00F5D4" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2.5]}>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial color="#4a3d52" roughness={0.45} metalness={0.12} />
      </mesh>
      {[-4, -2, 0, 2, 4].map((x) => (
        <mesh key={`tile${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, 3]}>
          <planeGeometry args={[1.4, 1.4]} />
          <meshStandardMaterial color="#5c4d66" roughness={0.5} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 2.2]}>
        <planeGeometry args={[2.4, 12]} />
        <meshStandardMaterial color="#8b3a4a" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2.2]}>
        <planeGeometry args={[1.6, 11]} />
        <meshStandardMaterial color="#a8485c" roughness={0.9} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.4, 2]}>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#3d3248" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.2, -2.2]}>
        <boxGeometry args={[18, 4.5, 0.35]} />
        <meshStandardMaterial color="#5a4a68" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.55, -2.0]}>
        <boxGeometry args={[17.5, 1.1, 0.12]} />
        <meshStandardMaterial color="#3e3048" roughness={0.6} />
      </mesh>
      <mesh position={[-8.5, 2.2, 2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 4.5, 0.3]} />
        <meshStandardMaterial color="#524260" />
      </mesh>
      <mesh position={[8.5, 2.2, 2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 4.5, 0.3]} />
        <meshStandardMaterial color="#524260" />
      </mesh>

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

      {frames.map((f) => {
        const active = activeId === f.project.id
        return (
          <group key={f.project.id} position={[f.x, 1.45, f.z]}>
            <mesh>
              <boxGeometry args={[1.75, 1.3, 0.14]} />
              <meshStandardMaterial
                color={active ? '#d4a84b' : '#b8923f'}
                metalness={0.55}
                roughness={0.35}
                emissive={active ? f.project.accent : '#5a4010'}
                emissiveIntensity={active ? 0.45 : 0.08}
              />
            </mesh>
            <mesh position={[0, 0, 0.09]}>
              <planeGeometry args={[1.4, 1.0]} />
              <meshStandardMaterial
                color={active ? '#3d5a80' : '#6b5a4a'}
                emissive={active ? f.project.accent : '#2a2018'}
                emissiveIntensity={active ? 0.2 : 0.15}
              />
            </mesh>
            <Text position={[0, -0.9, 0.12]} fontSize={0.13} color="#f8f0e0" anchorX="center">
              {f.project.category}
            </Text>
            {active ? (
              <Float speed={2} floatIntensity={0.3}>
                <Text position={[0, 0.95, 0.2]} fontSize={0.12} color={f.project.accent} anchorX="center">
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

function RoomScene({ project }: { project: Project }) {
  const theme = THEME_COLORS[project.roomTheme]
  const portal = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (portal.current) portal.current.rotation.z = s.clock.elapsedTime * 0.6
  })

  return (
    <>
      <color attach="background" args={[theme.wall]} />
      <fog attach="fog" args={[theme.wall, 8, 18]} />
      <ambientLight intensity={0.95} />
      <hemisphereLight args={['#ffe8c8', theme.floor, 0.45]} />
      <pointLight position={[2, 4, 3]} intensity={2.2} color="#f5d0a9" />
      <pointLight position={[-3, 2, 1]} intensity={1.8} color={theme.glow} />
      <pointLight position={[0, 3, 2]} intensity={1.4} color="#00F5D4" />
      <Sparkles count={80} scale={[10, 4, 8]} size={2.8} speed={0.45} opacity={0.65} color={theme.glow} />

      {/* Walls */}
      <mesh position={[0, 1.6, -3.2]}>
        <boxGeometry args={[11, 4.2, 0.25]} />
        <meshStandardMaterial color={theme.wall} />
      </mesh>
      <mesh position={[-5.2, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[7, 4.2, 0.25]} />
        <meshStandardMaterial color={theme.wall} />
      </mesh>
      <mesh position={[5.2, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[7, 4.2, 0.25]} />
        <meshStandardMaterial color={theme.wall} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color={theme.floor} roughness={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.7, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#2a2035" />
      </mesh>

      {/* Gallery wall frames with accent */}
      {[-2.2, 0, 2.2].map((x, i) => (
        <group key={x} position={[x, 1.7, -3.0]}>
          <mesh>
            <boxGeometry args={[1.5, 1.15, 0.1]} />
            <meshStandardMaterial color="#c9a227" metalness={0.5} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[1.2, 0.9]} />
            <meshStandardMaterial
              color={i === 1 ? project.accent : '#6b5a4a'}
              emissive={project.accent}
              emissiveIntensity={i === 1 ? 0.35 : 0.08}
            />
          </mesh>
        </group>
      ))}

      {/* Pedestal + floating artifact */}
      <mesh position={[0, 0.35, 0.8]}>
        <cylinderGeometry args={[0.55, 0.7, 0.7, 24]} />
        <meshStandardMaterial color="#3a3048" metalness={0.3} />
      </mesh>
      <Float speed={1.5} floatIntensity={0.55}>
        <mesh position={[0, 1.35, 0.8]}>
          <octahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial
            color={project.accent}
            emissive={project.accent}
            emissiveIntensity={0.85}
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Side desk / vitrine */}
      <mesh position={[3.4, 0.5, 0.5]}>
        <boxGeometry args={[1.6, 1, 0.7]} />
        <meshStandardMaterial color="#3a2f45" />
      </mesh>
      <Float speed={1.1} floatIntensity={0.25}>
        <mesh position={[3.4, 1.35, 0.5]}>
          <torusGeometry args={[0.28, 0.06, 12, 32]} />
          <meshStandardMaterial color={project.accent} emissive={project.accent} emissiveIntensity={0.6} />
        </mesh>
      </Float>

      {/* Return portal */}
      <group position={[-3.4, 1.5, 1.2]}>
        <mesh ref={portal}>
          <torusGeometry args={[0.75, 0.07, 16, 48]} />
          <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={1} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.6, 32]} />
          <meshStandardMaterial color="#061820" emissive="#00F5D4" emissiveIntensity={0.35} transparent opacity={0.85} />
        </mesh>
        <Text position={[0, -1.05, 0]} fontSize={0.14} color="#00F5D4" anchorX="center">
          Portail retour
        </Text>
      </group>

      <Text position={[0, 3.15, -2.9]} fontSize={0.28} color="#f8f0e0" anchorX="center">
        {project.category}
      </Text>
    </>
  )
}

function ProjectRoom({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="relative grid h-full lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative min-h-[280px]">
        <Canvas camera={{ position: [0, 2.2, 6.2], fov: 46 }}>
          <RoomScene project={project} />
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
      </div>

      <aside className="overflow-y-auto border-t border-white/10 bg-[#120e1a]/95 p-5 backdrop-blur lg:border-t-0 lg:border-l">
        <p className="text-[10px] tracking-[0.22em] uppercase" style={{ color: project.accent }}>
          {project.category} · {project.date}
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold">{project.title}</h2>
        <p className="mt-2 text-sm text-white/70">{project.summary}</p>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <img src={project.image} alt="" className="aspect-[16/10] w-full object-cover" />
        </div>

        <section className="mt-5">
          <h3 className="font-display text-sm font-semibold text-white">Brief</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-white/60">{project.brief}</p>
        </section>

        <section className="mt-5">
          <h3 className="font-display text-sm font-semibold text-white">Description</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-white/60">{project.description}</p>
        </section>

        <section className="mt-5">
          <h3 className="font-display text-sm font-semibold text-white">Process</h3>
          <ol className="mt-2 space-y-1.5">
            {project.process.map((step, i) => (
              <li key={step} className="flex gap-2 text-sm text-white/65">
                <span className="font-mono text-[11px]" style={{ color: project.accent }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-5">
          <h3 className="font-display text-sm font-semibold text-white">Livrables</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {project.deliverables.map((d) => (
              <li
                key={d}
                className="rounded-full border px-2.5 py-0.5 text-[11px]"
                style={{ borderColor: `${project.accent}55`, color: project.accent }}
              >
                {d}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5">
          <h3 className="font-display text-sm font-semibold text-white">Technos</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <li key={t} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5">
          <h3 className="font-display text-sm font-semibold text-white">Matériel</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {project.materials.map((m) => (
              <li key={m} className="rounded-md border border-white/15 px-2 py-0.5 text-[11px] text-white/55">
                {m}
              </li>
            ))}
          </ul>
        </section>

        {project.gallery.length ? (
          <section className="mt-5 pb-2">
            <h3 className="font-display text-sm font-semibold text-white">Galerie</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {project.gallery.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt=""
                  className="aspect-square rounded-lg object-cover opacity-90"
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        ) : null}

        {project.placeholder ? (
          <p className="mt-4 text-[11px] text-white/35 italic">
            Emplacement prêt — remplace photos / textes dans `src/data/site.ts`.
          </p>
        ) : null}
      </aside>
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
            Hall → cadre → salle complète (brief, process, technos, matériel, galerie). Flèches pour
            marcher, Espace pour entrer, portail pour revenir.
          </p>
        </div>

        <div className="relative mx-auto h-[min(78vh,720px)] w-[min(1180px,calc(100%-1.5rem))] overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
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
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {canEnter && near ? (
                  <button
                    type="button"
                    onClick={() => onEnter(near)}
                    className="rounded-full px-4 py-1.5 text-xs font-semibold text-black"
                    style={{ background: near.accent }}
                  >
                    Entrer · {near.title}
                  </button>
                ) : (
                  <p className="text-sm text-white/60">Explore le manoir · ou ouvre une salle ci-dessous</p>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {items.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onEnter(p)}
                    className="shrink-0 rounded-full border px-3 py-1.5 text-[11px] text-white/85 transition hover:bg-white/10"
                    style={{ borderColor: `${p.accent}66` }}
                  >
                    {p.category}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </PageTransition>
  )
}
