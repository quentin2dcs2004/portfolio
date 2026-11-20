import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { PageHero } from '@/components/ui/PageHero'
import { PageTransition } from '@/components/ui/PageTransition'
import { LogoQ } from '@/components/brand/LogoQ'

function Player() {
  const ref = useRef<THREE.Mesh>(null)
  const keys = useRef<Record<string, boolean>>({})
  const [score, setScore] = useState(0)

  useEffect(() => {
    const d = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true
    }
    const u = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false
    }
    window.addEventListener('keydown', d)
    window.addEventListener('keyup', u)
    return () => {
      window.removeEventListener('keydown', d)
      window.removeEventListener('keyup', u)
    }
  }, [])

  useFrame((state, dt) => {
    const m = ref.current
    if (!m) return
    const sp = 4 * dt
    if (keys.current['arrowleft'] || keys.current['a'] || keys.current['q']) m.position.x -= sp
    if (keys.current['arrowright'] || keys.current['d']) m.position.x += sp
    if (keys.current['arrowup'] || keys.current['w'] || keys.current['z']) m.position.z -= sp
    if (keys.current['arrowdown'] || keys.current['s']) m.position.z += sp
    m.position.x = THREE.MathUtils.clamp(m.position.x, -6, 6)
    m.position.z = THREE.MathUtils.clamp(m.position.z, -6, 6)
    m.position.y = 0.35 + Math.sin(state.clock.elapsedTime * 3) * 0.05

    // score pulses near center Q
    const d = m.position.length()
    if (d < 1.4) setScore((s) => s + 1)
  })

  return (
    <>
      <mesh ref={ref} position={[0, 0.35, 3]}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#00E5FF" emissive="#176BFF" emissiveIntensity={0.7} />
      </mesh>
      <HtmlScore score={score} />
    </>
  )
}

function HtmlScore({ score }: { score: number }) {
  // lightweight overlay via DOM portal alternative: parent reads nothing; show in HUD outside
  useEffect(() => {
    const el = document.getElementById('arena-score')
    if (el) el.textContent = String(Math.floor(score / 30))
  }, [score])
  return null
}

function ArenaScene() {
  return (
    <>
      <color attach="background" args={['#050509']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 5, 2]} intensity={1.5} color="#00E5FF" />
      <pointLight position={[-3, 2, -2]} intensity={1.2} color="#8B5CF6" />
      <Stars radius={50} depth={40} count={2000} factor={3} fade speed={0.5} />
      <Float speed={1.2} floatIntensity={0.6}>
        <mesh>
          <torusGeometry args={[1.1, 0.18, 32, 80]} />
          <meshStandardMaterial color="#8B5CF6" emissive="#176BFF" emissiveIntensity={0.9} />
        </mesh>
      </Float>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial color="#0a1024" metalness={0.3} roughness={0.7} />
      </mesh>
      <Player />
    </>
  )
}

export function Arena() {
  return (
    <PageTransition>
      <div className="page-pad wrap">
        <PageHero
          eyebrow="Arène 3D"
          title="Espace de jeu Three.js"
          lead="Mini-arène : déplace le cristal (ZQSD / WASD / flèches) vers le logo Q central pour marquer des points. Expérience ludique adaptée au portfolio."
        />

        <div className="mb-3 flex items-center gap-3 text-sm text-muted">
          <LogoQ size={28} />
          Score proximité Q :{' '}
          <span id="arena-score" className="font-display text-cyan">
            0
          </span>
        </div>

        <div className="h-[420px] overflow-hidden rounded-3xl border border-cyan/35 md:h-[560px]">
          <Canvas camera={{ position: [0, 7, 9], fov: 48 }}>
            <ArenaScene />
          </Canvas>
        </div>
      </div>
    </PageTransition>
  )
}
