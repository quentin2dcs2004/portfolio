import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleSystem({ count = 2500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const mouse = useRef(new THREE.Vector2())

  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const palette = [
      new THREE.Color('#176BFF'),
      new THREE.Color('#00E5FF'),
      new THREE.Color('#8B5CF6'),
      new THREE.Color('#F4F7FF'),
    ]
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const r = 4 + Math.random() * 18
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55
      positions[i3 + 2] = r * Math.cos(phi)
      const c = palette[i % palette.length]
      colors[i3] = c.r
      colors[i3 + 1] = c.g
      colors[i3 + 2] = c.b
      speeds[i] = 0.15 + Math.random() * 0.45
    }
    return { positions, colors, speeds }
  }, [count])

  useFrame((state) => {
    mouse.current.lerp(state.pointer, 0.08)
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.04 + mouse.current.x * 0.2
    ref.current.rotation.x = mouse.current.y * 0.12
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos.array[i3 + 1] =
        (pos.array[i3 + 1] as number) +
        Math.sin(state.clock.elapsedTime * speeds[i] + i) * 0.0015
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
