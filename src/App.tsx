import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { NetflixIntro } from '@/components/intro/NetflixIntro'
import { Layout } from '@/components/layout/Layout'
import { useIntroGate } from '@/hooks/useIntroGate'
import { Home } from '@/pages/Home'

const Apprendre = lazy(() => import('@/pages/Apprendre').then((m) => ({ default: m.Apprendre })))
const Story = lazy(() => import('@/pages/Story').then((m) => ({ default: m.Story })))
const Projets = lazy(() => import('@/pages/Projets').then((m) => ({ default: m.Projets })))
const Portfolio = lazy(() => import('@/pages/Portfolio').then((m) => ({ default: m.Portfolio })))
const Materiel = lazy(() => import('@/pages/Materiel').then((m) => ({ default: m.Materiel })))
const Parcours = lazy(() => import('@/pages/Parcours').then((m) => ({ default: m.Parcours })))
const Passions = lazy(() => import('@/pages/Passions').then((m) => ({ default: m.Passions })))
const Laboratoire = lazy(() =>
  import('@/pages/Laboratoire').then((m) => ({ default: m.Laboratoire })),
)
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })))

function PageFallback() {
  return (
    <div className="page-pad wrap">
      <p className="text-muted">Chargement de l’univers…</p>
    </div>
  )
}

export default function App() {
  const { showIntro, finishIntro } = useIntroGate()

  return (
    <BrowserRouter>
      {showIntro ? <NetflixIntro onDone={finishIntro} /> : null}
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="apprendre" element={<Apprendre />} />
            <Route path="story" element={<Story />} />
            <Route path="projets" element={<Projets />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="materiel" element={<Materiel />} />
            <Route path="parcours" element={<Parcours />} />
            <Route path="passions" element={<Passions />} />
            <Route path="laboratoire" element={<Laboratoire />} />
            <Route path="contact" element={<Contact />} />
            <Route path="competences" element={<Navigate to="/apprendre" replace />} />
            <Route path="a-propos" element={<Navigate to="/parcours" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
