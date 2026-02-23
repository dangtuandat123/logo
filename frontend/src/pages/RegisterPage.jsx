import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

export default function RegisterPage() {
    const { register } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)
        try {
            await register(form.name, form.email, form.password, form.password_confirmation)
            toast.success('Đăng ký thành công!')
            navigate('/onboarding')
        } catch (err) {
            const data = err.response?.data
            if (data?.errors) setErrors(data.errors)
            else toast.error(data?.message || 'Đăng ký thất bại.')
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { name: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
        { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Ít nhất 6 ký tự' },
        { name: 'password_confirmation', label: 'Xác nhận mật khẩu', type: 'password', placeholder: 'Nhập lại mật khẩu' },
    ]

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div className="container-sm">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
                        <div style={{ width: '44px', height: '44px', backgroundColor: 'var(--color-primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-on-surface)' }}>Logo Master</span>
                    </Link>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-on-surface)', marginTop: '16px' }}>Tạo tài khoản</h1>
                    <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', marginTop: '6px' }}>Đăng ký miễn phí để bắt đầu.</p>
                </div>

                <div className="card-elevated">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {fields.map(f => (
                            <div key={f.name}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', marginBottom: '8px' }}>{f.label}</label>
                                <input
                                    type={f.type}
                                    value={form[f.name]}
                                    onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                                    className="input-field"
                                    placeholder={f.placeholder}
                                    required
                                />
                                {errors[f.name] && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>{errors[f.name][0]}</p>}
                            </div>
                        ))}
                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '4px' }}>
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '24px' }}>
                    Đã có tài khoản?{' '}
                    <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
                </p>
            </div>
        </div>
    )
}
