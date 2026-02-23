import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faTableColumns, faWallet, faRightFromBracket, faChevronLeft, faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons'

const NAV_ITEMS = [
    { to: '/', label: 'Trang chủ', icon: faHome, public: true },
    { to: '/onboarding', label: 'Tạo Logo', icon: faWandMagicSparkles, public: false },
    { to: '/dashboard', label: 'Dashboard', icon: faTableColumns, public: false },
    { to: '/pricing', label: 'Nạp tiền', icon: faWallet, public: false },
]

export default function AppLayout({ children }) {
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)

    const handleLogout = async () => { await logout(); navigate('/login') }
    const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'))

    // Filter items based on auth state
    const visibleItems = NAV_ITEMS.filter(item => item.public || user)

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-ocean-bg)' }}>
            {/* === DESKTOP SIDEBAR === */}
            <aside className="desktop-only ocean-glass" style={{
                width: collapsed ? '80px' : '260px',
                height: '100vh', position: 'sticky', top: 0,
                flexDirection: 'column', transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 40, borderRight: '1px solid var(--color-ocean-border)',
                borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
            }}>
                {/* Logo */}
                <div style={{ padding: collapsed ? '24px 0' : '24px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '14px', borderBottom: '1px solid var(--color-ocean-border)', minHeight: '80px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'var(--color-ocean-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(122,178,178,0.4)' }}>
                        <FontAwesomeIcon icon={faWandMagicSparkles} style={{ color: '#09637E', fontSize: '18px' }} />
                    </div>
                    {!collapsed && <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ocean-text)', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>Logo Master</span>}
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {visibleItems.map(item => {
                        const active = isActive(item.to)
                        return (
                            <Link key={item.to} to={item.to} style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                padding: collapsed ? '14px 0' : '12px 16px',
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s',
                                background: active ? 'rgba(122,178,178,0.15)' : 'transparent',
                                border: `1px solid ${active ? 'rgba(122,178,178,0.3)' : 'transparent'}`,
                                color: active ? 'var(--color-ocean-primary)' : 'var(--color-ocean-text-muted)',
                            }}>
                                <FontAwesomeIcon icon={item.icon} style={{ fontSize: '18px' }} />
                                {!collapsed && <span style={{ fontSize: '15px', fontWeight: 600 }}>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Section */}
                <div style={{ padding: collapsed ? '20px 12px' : '20px', borderTop: '1px solid var(--color-ocean-border)' }}>
                    {!collapsed && user && (
                        <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '14px', background: 'var(--color-ocean-card)', border: '1px solid var(--color-ocean-border)' }}>
                            <p style={{ fontSize: '12px', color: 'var(--color-ocean-text-muted)', marginBottom: '4px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Số dư ví</p>
                            <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ocean-primary)' }}>{Number(user.balance || 0).toLocaleString('vi-VN')}đ</p>
                        </div>
                    )}
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--color-ocean-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', color: 'var(--color-ocean-bg)', flexShrink: 0 }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            {!collapsed && (
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ocean-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                                </div>
                            )}
                            {!collapsed && (
                                <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', color: '#fca5a5', padding: '8px', borderRadius: '10px', display: 'flex', transition: 'all 0.2s' }} title="Đăng xuất">
                                    <FontAwesomeIcon icon={faRightFromBracket} />
                                </button>
                            )}
                        </div>
                    ) : (
                        !collapsed && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Link to="/login" className="btn-ocean-ghost" style={{ padding: '10px', fontSize: '14px' }}>Đăng nhập</Link>
                                <Link to="/register" className="btn-ocean" style={{ padding: '10px', fontSize: '14px' }}>Đăng ký</Link>
                            </div>
                        )
                    )}
                </div>

                {/* Collapse Toggle */}
                <button onClick={() => setCollapsed(!collapsed)} style={{
                    position: 'absolute', right: '-14px', top: '32px', zIndex: 50,
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'var(--color-ocean-primary)', border: '4px solid var(--color-ocean-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-ocean-bg)', cursor: 'pointer', transition: 'transform 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                    <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} style={{ fontSize: '12px', fontWeight: 900 }} />
                </button>
            </aside>

            {/* === MAIN CONTENT === */}
            <main style={{ flex: 1, minWidth: 0, paddingBottom: '90px', position: 'relative' }} className="lg:pb-0">
                {/* Mobile Header (For public pages or user info) */}
                <div className="mobile-only ocean-glass" style={{ position: 'sticky', top: 0, zIndex: 30, padding: '12px 20px', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-ocean-border)', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--color-ocean-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={faWandMagicSparkles} style={{ color: '#09637E', fontSize: '14px' }} />
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-ocean-text)' }}>Logo Master</span>
                    </Link>
                    {user ? (
                        <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--color-ocean-card)', fontSize: '13px', fontWeight: 700, color: 'var(--color-ocean-primary)' }}>
                            {Number(user.balance || 0).toLocaleString('vi-VN')}đ
                        </div>
                    ) : (
                        <Link to="/login" className="btn-ocean" style={{ padding: '6px 14px', fontSize: '13px', borderRadius: '8px' }}>Đăng nhập</Link>
                    )}
                </div>
                {children}
            </main>

            {/* === MOBILE BOTTOM NAV === */}
            <nav className="mobile-only ocean-glass" style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
                borderTop: '1px solid var(--color-ocean-border)', borderBottom: 'none', borderLeft: 'none', borderRight: 'none',
                alignItems: 'center', justifyContent: 'space-around',
                height: '70px', paddingBottom: 'env(safe-area-inset-bottom)',
            }}>
                {visibleItems.map(item => {
                    const active = isActive(item.to)
                    return (
                        <Link key={item.to} to={item.to} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                            textDecoration: 'none', padding: '10px 16px', borderRadius: '14px',
                            color: active ? 'var(--color-ocean-primary)' : 'var(--color-ocean-text-muted)',
                            transition: 'all 0.2s',
                        }}>
                            <FontAwesomeIcon icon={item.icon} style={{ fontSize: '20px', filter: active ? 'drop-shadow(0 2px 8px rgba(122,178,178,0.5))' : 'none' }} />
                            <span style={{ fontSize: '11px', fontWeight: 600 }}>{item.label}</span>
                        </Link>
                    )
                })}
                {user && (
                    <button onClick={handleLogout} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px',
                        color: 'var(--color-ocean-text-muted)',
                    }}>
                        <FontAwesomeIcon icon={faRightFromBracket} style={{ fontSize: '20px' }} />
                        <span style={{ fontSize: '11px', fontWeight: 600 }}>Thoát</span>
                    </button>
                )}
            </nav>
        </div>
    )
}
