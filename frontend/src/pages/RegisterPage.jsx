import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faUserPlus } from '@fortawesome/free-solid-svg-icons'

export default function RegisterPage() {
    const { register } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault(); setErrors({}); setLoading(true)
        try {
            await register(form.name, form.email, form.password, form.password_confirmation);
            toast.success('Gia nhập thành công!');
            navigate('/onboarding')
        } catch (err) {
            const d = err.response?.data;
            if (d?.errors) setErrors(d.errors);
            else toast.error(d?.message || 'Đăng ký thất bại.')
        } finally { setLoading(false) }
    }

    const fields = [
        { name: 'name', label: 'Tên định danh', type: 'text', placeholder: 'Leonardo Da Vinci' },
        { name: 'email', label: 'Tài khoản Email', type: 'email', placeholder: 'creator@space.io' },
        { name: 'password', label: 'Khóa bảo mật', type: 'password', placeholder: 'Ít nhất 6 ký tự' },
        { name: 'password_confirmation', label: 'Xác nhận khóa', type: 'password', placeholder: 'Nhập lại khóa' },
    ]

    return (
        <div style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
            <div className="animate-slide-up" style={{ width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--color-ocean-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 24px rgba(122,178,178,0.4)' }}>
                        <FontAwesomeIcon icon={faWandMagicSparkles} style={{ color: '#09637E', fontSize: '24px' }} />
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-ocean-text)', letterSpacing: '-0.5px' }}>Tạo Hồ Sơ</h1>
                    <p style={{ color: 'var(--color-ocean-text-muted)', fontSize: '15px', marginTop: '8px' }}>Khởi đầu hành trình sáng tạo vô hạn</p>
                </div>

                <div className="ocean-card" style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {fields.map(f => (
                            <div key={f.name}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-ocean-text)', marginBottom: '8px' }}>{f.label}</label>
                                <input type={f.type} value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })} className="ocean-input" placeholder={f.placeholder} required />
                                {errors[f.name] && <p style={{ color: '#fca5a5', fontSize: '13px', marginTop: '8px', fontWeight: 500 }}>{errors[f.name][0]}</p>}
                            </div>
                        ))}
                        <button type="submit" disabled={loading} className="btn-ocean" style={{ width: '100%', padding: '14px', marginTop: '12px', fontSize: '16px' }}>
                            <FontAwesomeIcon icon={faUserPlus} /> {loading ? 'Đang tạo hồ sơ...' : 'Xác nhận tạo hồ sơ'}
                        </button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <p style={{ fontSize: '15px', color: 'var(--color-ocean-text-muted)' }}>
                        Đã là thành viên? <Link to="/login" style={{ color: 'var(--color-ocean-primary)', fontWeight: 700, textDecoration: 'none' }}>Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
