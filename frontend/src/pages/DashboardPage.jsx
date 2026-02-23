import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function DashboardPage() {
    const { user, refreshUser } = useAuth(); const toast = useToast()
    const [logos, setLogos] = useState([]); const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState([]); const [tab, setTab] = useState('logos')

    useEffect(() => { loadData() }, [])
    const loadData = async () => {
        try { const [l, t] = await Promise.all([api.get('/logos'), api.get('/wallet/transactions')]); setLogos(l.data.data.data || []); setTransactions(t.data.data.data || []); await refreshUser() }
        catch (e) { toast.error('Lỗi tải dữ liệu.') } finally { setLoading(false) }
    }
    const del = async (id) => {
        if (!confirm('Xóa logo này?')) return
        try { await api.delete(`/logos/${id}`); setLogos(p => p.filter(l => l.id !== id)); toast.success('Đã xóa.') }
        catch (e) { toast.error('Lỗi xóa.') }
    }

    const tabStyle = (a) => ({ padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: a ? 'rgba(59,130,246,0.15)' : 'transparent', border: 'none', color: a ? '#60a5fa' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s' })

    return (
        <div style={{ padding: '32px 24px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Dashboard</h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '4px' }}>Xin chào, {user?.name}!</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="glass-card" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Số dư</span>
                            <span style={{ fontSize: '18px', fontWeight: 700, background: 'linear-gradient(135deg,#3b82f6,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{Number(user?.balance || 0).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <Link to="/onboarding" className="btn-primary" style={{ padding: '10px 20px' }}><Plus size={16} /> Tạo Logo</Link>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'inline-flex', gap: '4px', padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '28px' }}>
                    <button onClick={() => setTab('logos')} style={tabStyle(tab === 'logos')}>🎨 Logo của tôi</button>
                    <button onClick={() => setTab('tx')} style={tabStyle(tab === 'tx')}>💰 Giao dịch</button>
                </div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
                        {[1, 2, 3].map(i => <div key={i} className="glass-card"><div className="skeleton" style={{ height: '160px', marginBottom: '16px' }} /><div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '8px' }} /><div className="skeleton" style={{ height: '16px', width: '50%' }} /></div>)}
                    </div>
                ) : tab === 'logos' ? (
                    logos.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                            <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '24px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>🎨</div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Chưa có logo</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>Tạo logo đầu tiên ngay!</p>
                            <Link to="/onboarding" className="btn-primary">Tạo Logo</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
                            {logos.map(l => (
                                <div key={l.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                                    <div style={{ aspectRatio: '4/3', background: 'rgba(255,255,255,0.02)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }} dangerouslySetInnerHTML={{ __html: l.svg_content || '<svg></svg>' }} />
                                    <div style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <h3 style={{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</h3>
                                            <span className="badge" style={{ background: l.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', color: l.status === 'completed' ? '#22c55e' : 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{l.status === 'completed' ? 'Done' : 'Nháp'}</span>
                                        </div>
                                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>{l.industry} · {l.style}</p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Link to={`/editor/${l.id}`} className="btn-glass" style={{ flex: 1, padding: '8px', fontSize: '12px', textAlign: 'center' }}><Pencil size={14} /> Sửa</Link>
                                            <button onClick={() => del(l.id)} className="btn-danger" style={{ padding: '8px 12px', fontSize: '12px' }}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    transactions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                            <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '24px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>💰</div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Chưa có giao dịch</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Giao dịch sẽ hiển thị ở đây.</p>
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {['Thời gian', 'Loại', 'Mô tả', 'Số tiền', 'Số dư'].map(h => <th key={h} style={{ textAlign: h === 'Số tiền' || h === 'Số dư' ? 'right' : 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>)}
                                </tr></thead>
                                <tbody>{transactions.map(t => <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{new Date(t.created_at).toLocaleDateString('vi-VN')}</td>
                                    <td style={{ padding: '14px 20px' }}><span className="badge" style={{ background: t.type === 'deposit' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: t.type === 'deposit' ? '#22c55e' : '#f87171', fontSize: '11px' }}>{t.type === 'deposit' ? '↑ Nạp' : '↓ Trừ'}</span></td>
                                    <td style={{ padding: '14px 20px', fontSize: '13px' }}>{t.description}</td>
                                    <td style={{ padding: '14px 20px', fontSize: '13px', textAlign: 'right', fontWeight: 600, color: t.type === 'deposit' ? '#22c55e' : '#f87171' }}>{t.type === 'deposit' ? '+' : '-'}{Number(t.amount).toLocaleString('vi-VN')}đ</td>
                                    <td style={{ padding: '14px 20px', fontSize: '13px', textAlign: 'right', color: 'rgba(255,255,255,0.4)' }}>{Number(t.balance_after).toLocaleString('vi-VN')}đ</td>
                                </tr>)}</tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
