import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import AppLayout from './components/AppLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OnboardingPage from './pages/OnboardingPage'
import GeneratingPage from './pages/GeneratingPage'
import EditorPage from './pages/EditorPage'
import DashboardPage from './pages/DashboardPage'
import PricingPage from './pages/PricingPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-dark-950)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Đang tải...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public routes — Navbar + full page */}
      <Route path="/" element={<><Navbar /><LandingPage /></>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes — AppLayout (sidebar) */}
      <Route path="/onboarding" element={
        <ProtectedRoute><AppLayout><OnboardingPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/pricing" element={
        <ProtectedRoute><AppLayout><PricingPage /></AppLayout></ProtectedRoute>
      } />

      {/* Full-screen protected routes (no sidebar) */}
      <Route path="/generating" element={
        <ProtectedRoute><GeneratingPage /></ProtectedRoute>
      } />
      <Route path="/editor/:id" element={
        <ProtectedRoute><EditorPage /></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
