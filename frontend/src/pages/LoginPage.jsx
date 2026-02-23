import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

export default function LoginPage() {
    const { login } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)
        try {
            await login(form.email, form.password)
            toast.success('Đăng nhập thành công!')
            navigate('/dashboard')
        } catch (err) {
            const data = err.response?.data
            if (data?.errors) setErrors(data.errors)
            else toast.error(data?.message || 'Đăng nhập thất bại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div className="container-sm">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
                        <div style={{ width: '44px', height: '44px', backgroundColor: 'var(--color-primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-on-surface)' }}>Logo Master</span>
                    </Link>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-on-surface)', marginTop: '16px' }}>Đăng nhập</h1>
                    <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', marginTop: '6px' }}>Chào mừng trở lại! Vui lòng đăng nhập.</p>
                </div>

                {/* Form Card */}
                <div className="card-elevated">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', marginBottom: '8px' }}>Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="input-field"
                                placeholder="email@example.com"
                                required
                            />
                            {errors.email && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>{errors.email[0]}</p>}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', marginBottom: '8px' }}>Mật khẩu</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>{errors.password[0]}</p>}
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '4px' }}>
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '24px' }}>
                    Chưa có tài khoản?{' '}
                    <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    )
}
