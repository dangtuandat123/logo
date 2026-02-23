import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const PLANS = [
    { name: 'Starter', price: 50000, credits: '50.000đ', features: ['5 lần tạo logo AI', 'Tải SVG miễn phí', 'Chỉnh sửa không giới hạn'], popular: false },
    { name: 'Pro', price: 150000, credits: '150.000đ', features: ['20 lần tạo logo AI', 'Tải SVG + PNG HD', 'Ưu tiên xử lý AI', 'Hỗ trợ nhanh'], popular: true },
    { name: 'Business', price: 500000, credits: '500.000đ', features: ['100 lần tạo logo AI', 'Tải tất cả định dạng', 'Ưu tiên cao nhất', 'Brand Kit đầy đủ', 'Hỗ trợ 24/7'], popular: false },
]

const FAQS = [
    { q: 'Tôi có thể dùng thử miễn phí không?', a: 'Có! Mỗi tài khoản mới được tặng số dư dùng thử để tạo logo đầu tiên.' },
    { q: 'Logo có bị watermark không?', a: 'Bản xem trước miễn phí. Tải file SVG/PNG HD yêu cầu có số dư tài khoản.' },
    { q: 'Tôi có quyền sở hữu logo không?', a: 'Hoàn toàn. Tất cả logo bạn tạo đều thuộc quyền sở hữu của bạn.' },
]

export default function PricingPage() {
    const { user, refreshUser } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()
    const [loadingPlan, setLoadingPlan] = useState(null)

    const handleDeposit = async (plan) => {
        if (!user) { navigate('/register'); return }
        setLoadingPlan(plan.name)
        try {
            await api.post('/wallet/deposit', { amount: plan.price, description: `Nạp gói ${plan.name}` })
            await refreshUser()
            toast.success(`Đã nạp ${plan.credits} vào tài khoản!`)
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi nạp tiền.')
        } finally {
            setLoadingPlan(null)
        }
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: 'var(--color-surface-dim)', padding: '64px 24px' }}>
            <div className="container" style={{ maxWidth: '960px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>Bảng giá</h1>
                    <p style={{ color: 'var(--color-on-surface-variant)', maxWidth: '480px', margin: '0 auto', fontSize: '15px' }}>
                        Nạp tiền vào ví để sử dụng các tính năng AI tạo logo và tải file chất lượng cao.
                    </p>
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '64px' }}>
                    {PLANS.map(plan => (
                        <div key={plan.name} style={{
                            backgroundColor: 'var(--color-surface)',
                            border: `1.5px solid ${plan.popular ? 'var(--color-primary)' : 'var(--color-outline)'}`,
                            borderRadius: '24px',
                            padding: '32px',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                        }}>
                            {plan.popular && (
                                <span style={{
                                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                                    padding: '4px 16px', borderRadius: '9999px', backgroundColor: 'var(--color-primary)',
                                    color: 'white', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
                                }}>
                                    Phổ biến nhất
                                </span>
                            )}
                            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</h3>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '24px' }}>{plan.credits}</div>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, marginBottom: '28px' }}>
                                {plan.features.map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                                        <svg style={{ width: '20px', height: '20px', color: 'var(--color-success)', flexShrink: 0, marginTop: '1px' }} fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleDeposit(plan)}
                                disabled={loadingPlan === plan.name}
                                className={plan.popular ? 'btn-primary' : 'btn-tonal'}
                                style={{ width: '100%', padding: '14px' }}
                            >
                                {loadingPlan === plan.name ? 'Đang xử lý...' : 'Nạp ngay'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* FAQ */}
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '24px' }}>Câu hỏi thường gặp</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {FAQS.map((faq, i) => (
                            <div key={i} className="card">
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{faq.q}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
