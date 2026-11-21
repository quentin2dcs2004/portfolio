import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NetflixIntro } from '@/components/intro/NetflixIntro'
import { IntroProvider, useIntro } from '@/components/intro/IntroContext'
import { CookieBanner } from '@/components/legal/CookieBanner'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'

const Apprendre = lazy(() => import('@/pages/Apprendre').then((m) => ({ default: m.Apprendre })))
const Story = lazy(() => import('@/pages/Story').then((m) => ({ default: m.Story })))
const Projets = lazy(() => import('@/pages/Projets').then((m) => ({ default: m.Projets })))
const Portfolio = lazy(() => import('@/pages/Portfolio').then((m) => ({ default: m.Portfolio })))
const Arena = lazy(() => import('@/pages/Arena').then((m) => ({ default: m.Arena })))
const Materiel = lazy(() => import('@/pages/Materiel').then((m) => ({ default: m.Materiel })))
const Parcours = lazy(() => import('@/pages/Parcours').then((m) => ({ default: m.Parcours })))
const Passions = lazy(() => import('@/pages/Passions').then((m) => ({ default: m.Passions })))
const Laboratoire = lazy(() =>
  import('@/pages/Laboratoire').then((m) => ({ default: m.Laboratoire })),
)
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })))
const LegalPage = lazy(() => import('@/pages/LegalPage').then((m) => ({ default: m.LegalPage })))

function PageFallback() {
  return (
    <div className="page-pad wrap">
      <p className="text-muted">Chargement de l’univers…</p>
    </div>
  )
}

function AppShell() {
  const { showIntro, finishIntro } = useIntro()

  return (
    <>
      {showIntro ? <NetflixIntro onDone={finishIntro} /> : null}
      <CookieBanner />
      <ErrorBoundary label="application">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="apprendre" element={<Apprendre />} />
              <Route path="story" element={<Story />} />
              <Route
                path="projets"
                element={
                  <ErrorBoundary label="projets">
                    <Projets />
                  </ErrorBoundary>
                }
              />
              <Route path="portfolio" element={<Portfolio />} />
              <Route
                path="arena"
                element={
                  <ErrorBoundary label="jeu">
                    <Arena />
                  </ErrorBoundary>
                }
              />
              <Route path="materiel" element={<Materiel />} />
              <Route path="parcours" element={<Parcours />} />
              <Route path="passions" element={<Passions />} />
              <Route path="laboratoire" element={<Laboratoire />} />
              <Route path="contact" element={<Contact />} />
              <Route path="mentions-legales" element={<LegalPage kind="mentions" />} />
              <Route path="confidentialite" element={<LegalPage kind="privacy" />} />
              <Route path="cookies" element={<LegalPage kind="cookies" />} />
              <Route path="competences" element={<Navigate to="/apprendre" replace />} />
              <Route path="a-propos" element={<Navigate to="/parcours" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <IntroProvider>
        <AppShell />
      </IntroProvider>
    </BrowserRouter>
  )
}
