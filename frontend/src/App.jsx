import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AppLayout from './components/AppLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OnboardingPage from './pages/OnboardingPage'
import GeneratingPage from './pages/GeneratingPage'
import EditorPage from './pages/EditorPage'
import DashboardPage from './pages/DashboardPage'
import PricingPage from './pages/PricingPage'

function ProtectedRoute({ children, allowFull = false }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (allowFull) return children
  return <AppLayout>{children}</AppLayout>
}

// Public wrapper (so landing/login have the same sidebar)
function PublicRoute({ children }) {
  const { loading } = useAuth()
  if (loading) return <PageLoader />
  return <AppLayout>{children}</AppLayout>
}

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-ocean-bg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '60px', height: '60px', border: '4px solid rgba(235,244,246,0.1)', borderTopColor: 'var(--color-ocean-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--color-ocean-text-muted)', fontSize: '15px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Khởi động...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />

      <Route path="/generating" element={<ProtectedRoute allowFull><GeneratingPage /></ProtectedRoute>} />
      <Route path="/editor/:id" element={<ProtectedRoute allowFull><EditorPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
