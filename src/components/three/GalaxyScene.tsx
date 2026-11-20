import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { LogoQ3D } from './LogoQ3D'
import { ParticleSystem } from './ParticleSystem'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useWebGLSupport } from '@/hooks/useWebGL'

function Planet({
  position,
  color,
  size,
  speed = 0.2,
}: {
  position: [number, number, number]
  color: string
  size: number
  speed?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed
  })
  return (
    <Float speed={1} rotationIntensity={0.25} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          metalness={0.45}
          roughness={0.4}
        />
      </mesh>
      <mesh position={position} rotation={[Math.PI / 2.6, 0.2, 0]}>
        <torusGeometry args={[size * 1.45, 0.02, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
    </Float>
  )
}

function Nebula() {
  return (
    <>
      <mesh position={[-8, 2, -12]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#176BFF" transparent opacity={0.08} />
      </mesh>
      <mesh position={[9, -3, -14]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.07} />
      </mesh>
      <mesh position={[0, 5, -16]}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.05} />
      </mesh>
    </>
  )
}

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    if (reduced) return
    const cam = state.camera
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, state.pointer.x * 1.2, 0.04)
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, state.pointer.y * 0.7, 0.04)
    cam.lookAt(0, 0, 0)
  })
  return null
}

function Scene({ reduced }: { reduced: boolean }) {
  return (
    <>
      <color attach="background" args={['#03050c']} />
      <fog attach="fog" args={['#03050c', 12, 36]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color="#e8f4ff" />
      <pointLight position={[-4, -2, 3]} intensity={1.4} color="#8B5CF6" />
      <pointLight position={[3, 2, 2]} intensity={1.2} color="#00E5FF" />
      <Stars radius={80} depth={50} count={reduced ? 600 : 2200} factor={3.5} saturation={0} fade speed={0.8} />
      <Nebula />
      <ParticleSystem count={reduced ? 500 : 2200} />
      <Planet position={[-4.2, 1.4, -3]} color="#176BFF" size={0.55} />
      <Planet position={[4.5, -1.6, -4]} color="#8B5CF6" size={0.4} speed={0.35} />
      <Planet position={[-1.8, -2.2, -2]} color="#00E5FF" size={0.22} speed={0.5} />
      <LogoQ3D scale={0.95} position={[2.1, 0.2, 0]} />
      <CameraRig reduced={reduced} />
    </>
  )
}

export function GalaxyScene({ className = '' }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const webgl = useWebGLSupport()

  if (!webgl) {
    return (
      <div
        className={`absolute inset-0 ${className}`}
        style={{
          background:
            'radial-gradient(circle at 30% 40%, rgba(23,107,255,0.25), transparent 45%), radial-gradient(circle at 70% 30%, rgba(139,92,246,0.2), transparent 40%), #03050c',
        }}
        aria-hidden
      />
    )
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 8], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  )
}
