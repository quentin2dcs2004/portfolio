import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Line, Sparkles, Stars, Text } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type Node = { name: string; level: number; accent: string }

function Graph({ nodes, reduced }: { nodes: Node[]; reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const positions = useMemo(() => {
    return nodes.map((_, i) => {
      const a = (i / Math.max(nodes.length, 1)) * Math.PI * 2
      const r = 2.1 + (i % 3) * 0.35
      return new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 1.3) * 0.55, Math.sin(a) * r)
    })
  }, [nodes])

  const lines = useMemo(() => {
    const segs: [THREE.Vector3, THREE.Vector3][] = []
    for (let i = 0; i < positions.length; i++) {
      const next = positions[(i + 1) % positions.length]
      const hop = positions[(i + 2) % positions.length]
      if (next) segs.push([positions[i]!, next])
      if (hop && i % 2 === 0) segs.push([positions[i]!, hop])
    }
    return segs
  }, [positions])

  useFrame((state) => {
    if (!group.current || reduced) return
    group.current.rotation.y = state.clock.elapsedTime * 0.12
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12
  })

  return (
    <group ref={group}>
      {lines.map((seg, i) => (
        <Line
          key={i}
          points={seg}
          color="#ffffff"
          transparent
          opacity={0.18}
          lineWidth={1}
        />
      ))}
      {nodes.map((n, i) => {
        const p = positions[i]!
        const s = 0.12 + n.level * 0.04
        return (
          <Float key={n.name} speed={1 + i * 0.05} floatIntensity={0.35}>
            <group position={p}>
              <mesh>
                <sphereGeometry args={[s, 20, 20]} />
                <meshStandardMaterial
                  color={n.accent}
                  emissive={n.accent}
                  emissiveIntensity={0.85}
                  metalness={0.3}
                  roughness={0.25}
                />
              </mesh>
              <Text
                position={[0, s + 0.22, 0]}
                fontSize={0.14}
                color="#e8ecff"
                anchorX="center"
                anchorY="bottom"
                maxWidth={1.4}
              >
                {n.name}
              </Text>
            </group>
          </Float>
        )
      })}
      <mesh>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#00F5D4" emissive="#7C5CFF" emissiveIntensity={0.6} wireframe />
      </mesh>
    </group>
  )
}

export function SkillConstellation({
  nodes,
  className = '',
}: {
  nodes: Node[]
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const slice = nodes.slice(0, 12)

  return (
    <div
      className={`relative h-[280px] overflow-hidden rounded-3xl border border-white/10 md:h-[360px] ${className}`}
      aria-hidden
    >
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.2, 7.2], fov: 42 }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#050509']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[3, 4, 2]} intensity={1.5} color="#00F5D4" />
          <pointLight position={[-3, 2, -2]} intensity={1.1} color="#FF46A2" />
          {!reduced && <Stars radius={50} depth={30} count={1600} factor={2.8} fade speed={0.5} />}
          <Sparkles count={reduced ? 20 : 70} scale={8} size={2.5} speed={0.4} color="#7C5CFF" />
          <Graph nodes={slice} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  )
}
