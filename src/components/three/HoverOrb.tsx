import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import type { Mesh } from 'three'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

function Orb({ color, reduced }: { color: string; reduced: boolean }) {
  const mesh = useRef<Mesh>(null)
  useFrame((s) => {
    if (!mesh.current || reduced) return
    mesh.current.rotation.y = s.clock.elapsedTime * 0.8
    mesh.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.6) * 0.3
  })
  return (
    <Float speed={2} floatIntensity={1.2}>
      <mesh ref={mesh} scale={1.15}>
        <icosahedronGeometry args={[0.9, 1]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          distort={0.4}
          speed={2}
          roughness={0.2}
        />
      </mesh>
      <mesh scale={1.55}>
        <torusGeometry args={[1.05, 0.03, 12, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
    </Float>
  )
}

/** Tiny animated orb for cards / list accents. */
export function HoverOrb({ color = '#00F5D4', className = '' }: { color?: string; className?: string }) {
  const reduced = usePrefersReducedMotion()
  return (
    <div className={`h-16 w-16 shrink-0 overflow-hidden ${className}`} aria-hidden>
      <Canvas dpr={[1, 1.25]} camera={{ position: [0, 0, 3.2], fov: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[2, 2, 2]} intensity={1.2} color={color} />
          <Orb color={color} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  )
}
