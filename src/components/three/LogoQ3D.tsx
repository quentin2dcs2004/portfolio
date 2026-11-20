import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  scale?: number
  interactive?: boolean
  autoRotate?: boolean
  position?: [number, number, number]
}

/** True 3D Q: torus ring + metal tail, neon lighting. */
export function LogoQ3D({
  scale = 1,
  interactive = true,
  autoRotate = true,
  position = [0, 0, 0],
}: Props) {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    if (autoRotate) group.current.rotation.y += delta * 0.35
    if (interactive) {
      const tx = state.pointer.x * 0.45
      const ty = state.pointer.y * 0.3
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -ty, 0.08)
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, tx * 0.25, 0.08)
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, position[0] + tx * 0.4, 0.06)
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, position[1] + ty * 0.3, 0.06)
    }
    if (ring.current) {
      const mat = ring.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.45 + Math.sin(state.clock.elapsedTime * 2) * 0.15
    }
  })

  return (
    <group ref={group} scale={scale} position={position}>
      <mesh ref={ring} castShadow>
        <torusGeometry args={[1.05, 0.22, 48, 96]} />
        <meshStandardMaterial
          color="#176BFF"
          metalness={0.95}
          roughness={0.18}
          emissive="#00E5FF"
          emissiveIntensity={0.5}
          envMapIntensity={1.4}
        />
      </mesh>
      <mesh position={[0.78, -0.78, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <capsuleGeometry args={[0.16, 0.85, 12, 24]} />
        <meshStandardMaterial
          color="#8B5CF6"
          metalness={0.92}
          roughness={0.2}
          emissive="#8B5CF6"
          emissiveIntensity={0.55}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={2}
          metalness={0.4}
          roughness={0.1}
        />
      </mesh>
      <pointLight color="#00E5FF" intensity={1.2} distance={6} />
      <pointLight color="#8B5CF6" intensity={0.8} distance={5} position={[1.2, -1, 1]} />
    </group>
  )
}
