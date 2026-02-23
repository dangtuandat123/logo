import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faRightToBracket } from '@fortawesome/free-solid-svg-icons'

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
        <div style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
            <div className="animate-slide-up" style={{ width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--color-ocean-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 24px rgba(122,178,178,0.4)' }}>
                        <FontAwesomeIcon icon={faWandMagicSparkles} style={{ color: '#09637E', fontSize: '24px' }} />
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-ocean-text)', letterSpacing: '-0.5px' }}>Đăng nhập</h1>
                    <p style={{ color: 'var(--color-ocean-text-muted)', fontSize: '15px', marginTop: '8px' }}>Trạm kiểm soát không gian sáng tạo</p>
                </div>

                <div className="ocean-card" style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-ocean-text)', marginBottom: '10px' }}>Tài khoản Email</label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="ocean-input" placeholder="commander@space.io" autoFocus required />
                            {errors.email && <p style={{ color: '#fca5a5', fontSize: '13px', marginTop: '8px', fontWeight: 500 }}>{errors.email[0]}</p>}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-ocean-text)', marginBottom: '10px' }}>Khóa bảo mật</label>
                            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="ocean-input" placeholder="••••••••" required />
                            {errors.password && <p style={{ color: '#fca5a5', fontSize: '13px', marginTop: '8px', fontWeight: 500 }}>{errors.password[0]}</p>}
                        </div>
                        <button type="submit" disabled={loading} className="btn-ocean" style={{ width: '100%', padding: '14px', marginTop: '8px', fontSize: '16px' }}>
                            <FontAwesomeIcon icon={faRightToBracket} /> {loading ? 'Đang truy cập...' : 'Truy cập hệ thống'}
                        </button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <p style={{ fontSize: '15px', color: 'var(--color-ocean-text-muted)' }}>
                        Người mới? <Link to="/register" style={{ color: 'var(--color-ocean-primary)', fontWeight: 700, textDecoration: 'none' }}>Gia nhập ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
