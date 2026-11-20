import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

function InteractiveParticles({ count = 400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const mouse = useRef({ x: 0, y: 0 })

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#176BFF'),
      new THREE.Color('#00E5FF'),
      new THREE.Color('#8B5CF6'),
      new THREE.Color('#F5F5F5'),
    ]
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 18
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 14
      const c = palette[i % palette.length]
      colors[i3] = c.r
      colors[i3 + 1] = c.g
      colors[i3 + 2] = c.b
    }
    return { positions, colors }
  }, [count])

  useFrame((state) => {
    mouse.current.x = state.pointer.x
    mouse.current.y = state.pointer.y
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.03
    ref.current.rotation.x = mouse.current.y * 0.08
    ref.current.rotation.z = mouse.current.x * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  )
}

function Planet({
  position,
  color,
  size = 0.45,
}: {
  position: [number, number, number]
  color: string
  size?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.25
  })
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>
    </Float>
  )
}

function LogoQ3D() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.25
    group.current.position.x = state.pointer.x * 0.35
    group.current.position.y = state.pointer.y * 0.2
  })

  return (
    <group ref={group} position={[2.4, 0.4, 0]}>
      <mesh>
        <torusGeometry args={[0.7, 0.12, 24, 64]} />
        <meshStandardMaterial
          color="#176BFF"
          emissive="#00E5FF"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.55, -0.55, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <capsuleGeometry args={[0.1, 0.55, 8, 16]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.45}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
    </group>
  )
}

function SceneContent({ reduced }: { reduced: boolean }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 2]} intensity={1.4} color="#00E5FF" />
      <pointLight position={[-4, -2, -3]} intensity={1} color="#8B5CF6" />
      <Stars radius={60} depth={40} count={reduced ? 400 : 1200} factor={3} fade speed={0.6} />
      {!reduced ? <InteractiveParticles /> : null}
      <Planet position={[-3.2, 1.2, -2]} color="#176BFF" size={0.5} />
      <Planet position={[3.5, -1.4, -3]} color="#8B5CF6" size={0.35} />
      <Planet position={[-1.5, -1.8, -1]} color="#00E5FF" size={0.25} />
      {!reduced ? <LogoQ3D /> : null}
    </>
  )
}

export function GalaxyScene({ className = '' }: { className?: string }) {
  const reduced = usePrefersReducedMotion()

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  )
}
