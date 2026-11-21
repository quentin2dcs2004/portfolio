import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  /** Avoid R3F reserved prop name `position`. */
  posRef: MutableRefObject<THREE.Vector3>
  facingRef: MutableRefObject<number>
  walkingRef: MutableRefObject<boolean>
}

/** Simple stylized black cat (procedural meshes). */
export function BlackCat({ posRef, facingRef, walkingRef }: Props) {
  const group = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Mesh>(null)
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0a0c',
        roughness: 0.55,
        metalness: 0.05,
        emissive: '#1a1028',
        emissiveIntensity: 0.15,
      }),
    [],
  )
  const eye = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c8ff4a',
        emissive: '#88ff22',
        emissiveIntensity: 0.8,
      }),
    [],
  )

  useFrame((state) => {
    const g = group.current
    const p = posRef.current
    if (!g || !p) return
    g.position.copy(p)
    g.position.y = 0.28 + (walkingRef.current ? Math.sin(state.clock.elapsedTime * 12) * 0.03 : 0)
    g.rotation.y = facingRef.current
    if (tail.current) {
      tail.current.rotation.z =
        Math.sin(state.clock.elapsedTime * (walkingRef.current ? 8 : 2)) * 0.35
    }
  })

  return (
    <group ref={group}>
      <mesh material={mat} position={[0, 0.05, 0]} scale={[0.55, 0.32, 0.28]}>
        <sphereGeometry args={[1, 24, 16]} />
      </mesh>
      <mesh material={mat} position={[0.38, 0.22, 0]} scale={[0.28, 0.26, 0.26]}>
        <sphereGeometry args={[1, 20, 16]} />
      </mesh>
      <mesh material={mat} position={[0.42, 0.48, 0.12]} rotation={[0.2, 0, -0.3]}>
        <coneGeometry args={[0.09, 0.2, 4]} />
      </mesh>
      <mesh material={mat} position={[0.42, 0.48, -0.12]} rotation={[0.2, 0, 0.3]}>
        <coneGeometry args={[0.09, 0.2, 4]} />
      </mesh>
      <mesh material={eye} position={[0.58, 0.26, 0.09]}>
        <sphereGeometry args={[0.035, 12, 12]} />
      </mesh>
      <mesh material={eye} position={[0.58, 0.26, -0.09]}>
        <sphereGeometry args={[0.035, 12, 12]} />
      </mesh>
      <mesh ref={tail} material={mat} position={[-0.45, 0.2, 0]} rotation={[0, 0, 0.8]}>
        <capsuleGeometry args={[0.045, 0.55, 4, 8]} />
      </mesh>
    </group>
  )
}
