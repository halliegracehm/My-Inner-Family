import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Pages
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Journal from './pages/Journal'
import JournalEntry from './pages/JournalEntry'
import Gratitude from './pages/Gratitude'
import Badges from './pages/Badges'
import Family from './pages/Family'

// Shared
import BottomNav from './components/BottomNav'
import Leaves from './components/Leaves'

function AppRoutes() {
  const { user, family, loading } = useAuth()

  if (loading) return (
    <div className="app-shell" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="spinner" />
    </div>
  )

  // Not logged in → Landing or Auth
  if (!user) return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )

  // Logged in but no family → Onboarding
  if (!family) return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="*" element={<Navigate to="/onboarding" />} />
    </Routes>
  )

  // Full app
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/new" element={<JournalEntry />} />
        <Route path="/gratitude" element={<Gratitude />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/family" element={<Family />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-bg" />
        <Leaves />
        <div className="app-shell">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
