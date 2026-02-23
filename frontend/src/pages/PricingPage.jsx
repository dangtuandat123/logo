import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Check } from 'lucide-react'

const PLANS = [
    { name: 'Starter', price: 50000, credits: '50.000đ', features: ['5 lần tạo logo AI', 'Tải SVG miễn phí', 'Chỉnh sửa không giới hạn'], popular: false },
    { name: 'Pro', price: 150000, credits: '150.000đ', features: ['20 lần tạo logo AI', 'Tải SVG + PNG HD', 'Ưu tiên xử lý AI', 'Hỗ trợ nhanh'], popular: true },
    { name: 'Business', price: 500000, credits: '500.000đ', features: ['100 lần tạo logo AI', 'Tải tất cả định dạng', 'Ưu tiên cao nhất', 'Brand Kit đầy đủ', 'Hỗ trợ 24/7'], popular: false },
]
const FAQS = [
    { q: 'Dùng thử miễn phí?', a: 'Có! Mỗi tài khoản mới được tặng số dư dùng thử.' },
    { q: 'Logo có watermark không?', a: 'Bản xem trước miễn phí. Tải HD yêu cầu có số dư.' },
    { q: 'Quyền sở hữu logo?', a: 'Hoàn toàn thuộc về bạn. 100% quyền sử dụng.' },
]

export default function PricingPage() {
    const { user, refreshUser } = useAuth(); const toast = useToast(); const navigate = useNavigate()
    const [loadingPlan, setLoadingPlan] = useState(null)
    const handleDeposit = async (plan) => {
        if (!user) { navigate('/register'); return }
        setLoadingPlan(plan.name)
        try { await api.post('/wallet/deposit', { amount: plan.price, description: `Nạp gói ${plan.name}` }); await refreshUser(); toast.success(`Đã nạp ${plan.credits}!`); navigate('/dashboard') }
        catch (e) { toast.error(e.response?.data?.message || 'Lỗi nạp tiền.') }
        finally { setLoadingPlan(null) }
    }

    return (
        <div style={{ padding: '48px 24px' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>Bảng giá</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '480px', margin: '0 auto' }}>Nạp tiền để sử dụng AI tạo logo và tải file chất lượng cao.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px', marginBottom: '64px' }}>
                    {PLANS.map(plan => (
                        <div key={plan.name} style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: `1.5px solid ${plan.popular ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: plan.popular ? '0 0 40px rgba(59,130,246,0.1)' : 'none' }}>
                            {plan.popular && <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', borderRadius: '9999px', background: 'linear-gradient(135deg,#3b82f6,#a855f7)', color: '#fff', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>Phổ biến nhất</span>}
                            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</h3>
                            <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px' }}>
                                <span style={{ background: 'linear-gradient(135deg,#3b82f6,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{plan.credits}</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, marginBottom: '28px' }}>
                                {plan.features.map((f, i) => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                                    <Check size={16} color="#22c55e" />{f}
                                </li>)}
                            </ul>
                            <button onClick={() => handleDeposit(plan)} disabled={loadingPlan === plan.name} className={plan.popular ? 'btn-primary' : 'btn-glass'} style={{ width: '100%', padding: '12px' }}>
                                {loadingPlan === plan.name ? 'Đang xử lý...' : 'Nạp ngay'}
                            </button>
                        </div>
                    ))}
                </div>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '20px' }}>FAQ</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {FAQS.map((f, i) => <div key={i} className="glass-card" style={{ padding: '20px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{f.q}</h3>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{f.a}</p>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}
