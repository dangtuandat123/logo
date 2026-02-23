import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { Sparkles, LayoutDashboard, Wallet, LogOut, Menu, X } from 'lucide-react'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const handleLogout = async () => { await logout(); navigate('/login') }

    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px) saturate(180%)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={18} color="#fff" />
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>Logo Master</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>Dashboard</Link>
                            <span className="badge" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>{Number(user.balance || 0).toLocaleString('vi-VN')}đ</span>
                            <button onClick={handleLogout} className="btn-ghost" style={{ padding: '8px 12px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}><LogOut size={16} /></button>
                        </>
                    ) : (
                        <>
                            <Link to="/pricing" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>Bảng giá</Link>
                            <Link to="/login" className="btn-glass" style={{ padding: '8px 20px', fontSize: '13px' }}>Đăng nhập</Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
