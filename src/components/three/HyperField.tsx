import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Stars, Trail } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export type HyperTheme = 'cyan' | 'pink' | 'violet' | 'gold' | 'mixed'

const THEMES: Record<HyperTheme, { a: string; b: string; c: string }> = {
  cyan: { a: '#00F5D4', b: '#4CC9F0', c: '#7C5CFF' },
  pink: { a: '#FF46A2', b: '#00F5D4', c: '#7C5CFF' },
  violet: { a: '#7C5CFF', b: '#00F5D4', c: '#FF46A2' },
  gold: { a: '#FFB020', b: '#00F5D4', c: '#FF46A2' },
  mixed: { a: '#00F5D4', b: '#FF46A2', c: '#7C5CFF' },
}

function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function OrbitingPlanets({
  count,
  theme,
  reduced,
}: {
  count: number
  theme: HyperTheme
  reduced: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const colors = THEMES[theme]
  const items = useMemo(() => {
    const rnd = seeded(count * 97 + 3)
    return Array.from({ length: count }, (_, i) => ({
      r: 1.4 + rnd() * 3.2,
      speed: 0.15 + rnd() * 0.55,
      size: 0.08 + rnd() * 0.18,
      y: (rnd() - 0.5) * 1.6,
      phase: rnd() * Math.PI * 2,
      color: i % 3 === 0 ? colors.a : i % 3 === 1 ? colors.b : colors.c,
      tilt: rnd() * 0.8,
    }))
  }, [count, colors])

  useFrame((state) => {
    if (!group.current || reduced) return
    group.current.children.forEach((child, i) => {
      const it = items[i]
      if (!it) return
      const t = state.clock.elapsedTime * it.speed + it.phase
      child.position.set(Math.cos(t) * it.r, it.y + Math.sin(t * 1.3) * 0.15, Math.sin(t) * it.r)
    })
  })

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i}>
          <sphereGeometry args={[it.size, 16, 16]} />
          <meshStandardMaterial color={it.color} emissive={it.color} emissiveIntensity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

function SpinRings({ theme, reduced }: { theme: HyperTheme; reduced: boolean }) {
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)
  const c = useRef<THREE.Mesh>(null)
  const colors = THEMES[theme]
  useFrame((_, dt) => {
    if (reduced) return
    if (a.current) a.current.rotation.z += dt * 0.35
    if (b.current) {
      b.current.rotation.z -= dt * 0.22
      b.current.rotation.x += dt * 0.08
    }
    if (c.current) {
      c.current.rotation.y += dt * 0.18
      c.current.rotation.z += dt * 0.12
    }
  })
  return (
    <>
      <mesh ref={a} rotation={[Math.PI / 2.3, 0.2, 0]}>
        <torusGeometry args={[2.1, 0.02, 12, 96]} />
        <meshBasicMaterial color={colors.a} transparent opacity={0.65} />
      </mesh>
      <mesh ref={b} rotation={[1.0, 0.5, 0.3]}>
        <torusGeometry args={[2.7, 0.015, 12, 96]} />
        <meshBasicMaterial color={colors.b} transparent opacity={0.45} />
      </mesh>
      <mesh ref={c} rotation={[0.4, 0.9, 0.1]}>
        <torusGeometry args={[3.3, 0.012, 12, 96]} />
        <meshBasicMaterial color={colors.c} transparent opacity={0.35} />
      </mesh>
    </>
  )
}

function CrystalSwarm({ theme, reduced }: { theme: HyperTheme; reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const colors = THEMES[theme]
  const n = reduced ? 6 : 16
  const items = useMemo(() => {
    const rnd = seeded(4242)
    return Array.from({ length: n }, () => ({
      pos: new THREE.Vector3((rnd() - 0.5) * 7, (rnd() - 0.5) * 3.5, (rnd() - 0.5) * 5),
      rot: rnd() * Math.PI,
      speed: 0.3 + rnd() * 0.8,
      scale: 0.12 + rnd() * 0.22,
      color: rnd() > 0.5 ? colors.a : colors.b,
    }))
  }, [n, colors])

  useFrame((state) => {
    if (!group.current || reduced) return
    group.current.children.forEach((child, i) => {
      const it = items[i]
      if (!it) return
      child.rotation.x = state.clock.elapsedTime * it.speed + it.rot
      child.rotation.y = state.clock.elapsedTime * it.speed * 0.7
      child.position.y = it.pos.y + Math.sin(state.clock.elapsedTime * it.speed + i) * 0.25
    })
  })

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} scale={it.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={it.color}
            emissive={it.color}
            emissiveIntensity={0.7}
            metalness={0.4}
            roughness={0.25}
          />
        </mesh>
      ))}
    </group>
  )
}

function DistortCore({ theme }: { theme: HyperTheme }) {
  const colors = THEMES[theme]
  return (
    <Float speed={1.8} floatIntensity={0.9} rotationIntensity={0.4}>
      <mesh>
        <icosahedronGeometry args={[0.75, 1]} />
        <MeshDistortMaterial
          color={colors.a}
          emissive={colors.c}
          emissiveIntensity={0.7}
          distort={0.45}
          speed={2.4}
          roughness={0.15}
          metalness={0.35}
        />
      </mesh>
      <mesh scale={1.35}>
        <icosahedronGeometry args={[0.75, 0]} />
        <meshBasicMaterial color={colors.b} wireframe transparent opacity={0.25} />
      </mesh>
    </Float>
  )
}

function Comet({ theme, reduced }: { theme: HyperTheme; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const colors = THEMES[theme]
  useFrame((state) => {
    if (!ref.current || reduced) return
    const t = state.clock.elapsedTime * 0.55
    ref.current.position.set(Math.cos(t) * 3.8, Math.sin(t * 1.4) * 1.2, Math.sin(t) * 3.8)
  })
  if (reduced) return null
  return (
    <Trail width={0.35} length={8} color={colors.a} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={colors.a} />
      </mesh>
    </Trail>
  )
}

function CameraDrift({ enabled }: { enabled: boolean }) {
  useFrame((state) => {
    if (!enabled) return
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.8, 0.04)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.2 + state.pointer.y * 0.4, 0.04)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function FieldScene({
  theme,
  reduced,
  density,
}: {
  theme: HyperTheme
  reduced: boolean
  density: 'hero' | 'panel' | 'ambient'
}) {
  const colors = THEMES[theme]
  const planets = reduced ? 4 : density === 'hero' ? 14 : density === 'panel' ? 9 : 7
  return (
    <>
      <color attach="background" args={['#050509']} />
      <fog attach="fog" args={['#050509', 8, 22]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[4, 3, 2]} intensity={1.8} color={colors.a} />
      <pointLight position={[-3, 2, -2]} intensity={1.3} color={colors.b} />
      <pointLight position={[0, -2, 3]} intensity={0.9} color={colors.c} />
      {!reduced && (
        <Stars
          radius={60}
          depth={40}
          count={density === 'hero' ? 2500 : 1400}
          factor={3.2}
          fade
          speed={0.7}
        />
      )}
      <Sparkles
        count={reduced ? 20 : density === 'hero' ? 100 : 55}
        scale={[10, 5, 8]}
        size={2.8}
        speed={0.5}
        opacity={0.75}
        color={colors.a}
      />
      <DistortCore theme={theme} />
      <SpinRings theme={theme} reduced={reduced} />
      <OrbitingPlanets count={planets} theme={theme} reduced={reduced} />
      <CrystalSwarm theme={theme} reduced={reduced} />
      <Comet theme={theme} reduced={reduced} />
      <CameraDrift enabled={!reduced && density !== 'ambient'} />
    </>
  )
}

type Props = {
  theme?: HyperTheme
  density?: 'hero' | 'panel' | 'ambient'
  className?: string
  height?: string
}

/** Dense animated Three.js field — drop into any page for heavy motion. */
export function HyperField({
  theme = 'mixed',
  density = 'hero',
  className = '',
  height = 'h-[240px] md:h-[320px]',
}: Props) {
  const reduced = usePrefersReducedMotion()
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 ${height} ${className}`}
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.3, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <FieldScene theme={theme} reduced={reduced} density={density} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-transparent" />
    </div>
  )
}
