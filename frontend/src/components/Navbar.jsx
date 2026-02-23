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
        <nav className="sticky top-0 z-40 bg-surface border-b border-outline">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-on-surface">Logo Master</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                <Link to="/onboarding" className="px-4 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                                    Tạo Logo
                                </Link>
                                <Link to="/dashboard" className="px-4 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                                    Dashboard
                                </Link>
                                <Link to="/pricing" className="px-4 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                                    Nạp tiền
                                </Link>
                                <div className="w-px h-6 bg-outline mx-2" />
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-primary bg-primary-light px-3 py-1 rounded-full">
                                        {Number(user.balance || 0).toLocaleString('vi-VN')}đ
                                    </span>
                                    <div className="w-8 h-8 bg-primary-surface rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <button onClick={handleLogout} className="px-4 py-2 rounded-full text-sm font-medium text-error hover:bg-red-50 transition-colors">
                                        Đăng xuất
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/pricing" className="px-4 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                                    Bảng giá
                                </Link>
                                <Link to="/login" className="px-5 py-2 rounded-full text-sm font-medium bg-primary-light text-primary hover:bg-blue-200 transition-colors">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="px-5 py-2 rounded-full text-sm font-medium bg-primary text-on-primary hover:bg-primary-hover transition-colors">
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-surface-container transition-colors"
                    >
                        <svg className="w-6 h-6 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Nav */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 border-t border-outline pt-3 flex flex-col gap-1">
                        {user ? (
                            <>
                                <Link to="/onboarding" className="px-4 py-3 rounded-2xl text-sm font-medium text-on-surface hover:bg-surface-container" onClick={() => setMobileOpen(false)}>Tạo Logo</Link>
                                <Link to="/dashboard" className="px-4 py-3 rounded-2xl text-sm font-medium text-on-surface hover:bg-surface-container" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                                <Link to="/pricing" className="px-4 py-3 rounded-2xl text-sm font-medium text-on-surface hover:bg-surface-container" onClick={() => setMobileOpen(false)}>Nạp tiền</Link>
                                <div className="border-t border-outline my-2" />
                                <div className="px-4 flex items-center justify-between">
                                    <span className="text-sm text-on-surface-variant">Số dư: <strong className="text-primary">{Number(user.balance || 0).toLocaleString('vi-VN')}đ</strong></span>
                                    <button onClick={handleLogout} className="text-sm font-medium text-error">Đăng xuất</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-3 rounded-2xl text-sm font-medium text-on-surface hover:bg-surface-container" onClick={() => setMobileOpen(false)}>Đăng nhập</Link>
                                <Link to="/register" className="px-4 py-3 rounded-2xl text-sm font-medium text-primary hover:bg-primary-light" onClick={() => setMobileOpen(false)}>Đăng ký</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
