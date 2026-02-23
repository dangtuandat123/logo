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
            if (data?.errors) {
                setErrors(data.errors)
            } else {
                toast.error(data?.message || 'Đăng nhập thất bại.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-surface-dim flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-on-surface">Logo Master</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-on-surface">Đăng nhập</h1>
                    <p className="text-on-surface-variant mt-1">Chào mừng trở lại! Vui lòng đăng nhập.</p>
                </div>

                {/* Form */}
                <div className="bg-surface rounded-3xl border border-outline p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-2">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-full bg-surface-container border border-outline text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/50"
                                placeholder="email@example.com"
                                required
                            />
                            {errors.email && <p className="text-error text-xs mt-1">{errors.email[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-2">Mật khẩu</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-full bg-surface-container border border-outline text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/50"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p className="text-error text-xs mt-1">{errors.password[0]}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-full bg-primary text-on-primary font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-on-surface-variant mt-6">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="text-primary font-medium hover:underline">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    )
}
