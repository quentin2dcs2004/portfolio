import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { CinematicIntro } from '@/components/intro/CinematicIntro'
import { useIntro } from '@/hooks/useIntro'
import { Home } from '@/pages/Home'
import { Apprendre } from '@/pages/Apprendre'
import { Story } from '@/pages/Story'
import { Projets } from '@/pages/Projets'
import { Portfolio } from '@/pages/Portfolio'
import { Materiel } from '@/pages/Materiel'
import { Parcours } from '@/pages/Parcours'
import { Passions } from '@/pages/Passions'
import { Laboratoire } from '@/pages/Laboratoire'
import { Contact } from '@/pages/Contact'
import '@/lib/animations.css'

export default function App() {
  const { showIntro, completeIntro, skipIntro } = useIntro()

  return (
    <BrowserRouter>
      {showIntro ? (
        <CinematicIntro onComplete={completeIntro} onSkip={skipIntro} />
      ) : null}
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
