import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

export default function DashboardPage() {
    const { user, refreshUser } = useAuth()
    const toast = useToast()
    const [logos, setLogos] = useState([])
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState([])
    const [activeTab, setActiveTab] = useState('logos')

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        try {
            const [logosRes, txRes] = await Promise.all([api.get('/logos'), api.get('/wallet/transactions')])
            setLogos(logosRes.data.data.data || [])
            setTransactions(txRes.data.data.data || [])
            await refreshUser()
        } catch (err) { toast.error('Lỗi tải dữ liệu.') }
        finally { setLoading(false) }
    }

    const deleteLogo = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa logo này?')) return
        try { await api.delete(`/logos/${id}`); setLogos(prev => prev.filter(l => l.id !== id)); toast.success('Đã xóa logo.') }
        catch (err) { toast.error('Lỗi khi xóa.') }
    }

    const tabStyle = (active) => ({
        padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 500,
        backgroundColor: active ? 'var(--color-surface)' : 'transparent',
        border: active ? '1px solid var(--color-outline)' : '1px solid transparent',
        color: active ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
        cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s ease',
    })

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: 'var(--color-surface-dim)', padding: '32px 24px' }}>
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Dashboard</h1>
                        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', marginTop: '4px' }}>Xin chào, {user?.name}!</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '10px 20px', borderRadius: '16px', backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>Số dư:</span>
                            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>{Number(user?.balance || 0).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <Link to="/onboarding" className="btn-primary" style={{ padding: '10px 24px' }}>+ Tạo Logo mới</Link>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div style={{ display: 'inline-flex', gap: '4px', padding: '4px', backgroundColor: 'var(--color-surface-container)', borderRadius: '16px', marginBottom: '32px' }}>
                    <button onClick={() => setActiveTab('logos')} style={tabStyle(activeTab === 'logos')}>🎨 Logo của tôi</button>
                    <button onClick={() => setActiveTab('transactions')} style={tabStyle(activeTab === 'transactions')}>💰 Lịch sử giao dịch</button>
                </div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card" style={{ padding: '16px' }}>
                                <div className="skeleton" style={{ height: '160px', marginBottom: '16px' }} />
                                <div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '8px' }} />
                                <div className="skeleton" style={{ height: '16px', width: '50%' }} />
                            </div>
                        ))}
                    </div>
                ) : activeTab === 'logos' ? (
                    logos.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                            <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', backgroundColor: 'var(--color-primary-light)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>🎨</div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Chưa có logo nào</h3>
                            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', marginBottom: '24px' }}>Bắt đầu tạo logo đầu tiên của bạn ngay!</p>
                            <Link to="/onboarding" className="btn-primary">Tạo Logo ngay</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {logos.map(logo => (
                                <div key={logo.id} style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-outline)', borderRadius: '20px', overflow: 'hidden' }}>
                                    <div style={{ aspectRatio: '4/3', backgroundColor: 'var(--color-surface-dim)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-outline)' }} dangerouslySetInnerHTML={{ __html: logo.svg_content || '<svg></svg>' }} />
                                    <div style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{logo.name}</h3>
                                            <span className="badge" style={{ backgroundColor: logo.status === 'completed' ? 'var(--color-success-light)' : 'var(--color-surface-container)', color: logo.status === 'completed' ? 'var(--color-success)' : 'var(--color-secondary)', fontSize: '12px', padding: '4px 10px' }}>
                                                {logo.status === 'completed' ? 'Hoàn thành' : 'Nháp'}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '12px' }}>{logo.industry} · {logo.style}</p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Link to={`/editor/${logo.id}`} className="btn-tonal" style={{ flex: 1, padding: '8px', fontSize: '13px', textAlign: 'center' }}>✏️ Chỉnh sửa</Link>
                                            <button onClick={() => deleteLogo(logo.id)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    transactions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                            <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', backgroundColor: 'var(--color-primary-light)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>💰</div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Chưa có giao dịch</h3>
                            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>Các giao dịch nạp tiền và sử dụng sẽ hiển thị ở đây.</p>
                        </div>
                    ) : (
                        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-outline)', borderRadius: '20px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-outline)' }}>
                                        {['Thời gian', 'Loại', 'Mô tả', 'Số tiền', 'Số dư'].map(h => (
                                            <th key={h} style={{ textAlign: h === 'Số tiền' || h === 'Số dư' ? 'right' : 'left', padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-outline)' }}>
                                            <td style={{ padding: '14px 20px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>{new Date(tx.created_at).toLocaleDateString('vi-VN')}</td>
                                            <td style={{ padding: '14px 20px' }}>
                                                <span className="badge" style={{ backgroundColor: tx.type === 'deposit' ? 'var(--color-success-light)' : 'var(--color-error-light)', color: tx.type === 'deposit' ? 'var(--color-success)' : 'var(--color-error)', fontSize: '12px', padding: '4px 10px' }}>
                                                    {tx.type === 'deposit' ? '↑ Nạp' : '↓ Trừ'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 20px', fontSize: '14px' }}>{tx.description}</td>
                                            <td style={{ padding: '14px 20px', fontSize: '14px', textAlign: 'right', fontWeight: 600, color: tx.type === 'deposit' ? 'var(--color-success)' : 'var(--color-error)' }}>
                                                {tx.type === 'deposit' ? '+' : '-'}{Number(tx.amount).toLocaleString('vi-VN')}đ
                                            </td>
                                            <td style={{ padding: '14px 20px', fontSize: '14px', textAlign: 'right', color: 'var(--color-on-surface-variant)' }}>{Number(tx.balance_after).toLocaleString('vi-VN')}đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
