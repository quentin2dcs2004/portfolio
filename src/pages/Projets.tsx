import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { ArrowLeft } from 'lucide-react'
import { BlackCat } from '@/components/three/BlackCat'
import { PageTransition } from '@/components/ui/PageTransition'
import { projects } from '@/data/site'

type Project = (typeof projects)[number]

type Mode = 'gallery' | 'books'

function GalleryScene({
  items,
  onNear,
  onEnter,
}: {
  items: Project[]
  onNear: (p: Project | null, close: boolean) => void
  onEnter: (p: Project) => void
}) {
  const pos = useRef(new THREE.Vector3(0, 0, 3.2))
  const facing = useRef(0)
  const walking = useRef(false)
  const keys = useRef<Record<string, boolean>>({})
  const nearId = useRef<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const { camera } = useThree()

  const frames = useMemo(
    () =>
      items.map((p, i) => ({
        project: p,
        x: -5 + i * 2.15,
        z: -0.2,
      })),
    [items],
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true
      if (e.code === 'Space') {
        e.preventDefault()
        const id = nearId.current
        const hit = frames.find((f) => f.project.id === id)
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
    const speed = 3.4 * dt
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
      facing.current = Math.atan2(wx, wz === 0 && wx === 0 ? 1 : -wz)
    }
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -6.8, 6.8)
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -0.6, 5.2)

    let best: Project | null = null
    let bestD = Infinity
    for (const f of frames) {
      const d = Math.hypot(pos.current.x - f.x, pos.current.z - f.z)
      if (d < bestD) {
        bestD = d
        best = f.project
      }
    }
    const close = bestD < 1.35
    const nextId = close && best ? best.id : null
    if (nearId.current !== nextId) {
      nearId.current = nextId
      setActiveId(nextId)
      onNear(best, close)
    }

    camera.position.lerp(new THREE.Vector3(pos.current.x, 4.2, pos.current.z + 5.5), 0.08)
    camera.lookAt(pos.current.x, 0.4, pos.current.z - 1.2)
  })

  return (
    <>
      <color attach="background" args={['#06040c']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 3]} intensity={1.4} color="#8B5CF6" />
      <pointLight position={[-4, 3, 2]} intensity={1.1} color="#00E5FF" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#10081c" roughness={0.9} />
      </mesh>

      {frames.map((f) => {
        const active = activeId === f.project.id
        return (
          <group key={f.project.id} position={[f.x, 1.05, f.z]}>
            <mesh>
              <boxGeometry args={[1.55, 1.15, 0.1]} />
              <meshStandardMaterial
                color={active ? '#1b2a6b' : '#16122a'}
                emissive={active ? '#00E5FF' : '#4c1d95'}
                emissiveIntensity={active ? 0.65 : 0.22}
              />
            </mesh>
            <Text position={[0, -0.8, 0.1]} fontSize={0.13} color="#e8ecff" anchorX="center">
              {f.project.category}
            </Text>
            {active ? (
              <Text position={[0, 0.85, 0.15]} fontSize={0.11} color="#00E5FF" anchorX="center">
                Espace pour entrer
              </Text>
            ) : null}
          </group>
        )
      })}

      <BlackCat position={pos} facing={facing} walking={walking} />
    </>
  )
}

function MagicBookWorld({
  project,
  all,
  onBack,
}: {
  project: Project
  all: Project[]
  onBack: () => void
}) {
  const [openId, setOpenId] = useState(project.id)
  const open = all.find((p) => p.id === openId) ?? project

  return (
    <div className="relative h-full">
      <Canvas camera={{ position: [0, 2.8, 7], fov: 48 }}>
        <color attach="background" args={['#04020a']} />
        <ambientLight intensity={0.35} />
        <pointLight position={[2, 4, 3]} intensity={1.6} color="#c4b5fd" />
        <pointLight position={[-3, 2, 1]} intensity={1.2} color="#00E5FF" />
        {all.map((p, i) => {
          const x = -4 + i * 1.7
          const isOpen = p.id === openId
          return (
            <Float key={p.id} speed={1 + i * 0.1} floatIntensity={0.5}>
              <group
                position={[x, isOpen ? 1.1 : 0.7, 0]}
                rotation={[isOpen ? -0.35 : -0.15, 0.2, 0]}
                onClick={() => setOpenId(p.id)}
              >
                {/* closed / open book */}
                <mesh position={[-0.18, 0, 0]} rotation={[0, 0.15, 0]}>
                  <boxGeometry args={[0.55, 0.08, 0.75]} />
                  <meshStandardMaterial
                    color="#2a1548"
                    emissive="#7c3aed"
                    emissiveIntensity={isOpen ? 0.7 : 0.25}
                  />
                </mesh>
                <mesh
                  position={[0.18, isOpen ? 0.12 : 0, 0]}
                  rotation={[0, isOpen ? -0.9 : -0.15, isOpen ? 0.4 : 0]}
                >
                  <boxGeometry args={[0.55, 0.08, 0.75]} />
                  <meshStandardMaterial
                    color="#3b1d6e"
                    emissive="#00E5FF"
                    emissiveIntensity={isOpen ? 0.45 : 0.15}
                  />
                </mesh>
                {isOpen ? (
                  <Text position={[0, 0.55, 0.2]} fontSize={0.12} color="#e9d5ff" anchorX="center">
                    {p.title.split('—')[0]?.trim() ?? p.title}
                  </Text>
                ) : null}
              </group>
            </Float>
          )
        })}
      </Canvas>

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs backdrop-blur"
        >
          <ArrowLeft size={14} /> Retour galerie
        </button>
        <p className="text-xs tracking-wide text-violet-200/80 uppercase">Monde des livres magiques</p>
      </div>

      <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-violet-400/30 bg-black/65 p-4 backdrop-blur md:inset-x-auto md:right-4 md:bottom-4 md:w-[360px]">
        <p className="text-[10px] tracking-wide text-cyan uppercase">{open.category}</p>
        <h2 className="mt-1 font-display text-lg font-semibold">{open.title}</h2>
        <p className="mt-2 text-sm text-white/70">{open.description}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {open.technologies.map((t) => (
            <li key={t} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-cyan">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-white/40">Clique un livre pour l’ouvrir.</p>
      </div>
    </div>
  )
}

export function Projets() {
  const items = useMemo(() => [...projects], [])
  const [mode, setMode] = useState<Mode>('gallery')
  const [near, setNear] = useState<Project | null>(null)
  const [canEnter, setCanEnter] = useState(false)
  const [entered, setEntered] = useState<Project | null>(null)

  const onNear = useCallback((p: Project | null, close: boolean) => {
    setNear(p)
    setCanEnter(close)
  }, [])

  const onEnter = useCallback((p: Project) => {
    setEntered(p)
    setMode('books')
  }, [])

  return (
    <PageTransition>
      <div className="page-pad !pt-24">
        <div className="wrap mb-4">
          <p className="text-xs tracking-[0.28em] text-cyan uppercase">Projets</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Le chat noir & les cadres
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Déplace le chat avec les flèches (ou ZQSD / WASD). Place-toi devant un cadre, puis appuie
            sur <strong className="text-snow">Espace</strong> pour entrer dans le monde des livres
            magiques.
          </p>
        </div>

        <div className="relative mx-auto h-[min(70vh,620px)] w-[min(1180px,calc(100%-1.5rem))] overflow-hidden rounded-2xl border border-white/15">
          {mode === 'gallery' ? (
            <>
              <Canvas camera={{ position: [0, 4.2, 8], fov: 48 }}>
                <GalleryScene items={items} onNear={onNear} onEnter={onEnter} />
              </Canvas>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm">
                {canEnter && near ? (
                  <p className="text-cyan">
                    Devant « {near.title} » — appuie sur <kbd className="text-snow">Espace</kbd>
                  </p>
                ) : (
                  <p className="text-white/55">Flèches pour marcher · approche un cadre lumineux</p>
                )}
              </div>
            </>
          ) : entered ? (
            <MagicBookWorld
              project={entered}
              all={items}
              onBack={() => {
                setMode('gallery')
                setEntered(null)
              }}
            />
          ) : null}
        </div>
      </div>
    </PageTransition>
  )
}
