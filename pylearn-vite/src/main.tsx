import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CoursePage from './pages/CoursePage'
import ProUpgradeModal from './components/modals/ProUpgradeModal'
import AuthModal from './components/modals/AuthModal'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:courseSlug" element={<CoursePage />} />
      </Routes>
      <ProUpgradeModal />
      <AuthModal />
    </BrowserRouter>
  </React.StrictMode>,
)
