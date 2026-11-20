import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { PageHero } from '@/components/ui/PageHero'
import { PageTransition } from '@/components/ui/PageTransition'
import { projects } from '@/data/site'

type Project = (typeof projects)[number]

function Frame({
  project,
  position,
  active,
  onEnter,
}: {
  project: Project
  position: [number, number, number]
  active: boolean
  onEnter: () => void
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * (active ? 0.35 : 0.08)
  })

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onClick={(e) => {
          e.stopPropagation()
          onEnter()
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[1.6, 1.1, 0.08]} />
        <meshStandardMaterial
          color={active ? '#176BFF' : '#1a2040'}
          emissive={active ? '#00E5FF' : '#8B5CF6'}
          emissiveIntensity={active ? 0.55 : 0.2}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
      <Text
        position={[0, -0.85, 0.1]}
        fontSize={0.14}
        color="#e8ecff"
        anchorX="center"
        maxWidth={1.8}
      >
        {project.category}
      </Text>
      <Html position={[0, 0.95, 0]} center distanceFactor={8}>
        <button
          type="button"
          onClick={onEnter}
          className={`rounded-md px-2 py-1 text-[10px] tracking-wide uppercase ${
            active ? 'bg-cyan text-void' : 'bg-white/10 text-cyan'
          }`}
        >
          {active ? 'Entrée · E' : 'Approche'}
        </button>
      </Html>
    </group>
  )
}

function GalleryWorld({
  items,
  focus,
  onFocus,
  onEnter,
}: {
  items: Project[]
  focus: number
  onFocus: (i: number) => void
  onEnter: (p: Project) => void
}) {
  const player = useRef<THREE.Group>(null)
  const keys = useRef<Record<string, boolean>>({})

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true
      if (e.key.toLowerCase() === 'e' || e.key === 'Enter') onEnter(items[focus]!)
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
  }, [focus, items, onEnter])

  useFrame((_, dt) => {
    const g = player.current
    if (!g) return
    const speed = 3.2 * dt
    if (keys.current['arrowleft'] || keys.current['a']) g.position.x -= speed
    if (keys.current['arrowright'] || keys.current['d']) g.position.x += speed
    if (keys.current['arrowup'] || keys.current['w']) g.position.z -= speed
    if (keys.current['arrowdown'] || keys.current['s']) g.position.z += speed
    g.position.x = THREE.MathUtils.clamp(g.position.x, -6.5, 6.5)
    g.position.z = THREE.MathUtils.clamp(g.position.z, -1.2, 4.5)

    let best = 0
    let bestD = Infinity
    items.forEach((_, i) => {
      const x = -5 + i * 2.2
      const d = Math.hypot(g.position.x - x, g.position.z - 0)
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    if (best !== focus) onFocus(best)
  })

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 4, 3]} intensity={1.6} color="#00E5FF" />
      <pointLight position={[-4, 2, -2]} intensity={1.1} color="#8B5CF6" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 1.5]}>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color="#080d1c" metalness={0.2} roughness={0.85} />
      </mesh>
      {items.map((p, i) => (
        <Frame
          key={p.id}
          project={p}
          position={[-5 + i * 2.2, 0.3, 0]}
          active={i === focus}
          onEnter={() => onEnter(p)}
        />
      ))}
      <group ref={player} position={[0, 0, 2.8]}>
        <mesh>
          <capsuleGeometry args={[0.18, 0.35, 6, 12]} />
          <meshStandardMaterial color="#00E5FF" emissive="#176BFF" emissiveIntensity={0.5} />
        </mesh>
      </group>
      <OrbitControls enablePan={false} maxPolarAngle={1.35} minDistance={4} maxDistance={12} />
    </>
  )
}

export function Projets() {
  const [focus, setFocus] = useState(0)
  const [selected, setSelected] = useState<Project | null>(null)
  const items = useMemo(() => [...projects], [])

  return (
    <PageTransition>
      <div className="page-pad wrap">
        <PageHero
          eyebrow="Projets · Monde jouable"
          title="Galerie façon tableau (Mario 64)"
          lead="Déplace-toi (ZQSD / WASD ou flèches), approche un cadre lumineux, puis Entrée ou E pour « entrer » dans la fiche technique."
        />

        <div className="relative mb-4 h-[420px] overflow-hidden rounded-3xl border border-cyan/30 md:h-[520px]">
          <Canvas camera={{ position: [0, 3.2, 7.5], fov: 50 }}>
            <GalleryWorld
              items={items}
              focus={focus}
              onFocus={setFocus}
              onEnter={setSelected}
            />
          </Canvas>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-void to-transparent p-4 text-xs text-muted">
            Cadre actif : <span className="text-cyan">{items[focus]?.title}</span> — Entrée / E pour ouvrir
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {items.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setFocus(i)
                setSelected(p)
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs ${
                i === focus ? 'border-cyan/50 text-cyan' : 'border-white/10 text-muted'
              }`}
            >
              {p.category}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selected ? (
            <motion.div
              className="fixed inset-0 z-[60] grid place-items-center bg-void/85 p-4 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-modal
              aria-label={selected.title}
              onClick={() => setSelected(null)}
            >
              <motion.article
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                className="glass relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 md:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-white/15"
                  onClick={() => setSelected(null)}
                  aria-label="Fermer"
                >
                  <X size={16} />
                </button>
                <p className="text-xs tracking-wide text-cyan uppercase">
                  {selected.category} · {selected.date}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold">{selected.title}</h2>
                <p className="mt-4 text-muted">{selected.description}</p>
                <h3 className="mt-6 text-sm font-semibold text-snow">Résumé technique</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selected.technologies.map((t) => (
                    <li
                      key={t}
                      className="rounded-md border border-cyan/30 bg-cyan/10 px-2.5 py-1 text-xs text-cyan"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                {selected.placeholder ? (
                  <p className="mt-4 text-xs text-muted">
                    Placeholder — remplace les détails dans src/data/site.ts.
                  </p>
                ) : null}
              </motion.article>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
