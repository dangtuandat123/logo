import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash, faDownload, faWandMagicSparkles, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

export default function DashboardPage() {
    const { user, refreshUser } = useAuth(); const toast = useToast(); const navigate = useNavigate()
    const [logos, setLogos] = useState([]); const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState([]); const [txLoading, setTxLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('logos')

    useEffect(() => { fetchLogos(); fetchTransactions() }, [])

    const fetchLogos = async () => {
        try { const r = await api.get('/logos'); setLogos(r.data.data) }
        catch (e) { toast.error('Không tải được danh sách logo.') }
        finally { setLoading(false) }
    }

    const fetchTransactions = async () => {
        try { const r = await api.get('/wallet/history'); setTransactions(r.data.data) }
        catch (e) { console.error(e) }
        finally { setTxLoading(false) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa logo này vĩnh viễn?')) return
        try { await api.delete(`/logos/${id}`); toast.success('Đã xóa thành công'); fetchLogos() }
        catch (e) { toast.error('Lỗi khi xóa logo') }
    }

    const handleDownload = async (l) => {
        if (user.balance < 50000) { toast.error('Số dư không đủ. Vui lòng nạp thêm.'); navigate('/pricing'); return }
        if (!window.confirm('Tải file chất lượng cao sẽ trừ 50,000đ. Tiếp tục?')) return
        try {
            await api.post(`/wallet/deduct`, { amount: 50000, description: `Tải logo #${l.id} chất lượng cao` })
            await refreshUser(); toast.success('Đã nâng cấp chất lượng!')
            const blob = new Blob([l.svg_content], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a'); a.href = url; a.download = `logo-${l.id}-premium.svg`; a.click()
            URL.revokeObjectURL(url)
        } catch (e) { toast.error('Giao dịch lỗi. Không trừ tiền.') }
    }

    return (
        <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div className="animate-slide-up">
                    <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>
                        Chào mừng, <span style={{ color: 'var(--color-ocean-primary)' }}>{user?.name}</span>
                    </h1>
                    <p style={{ color: 'var(--color-ocean-text-muted)', fontSize: '15px' }}>Đây là trạm lưu trữ các ý tưởng sáng tạo của bạn.</p>
                </div>
                <Link to="/onboarding" className="btn-ocean animate-slide-up" style={{ padding: '12px 24px', animationDelay: '0.1s' }}>
                    <FontAwesomeIcon icon={faPlus} /> Khởi tạo Logo mới
                </Link>
            </div>

            <div className="ocean-card animate-slide-up" style={{ padding: '8px', display: 'flex', gap: '8px', marginBottom: '32px', width: 'fit-content', animationDelay: '0.2s' }}>
                <button onClick={() => setActiveTab('logos')} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === 'logos' ? 'var(--color-ocean-primary)' : 'transparent', color: activeTab === 'logos' ? 'var(--color-ocean-bg)' : 'var(--color-ocean-text)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>Bộ Sưu Tập</button>
                <button onClick={() => setActiveTab('transactions')} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === 'transactions' ? 'var(--color-ocean-primary)' : 'transparent', color: activeTab === 'transactions' ? 'var(--color-ocean-bg)' : 'var(--color-ocean-text)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>Lịch Sử Giao Dịch</button>
            </div>

            {activeTab === 'logos' && (
                <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '300px' }} />)}
                        </div>
                    ) : logos.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                            {logos.map(l => (
                                <div key={l.id} className="ocean-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(235,244,246,0.03)', borderRadius: '16px', border: '1px dashed rgba(235,244,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', position: 'relative', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: l.svg_content }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <span className="ocean-badge">{l.industry}</span>
                                        <span style={{ fontSize: '13px', color: 'var(--color-ocean-text-muted)', fontWeight: 500 }}>{new Date(l.created_at).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginTop: 'auto' }}>
                                        <button onClick={() => navigate(`/editor/${l.id}`)} className="btn-ocean-ghost" style={{ padding: '10px' }} title="Chỉnh sửa"><FontAwesomeIcon icon={faPen} /></button>
                                        <button onClick={() => handleDownload(l)} className="btn-ocean" style={{ padding: '10px', fontSize: '14px' }} title="Tải HD"><FontAwesomeIcon icon={faDownload} /> HD</button>
                                        <button onClick={() => handleDelete(l.id)} className="btn-ocean-danger"><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="ocean-card" style={{ padding: '64px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(122,178,178,0.1)', color: 'var(--color-ocean-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '24px' }}><FontAwesomeIcon icon={faWandMagicSparkles} /></div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Kho lưu trữ trống</h3>
                            <p style={{ color: 'var(--color-ocean-text-muted)', fontSize: '15px', marginBottom: '24px' }}>Bắt đầu bằng cách giao cho AI thiết kế logo đầu tiên của bạn.</p>
                            <Link to="/onboarding" className="btn-ocean" style={{ padding: '12px 32px' }}><FontAwesomeIcon icon={faPlus} /> Khởi tạo logo</Link>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="ocean-card animate-slide-up">
                    {txLoading ? (
                        <div className="skeleton" style={{ height: '400px' }} />
                    ) : transactions.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 150px', padding: '16px 20px', borderBottom: '1px solid rgba(235,244,246,0.1)', color: 'var(--color-ocean-text-muted)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <span>Thời gian</span><span>Nội dung giao dịch</span><span style={{ textAlign: 'right' }}>Thay đổi</span>
                            </div>
                            {transactions.map(t => (
                                <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 150px', padding: '16px 20px', alignItems: 'center', background: 'rgba(235,244,246,0.02)', borderRadius: '12px', border: '1px solid rgba(235,244,246,0.05)' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--color-ocean-text-muted)' }}>{new Date(t.created_at).toLocaleDateString('vi-VN')}</span>
                                    <span style={{ fontSize: '15px', fontWeight: 500 }}>{t.description}</span>
                                    <span style={{ textAlign: 'right', fontWeight: 800, color: t.type === 'deposit' ? 'var(--color-ocean-primary)' : '#fca5a5' }}>
                                        <FontAwesomeIcon icon={t.type === 'deposit' ? faChevronUp : faChevronDown} style={{ fontSize: '12px', marginRight: '6px' }} />
                                        {Number(Math.abs(t.amount)).toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '64px 20px', textAlign: 'center', color: 'var(--color-ocean-text-muted)' }}>
                            Chưa có giao dịch lịch sử nào.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
