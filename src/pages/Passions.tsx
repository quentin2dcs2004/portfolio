import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import type { Mesh } from 'three'
import { PageTransition } from '@/components/ui/PageTransition'
import { passions } from '@/data/site'

function OrbitRings() {
  const a = useRef<Mesh>(null)
  const b = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.35
    if (b.current) b.current.rotation.z -= dt * 0.22
  })
  return (
    <>
      <color attach="background" args={['#050509']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 3, 2]} intensity={1.2} color="#00F5D4" />
      <pointLight position={[-2, 1, -2]} intensity={0.8} color="#FF46A2" />
      <Stars radius={40} depth={30} count={1200} factor={2.5} fade speed={0.5} />
      <Float speed={1.2} floatIntensity={0.5}>
        <mesh>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.5} metalness={0.4} />
        </mesh>
      </Float>
      <mesh ref={a} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.4, 0.02, 16, 80]} />
        <meshStandardMaterial color="#FF46A2" emissive="#FF46A2" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 3, 0.4, 0]}>
        <torusGeometry args={[1.9, 0.015, 16, 80]} />
        <meshStandardMaterial color="#7C5CFF" emissive="#7C5CFF" emissiveIntensity={0.5} />
      </mesh>
    </>
  )
}

export function Passions() {
  return (
    <PageTransition>
      <div className="relative min-h-[100svh] overflow-hidden pt-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 20% 10%, rgba(255,70,162,0.18), transparent 45%), radial-gradient(ellipse at 80% 60%, rgba(124,92,255,0.14), transparent 40%), #050509',
          }}
        />

        <div className="wrap">
          <p className="text-xs tracking-[0.28em] text-[#FF46A2] uppercase">Centres d’intérêt</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Passions</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/65">
            Photo, 3D, jeux, création — des univers vivants avec images et motion Three.js.
          </p>

          <div className="mt-8 h-[220px] overflow-hidden rounded-3xl border border-white/10 md:h-[280px]">
            <Canvas camera={{ position: [0, 0.5, 4.2], fov: 42 }}>
              <OrbitRings />
            </Canvas>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {passions.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 mix-blend-soft-light opacity-55"
                    style={{ background: `linear-gradient(135deg, ${p.accent}, transparent 60%)` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <span
                    className="absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase"
                    style={{ background: `${p.accent}33`, color: p.accent, border: `1px solid ${p.accent}66` }}
                  >
                    Passion
                  </span>
                  <p className="absolute bottom-4 left-4 font-display text-2xl font-bold">{p.title}</p>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed text-white/60">{p.body}</p>
                  {p.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-white/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
