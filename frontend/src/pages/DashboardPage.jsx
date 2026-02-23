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

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [logosRes, txRes] = await Promise.all([
                api.get('/logos'),
                api.get('/wallet/transactions'),
            ])
            setLogos(logosRes.data.data.data || [])
            setTransactions(txRes.data.data.data || [])
            await refreshUser()
        } catch (err) {
            toast.error('Lỗi tải dữ liệu.')
        } finally {
            setLoading(false)
        }
    }

    const deleteLogo = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa logo này?')) return
        try {
            await api.delete(`/logos/${id}`)
            setLogos(prev => prev.filter(l => l.id !== id))
            toast.success('Đã xóa logo.')
        } catch (err) {
            toast.error('Lỗi khi xóa.')
        }
    }

    return (
        <div className="min-h-screen bg-surface-dim">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-on-surface">Dashboard</h1>
                        <p className="text-on-surface-variant text-sm mt-1">Xin chào, {user?.name}!</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-5 py-2.5 rounded-2xl bg-primary-light border border-primary/20">
                            <span className="text-sm text-on-surface-variant">Số dư: </span>
                            <span className="text-lg font-bold text-primary">{Number(user?.balance || 0).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <Link to="/onboarding" className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors">
                            + Tạo Logo mới
                        </Link>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-1 p-1 bg-surface-container rounded-2xl mb-8 w-fit">
                    {[
                        { key: 'logos', label: 'Logo của tôi', icon: '🎨' },
                        { key: 'transactions', label: 'Lịch sử giao dịch', icon: '💰' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-surface text-on-surface border border-outline' : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-surface rounded-3xl border border-outline p-4">
                                <div className="skeleton h-40 mb-4" />
                                <div className="skeleton h-5 w-3/4 mb-2" />
                                <div className="skeleton h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : activeTab === 'logos' ? (
                    /* Logo Grid */
                    logos.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 bg-primary-light rounded-3xl flex items-center justify-center text-4xl">🎨</div>
                            <h3 className="text-lg font-semibold text-on-surface mb-2">Chưa có logo nào</h3>
                            <p className="text-on-surface-variant text-sm mb-6">Bắt đầu tạo logo đầu tiên của bạn ngay!</p>
                            <Link to="/onboarding" className="px-6 py-3 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors">
                                Tạo Logo ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {logos.map(logo => (
                                <div key={logo.id} className="bg-surface rounded-3xl border border-outline overflow-hidden hover:border-primary/30 transition-colors group">
                                    {/* SVG Preview */}
                                    <div className="aspect-[4/3] bg-surface-dim p-6 flex items-center justify-center border-b border-outline">
                                        <div
                                            className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                                            dangerouslySetInnerHTML={{ __html: logo.svg_content || '<svg></svg>' }}
                                        />
                                    </div>
                                    {/* Info */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-on-surface truncate">{logo.name}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${logo.status === 'completed' ? 'bg-green-50 text-green-700' :
                                                    logo.status === 'exported' ? 'bg-blue-50 text-blue-700' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {logo.status === 'completed' ? 'Hoàn thành' : logo.status === 'exported' ? 'Đã xuất' : 'Nháp'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-on-surface-variant mb-3">{logo.industry} · {logo.style}</p>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/editor/${logo.id}`}
                                                className="flex-1 text-center px-3 py-2 rounded-full bg-primary-light text-primary text-xs font-medium hover:bg-blue-200 transition-colors"
                                            >
                                                ✏️ Chỉnh sửa
                                            </Link>
                                            <button
                                                onClick={() => deleteLogo(logo.id)}
                                                className="px-3 py-2 rounded-full border border-outline text-error text-xs font-medium hover:bg-red-50 transition-colors"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    /* Transactions Table */
                    transactions.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 bg-primary-light rounded-3xl flex items-center justify-center text-4xl">💰</div>
                            <h3 className="text-lg font-semibold text-on-surface mb-2">Chưa có giao dịch</h3>
                            <p className="text-on-surface-variant text-sm">Các giao dịch nạp tiền và sử dụng sẽ hiển thị ở đây.</p>
                        </div>
                    ) : (
                        <div className="bg-surface rounded-3xl border border-outline overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-outline">
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Thời gian</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Loại</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Mô tả</th>
                                        <th className="text-right px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Số tiền</th>
                                        <th className="text-right px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Số dư</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id} className="border-b border-outline last:border-b-0 hover:bg-surface-dim transition-colors">
                                            <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(tx.created_at).toLocaleDateString('vi-VN')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${tx.type === 'deposit' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                                    }`}>
                                                    {tx.type === 'deposit' ? '↑ Nạp' : '↓ Trừ'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-on-surface">{tx.description}</td>
                                            <td className={`px-6 py-4 text-sm text-right font-semibold ${tx.type === 'deposit' ? 'text-success' : 'text-error'}`}>
                                                {tx.type === 'deposit' ? '+' : '-'}{Number(tx.amount).toLocaleString('vi-VN')}đ
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right text-on-surface-variant">{Number(tx.balance_after).toLocaleString('vi-VN')}đ</td>
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
