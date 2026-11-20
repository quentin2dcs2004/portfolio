import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Competences } from '@/pages/Competences'
import { Projets } from '@/pages/Projets'
import { Parcours } from '@/pages/Parcours'
import { Contact } from '@/pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="competences" element={<Competences />} />
          <Route path="apprendre" element={<Navigate to="/competences" replace />} />
          <Route path="projets" element={<Projets />} />
          <Route path="parcours" element={<Parcours />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
