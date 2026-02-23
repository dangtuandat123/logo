import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { Sparkles, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
    const { login } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault(); setErrors({}); setLoading(true)
        try { await login(form.email, form.password); toast.success('Đăng nhập thành công!'); navigate('/dashboard') }
        catch (err) { const d = err.response?.data; if (d?.errors) setErrors(d.errors); else toast.error(d?.message || 'Đăng nhập thất bại.') }
        finally { setLoading(false) }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            {/* Background glow */}
            <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={22} color="#fff" />
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>Logo Master</span>
                    </Link>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, marginTop: '20px' }}>Đăng nhập</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '6px' }}>Chào mừng trở lại!</p>
                </div>
                <div className="glass-card">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Email</label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="glass-input" placeholder="email@example.com" required />
                            {errors.email && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.email[0]}</p>}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Mật khẩu</label>
                            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="glass-input" placeholder="••••••••" required />
                            {errors.password && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.password[0]}</p>}
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>
                </div>
                <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '24px' }}>
                    Chưa có tài khoản? <Link to="/register" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    )
}
