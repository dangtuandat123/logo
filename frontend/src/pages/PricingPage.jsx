import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const PLANS = [
    {
        name: 'Starter',
        price: 50000,
        credits: '50.000đ',
        features: ['5 lần tạo logo AI', 'Tải SVG miễn phí', 'Chỉnh sửa không giới hạn'],
        popular: false,
    },
    {
        name: 'Pro',
        price: 150000,
        credits: '150.000đ',
        features: ['20 lần tạo logo AI', 'Tải SVG + PNG HD', 'Ưu tiên xử lý AI', 'Hỗ trợ nhanh'],
        popular: true,
    },
    {
        name: 'Business',
        price: 500000,
        credits: '500.000đ',
        features: ['100 lần tạo logo AI', 'Tải tất cả định dạng', 'Ưu tiên cao nhất', 'Brand Kit đầy đủ', 'Hỗ trợ 24/7'],
        popular: false,
    },
]

export default function PricingPage() {
    const { user, refreshUser } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()
    const [loadingPlan, setLoadingPlan] = useState(null)

    const handleDeposit = async (plan) => {
        if (!user) {
            navigate('/register')
            return
        }

        setLoadingPlan(plan.name)
        try {
            await api.post('/wallet/deposit', {
                amount: plan.price,
                description: `Nạp gói ${plan.name}`,
            })
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
        <div className="min-h-screen bg-surface-dim">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-on-surface mb-3">Bảng giá</h1>
                    <p className="text-on-surface-variant max-w-xl mx-auto">Nạp tiền vào ví để sử dụng các tính năng AI tạo logo và tải file chất lượng cao.</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {PLANS.map(plan => (
                        <div
                            key={plan.name}
                            className={`rounded-3xl border p-8 flex flex-col relative ${plan.popular
                                    ? 'bg-surface border-primary'
                                    : 'bg-surface border-outline'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-on-primary text-xs font-semibold">
                                    Phổ biến nhất
                                </div>
                            )}
                            <h3 className="text-lg font-bold text-on-surface mb-1">{plan.name}</h3>
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-primary">{plan.credits}</span>
                            </div>
                            <ul className="flex flex-col gap-3 mb-8 flex-1">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                                        <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleDeposit(plan)}
                                disabled={loadingPlan === plan.name}
                                className={`w-full py-3 rounded-full font-semibold text-sm transition-colors disabled:opacity-50 ${plan.popular
                                        ? 'bg-primary text-on-primary hover:bg-primary-hover'
                                        : 'bg-primary-light text-primary hover:bg-blue-200'
                                    }`}
                            >
                                {loadingPlan === plan.name ? 'Đang xử lý...' : 'Nạp ngay'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* FAQ */}
                <div className="mt-16">
                    <h2 className="text-xl font-bold text-on-surface text-center mb-8">Câu hỏi thường gặp</h2>
                    <div className="max-w-2xl mx-auto flex flex-col gap-4">
                        {[
                            { q: 'Tôi có thể dùng thử miễn phí không?', a: 'Có! Mỗi tài khoản mới được tặng số dư dùng thử để tạo logo đầu tiên.' },
                            { q: 'Logo có bị watermark không?', a: 'Bản xem trước miễn phí. Tải file SVG/PNG HD yêu cầu có số dư tài khoản.' },
                            { q: 'Tôi có quyền sở hữu logo không?', a: 'Hoàn toàn. Tất cả logo bạn tạo đều thuộc quyền sở hữu của bạn.' },
                        ].map((faq, i) => (
                            <div key={i} className="bg-surface rounded-2xl border border-outline p-6">
                                <h3 className="font-semibold text-on-surface mb-2">{faq.q}</h3>
                                <p className="text-sm text-on-surface-variant">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
