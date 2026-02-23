import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OnboardingPage from './pages/OnboardingPage'
import GeneratingPage from './pages/GeneratingPage'
import EditorPage from './pages/EditorPage'
import DashboardPage from './pages/DashboardPage'
import PricingPage from './pages/PricingPage'

// Route bảo vệ — chỉ cho user đã đăng nhập
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Skeleton loader toàn trang
function PageLoader() {
  return (
    <div className="min-h-screen bg-surface-dim flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm font-medium">Đang tải...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<><Navbar /><LandingPage /></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pricing" element={<><Navbar /><PricingPage /></>} />

        {/* Protected routes */}
        <Route path="/onboarding" element={
          <ProtectedRoute><Navbar /><OnboardingPage /></ProtectedRoute>
        } />
        <Route path="/generating" element={
          <ProtectedRoute><GeneratingPage /></ProtectedRoute>
        } />
        <Route path="/editor/:id" element={
          <ProtectedRoute><EditorPage /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><Navbar /><DashboardPage /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
