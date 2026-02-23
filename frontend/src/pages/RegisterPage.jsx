import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { Sparkles } from 'lucide-react'

export default function RegisterPage() {
    const { register } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const handleSubmit = async (e) => {
        e.preventDefault(); setErrors({}); setLoading(true)
        try { await register(form.name, form.email, form.password, form.password_confirmation); toast.success('Đăng ký thành công!'); navigate('/onboarding') }
        catch (err) { const d = err.response?.data; if (d?.errors) setErrors(d.errors); else toast.error(d?.message || 'Đăng ký thất bại.') }
        finally { setLoading(false) }
    }
    const fields = [
        { name: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
        { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Ít nhất 6 ký tự' },
        { name: 'password_confirmation', label: 'Xác nhận mật khẩu', type: 'password', placeholder: 'Nhập lại mật khẩu' },
    ]
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={22} color="#fff" />
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>Logo Master</span>
                    </Link>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, marginTop: '20px' }}>Tạo tài khoản</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '6px' }}>Đăng ký miễn phí để bắt đầu.</p>
                </div>
                <div className="glass-card">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {fields.map(f => (
                            <div key={f.name}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>{f.label}</label>
                                <input type={f.type} value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })} className="glass-input" placeholder={f.placeholder} required />
                                {errors[f.name] && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors[f.name][0]}</p>}
                            </div>
                        ))}
                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '4px' }}>
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                    </form>
                </div>
                <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '24px' }}>
                    Đã có tài khoản? <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
                </p>
            </div>
        </div>
    )
}
