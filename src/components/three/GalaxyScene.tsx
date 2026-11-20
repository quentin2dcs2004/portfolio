import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

function Particles({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const mouse = useRef({ x: 0, y: 0 })

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14
    }
    return arr
  }, [count])

  useFrame((state) => {
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, state.pointer.x, 0.05)
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, state.pointer.y, 0.05)
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02 + mouse.current.x * 0.15
      ref.current.rotation.x = mouse.current.y * 0.08
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#00E5FF"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function LogoQ() {
  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
      <mesh position={[2.4, 0.4, -1.2]}>
        <torusGeometry args={[0.55, 0.12, 24, 64]} />
        <meshStandardMaterial
          color="#176BFF"
          emissive="#8B5CF6"
          emissiveIntensity={0.55}
          metalness={0.4}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[2.85, -0.05, -1.05]} rotation={[0, 0, -Math.PI / 4]}>
        <capsuleGeometry args={[0.08, 0.55, 6, 12]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.4} />
      </mesh>
    </Float>
  )
}

function Orbits() {
  const g = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (g.current) g.current.rotation.y = s.clock.elapsedTime * 0.12
  })
  return (
    <group ref={g}>
      <mesh position={[-2.8, 1.1, -2]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[1.6, -1.4, -1.5]}>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color="#176BFF" emissive="#176BFF" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

function SceneContent({ reduced }: { reduced: boolean }) {
  return (
    <>
      <color attach="background" args={['#050509']} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 2]} intensity={1.4} color="#00E5FF" />
      <pointLight position={[-4, -2, -3]} intensity={1.1} color="#8B5CF6" />
      {!reduced && <Stars radius={60} depth={40} count={1800} factor={3} saturation={0} fade speed={0.4} />}
      <Particles count={reduced ? 200 : 900} />
      <LogoQ />
      <Orbits />
    </>
  )
}

export function GalaxyScene() {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 6.2], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent reduced={reduced} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/30 via-transparent to-void" />
    </div>
  )
}
