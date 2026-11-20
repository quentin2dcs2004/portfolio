import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

function seededRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function NebulaParticles({ count = 2200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const mouse = useRef({ x: 0, y: 0 })

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const rnd = seededRng(count * 7919 + 17)
    const cA = new THREE.Color('#00E5FF')
    const cB = new THREE.Color('#176BFF')
    const cC = new THREE.Color('#8B5CF6')
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = 2 + rnd() * 10
      const theta = rnd() * Math.PI * 2
      const y = (rnd() - 0.5) * 7
      pos[i3] = Math.cos(theta) * radius
      pos[i3 + 1] = y
      pos[i3 + 2] = Math.sin(theta) * radius - 2
      const mix = rnd()
      const c = mix < 0.34 ? cA : mix < 0.67 ? cB : cC
      col[i3] = c.r
      col[i3 + 1] = c.g
      col[i3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [count])

  useFrame((state) => {
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, state.pointer.x, 0.06)
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, state.pointer.y, 0.06)
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.045 + mouse.current.x * 0.35
    ref.current.rotation.x = mouse.current.y * 0.18
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.085}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function LogoQ3D({ scale = 1 }: { scale?: number }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.35
    group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.12
  })

  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.85}>
      <group ref={group} scale={scale} position={[0, 0.15, 0]}>
        <mesh>
          <torusGeometry args={[1.05, 0.22, 48, 96]} />
          <meshStandardMaterial
            color="#176BFF"
            emissive="#8B5CF6"
            emissiveIntensity={1.1}
            metalness={0.65}
            roughness={0.18}
          />
        </mesh>
        <mesh position={[0.72, -0.72, 0.05]} rotation={[0, 0, -Math.PI / 4]}>
          <capsuleGeometry args={[0.16, 1.05, 8, 16]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={1.25}
            metalness={0.45}
            roughness={0.2}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.28, 32, 32]} />
          <MeshDistortMaterial
            color="#8B5CF6"
            emissive="#176BFF"
            emissiveIntensity={0.8}
            distort={0.35}
            speed={2.2}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  )
}

function OrbitRings() {
  const g = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (!g.current) return
    g.current.rotation.z = s.clock.elapsedTime * 0.18
    g.current.rotation.y = s.clock.elapsedTime * 0.08
  })

  return (
    <group ref={g}>
      <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[2.35, 0.02, 16, 128]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[1.1, 0.6, 0.4]}>
        <torusGeometry args={[2.9, 0.015, 16, 128]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.4} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 2.35, Math.sin(a) * 0.4, Math.sin(a) * 2.35]}>
            <sphereGeometry args={[0.12 + i * 0.02, 24, 24]} />
            <meshStandardMaterial
              color={i % 2 ? '#00E5FF' : '#8B5CF6'}
              emissive={i % 2 ? '#00E5FF' : '#8B5CF6'}
              emissiveIntensity={0.9}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function CameraRig({ enabled }: { enabled: boolean }) {
  useFrame((state) => {
    if (!enabled) return
    const x = state.pointer.x * 0.55
    const y = state.pointer.y * 0.28
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x, 0.045)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y, 0.045)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function SceneCore({ reduced, mode }: { reduced: boolean; mode: 'hero' | 'ambient' | 'stage' }) {
  const particleCount = reduced ? 400 : mode === 'ambient' ? 900 : 2400
  const showLogo = mode !== 'ambient'
  const logoScale = mode === 'stage' ? 1.15 : 0.85

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[5, 4, 3]} intensity={2.2} color="#00E5FF" />
      <pointLight position={[-5, -2, -2]} intensity={1.8} color="#8B5CF6" />
      <pointLight position={[0, 3, 4]} intensity={1.2} color="#176BFF" />
      {!reduced && (
        <Stars radius={80} depth={50} count={mode === 'ambient' ? 1200 : 2800} factor={4} saturation={0} fade speed={0.6} />
      )}
      <Sparkles
        count={reduced ? 40 : mode === 'ambient' ? 60 : 120}
        scale={[12, 7, 10]}
        size={3}
        speed={0.45}
        opacity={0.7}
        color="#00E5FF"
      />
      <NebulaParticles count={particleCount} />
      {showLogo ? <LogoQ3D scale={logoScale} /> : null}
      {showLogo && !reduced ? <OrbitRings /> : null}
      <CameraRig enabled={!reduced && mode !== 'ambient'} />
    </>
  )
}

type Props = {
  mode?: 'hero' | 'ambient' | 'stage'
  className?: string
}

export function GalaxyScene({ mode = 'hero', className = '' }: Props) {
  const reduced = usePrefersReducedMotion()

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, mode === 'stage' ? 5.2 : 6.4], fov: mode === 'stage' ? 42 : 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <SceneCore reduced={reduced} mode={mode} />
        </Suspense>
      </Canvas>
    </div>
  )
}
