import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { APropos } from '@/pages/APropos'
import { Competences } from '@/pages/Competences'
import { Story } from '@/pages/Story'
import { Projets } from '@/pages/Projets'
import { Portfolio } from '@/pages/Portfolio'
import { Materiel } from '@/pages/Materiel'
import { Parcours } from '@/pages/Parcours'
import { Passions } from '@/pages/Passions'
import { Contact } from '@/pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="a-propos" element={<APropos />} />
          <Route path="competences" element={<Competences />} />
          <Route path="story" element={<Story />} />
          <Route path="projets" element={<Projets />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="materiel" element={<Materiel />} />
          <Route path="parcours" element={<Parcours />} />
          <Route path="passions" element={<Passions />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
