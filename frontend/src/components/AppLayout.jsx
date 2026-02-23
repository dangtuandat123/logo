import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sparkles, LayoutDashboard, Wallet, LogOut, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'

const NAV_ITEMS = [
    { to: '/onboarding', label: 'Tạo Logo', icon: Sparkles },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/pricing', label: 'Nạp tiền', icon: Wallet },
]

export default function AppLayout({ children }) {
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = async () => { await logout(); navigate('/login') }
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-dark-950)' }}>
            {/* === DESKTOP SIDEBAR === */}
            <aside style={{
                width: collapsed ? '72px' : '240px',
                minHeight: '100vh', position: 'sticky', top: 0,
                background: 'rgba(15,15,24,0.6)',
                backdropFilter: 'blur(20px) saturate(180%)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.3s ease',
                zIndex: 40,
            }} className="hidden lg:flex">
                {/* Logo */}
                <div style={{ padding: collapsed ? '20px 0' : '20px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: '64px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Sparkles size={18} color="#fff" />
                    </div>
                    {!collapsed && <span style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.95)', whiteSpace: 'nowrap' }}>Logo Master</span>}
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.to)
                        const Icon = item.icon
                        return (
                            <Link key={item.to} to={item.to} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: collapsed ? '12px 0' : '10px 14px',
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                borderRadius: '10px', textDecoration: 'none', transition: 'all 0.15s ease',
                                background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                                color: active ? '#60a5fa' : 'rgba(255,255,255,0.6)',
                            }}>
                                <Icon size={20} />
                                {!collapsed && <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Section */}
                <div style={{ padding: collapsed ? '16px 8px' : '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {!collapsed && user && (
                        <div style={{ marginBottom: '12px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>Số dư</p>
                            <p style={{ fontSize: '16px', fontWeight: 700, color: '#60a5fa' }}>{Number(user.balance || 0).toLocaleString('vi-VN')}đ</p>
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '13px', color: '#fff', flexShrink: 0 }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        {!collapsed && (
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                            </div>
                        )}
                        {!collapsed && (
                            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: '4px', borderRadius: '6px', display: 'flex' }} title="Đăng xuất">
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Collapse Toggle */}
                <button onClick={() => setCollapsed(!collapsed)} style={{
                    position: 'absolute', right: '-12px', top: '24px', zIndex: 50,
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'var(--color-dark-700)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                }}>
                    {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>
            </aside>

            {/* === MAIN CONTENT === */}
            <main style={{ flex: 1, minWidth: 0, paddingBottom: '80px' }} className="lg:pb-0">
                {children}
            </main>

            {/* === MOBILE BOTTOM NAV === */}
            <nav style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
                background: 'rgba(15,15,24,0.95)', backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-around',
                height: '64px', paddingBottom: 'env(safe-area-inset-bottom)',
            }} className="lg:hidden">
                {NAV_ITEMS.map(item => {
                    const active = isActive(item.to)
                    const Icon = item.icon
                    return (
                        <Link key={item.to} to={item.to} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                            textDecoration: 'none', padding: '8px 16px', borderRadius: '12px',
                            color: active ? '#60a5fa' : 'rgba(255,255,255,0.4)',
                            transition: 'color 0.15s ease',
                        }}>
                            <Icon size={20} />
                            <span style={{ fontSize: '11px', fontWeight: 500 }}>{item.label}</span>
                        </Link>
                    )
                })}
                <button onClick={handleLogout} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px',
                    color: 'rgba(255,255,255,0.4)',
                }}>
                    <LogOut size={20} />
                    <span style={{ fontSize: '11px', fontWeight: 500 }}>Thoát</span>
                </button>
            </nav>
        </div>
    )
}
