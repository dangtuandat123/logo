import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <nav style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-on-surface)' }}>Logo Master</span>
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
                    {user ? (
                        <>
                            <Link to="/onboarding" className="btn-tonal" style={{ padding: '8px 20px', fontSize: '13px' }}>✨ Tạo Logo</Link>
                            <Link to="/dashboard" style={{ padding: '8px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500, color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}>Dashboard</Link>
                            <Link to="/pricing" style={{ padding: '8px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500, color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}>Nạp tiền</Link>
                            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-outline)', margin: '0 8px' }} />
                            <span className="badge" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                                {Number(user.balance || 0).toLocaleString('vi-VN')}đ
                            </span>
                            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-primary-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 600, fontSize: '13px' }}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <button onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500, color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/pricing" style={{ padding: '8px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500, color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}>Bảng giá</Link>
                            <Link to="/login" className="btn-tonal" style={{ padding: '8px 24px', fontSize: '13px' }}>Đăng nhập</Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '8px 24px', fontSize: '13px' }}>Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
