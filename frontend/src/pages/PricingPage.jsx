import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faBolt, faStar, faCrown } from '@fortawesome/free-solid-svg-icons'

const PLANS = [
    { name: 'Sinh viên', icon: faBolt, price: 50000, credits: '50.000đ', features: ['5 tín chỉ thiết kế AI', 'Tải dạng Vector cơ bản', '3 phiên bản mỗi lần tạo'], popular: false },
    { name: 'Chuyên nghiệp', icon: faStar, price: 150000, credits: '150.000đ', features: ['20 tín chỉ thiết kế AI', 'Tải Vector + PNG 4K', 'Thuật toán nghệ thuật Pro', 'Hỗ trợ thiết kế 1-1'], popular: true },
    { name: 'Doanh nghiệp', icon: faCrown, price: 500000, credits: '500.000đ', features: ['100 tín chỉ thiết kế AI', 'Brand Kit toàn diện', 'Cấp quyền thương mại 100%', 'Tốc độ khởi tạo ưu tiên', 'Đảm bảo hoàn tiền'], popular: false },
]
const FAQS = [
    { q: 'Hệ thống AI xử lý ra sao?', a: 'Chúng tôi nạp vào mô hình 10 triệu mẫu logo xuất sắc nhất. Khi bạn yêu cầu, nó sẽ dung hợp concept để tạo tác phẩm độc bản.' },
    { q: 'Có tính phí xem trước không?', a: 'Hoàn toàn không. Bạn có thể xem trước thoải mái. Tín chỉ chỉ bị trừ khi bạn quyết định tải xuống file chất lượng cao.' },
    { q: 'Quyền Sở hữu Trí tuệ?', a: 'Sau khi thanh toán tải xuống, bạn nắm giữ 100% bản quyền thương mại và có thể đăng ký bảo hộ nhãn hiệu hợp pháp.' },
]

export default function PricingPage() {
    const { user, refreshUser } = useAuth(); const toast = useToast(); const navigate = useNavigate()
    const [loadingPlan, setLoadingPlan] = useState(null)

    const handleDeposit = async (plan) => {
        if (!user) { navigate('/login'); return }
        setLoadingPlan(plan.name)
        try {
            await api.post('/wallet/deposit', { amount: plan.price, description: `Truy cập module ${plan.name}` })
            await refreshUser()
            toast.success(`Nạp năng lượng thành công: ${plan.credits}!`)
            navigate('/dashboard')
        } catch (e) {
            toast.error(e.response?.data?.message || 'Giao dịch bị từ chối bởi ngân hàng liên ngân hà.')
        } finally {
            setLoadingPlan(null)
        }
    }

    return (
        <div style={{ padding: '64px 24px', paddingBottom: '120px' }}>
            <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
                <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>Cấp Phép Truy Cập AI</h1>
                    <p style={{ color: 'var(--color-ocean-text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>Nạp tín chỉ để kích hoạt sức mạnh thiết kế của Neural Network và nhận quyền sở hữu tài sản kỹ thuật số.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '80px' }}>
                    {PLANS.map((plan, index) => (
                        <div key={plan.name} className={`ocean-card animate-slide-up`} style={{
                            position: 'relative', overflow: 'hidden', padding: '40px 32px', display: 'flex', flexDirection: 'column',
                            border: plan.popular ? '2px solid var(--color-ocean-primary)' : '1px solid var(--color-ocean-border)',
                            background: plan.popular ? 'rgba(8,131,149,0.4)' : 'rgba(8,131,149,0.2)',
                            animationDelay: `${index * 0.15}s`,
                            transform: plan.popular ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: plan.popular ? '0 20px 60px rgba(9,99,126,0.6)' : 'none',
                            zIndex: plan.popular ? 10 : 1
                        }}>
                            {plan.popular && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'var(--color-ocean-primary)' }} />}
                            {plan.popular && <div style={{ position: 'absolute', top: '24px', right: '-32px', background: 'var(--color-ocean-primary)', color: 'var(--color-ocean-bg)', fontSize: '12px', fontWeight: 800, padding: '6px 40px', transform: 'rotate(45deg)', letterSpacing: '1px', textTransform: 'uppercase' }}>HOT NHẤT</div>}

                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: plan.popular ? 'var(--color-ocean-primary)' : 'rgba(122,178,178,0.15)', color: plan.popular ? 'var(--color-ocean-bg)' : 'var(--color-ocean-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '24px' }}>
                                <FontAwesomeIcon icon={plan.icon} />
                            </div>

                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Gói {plan.name}</h3>
                            <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: '32px', color: plan.popular ? 'var(--color-ocean-primary)' : 'var(--color-ocean-text)', letterSpacing: '-1px' }}>
                                {plan.credits}
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, marginBottom: '40px' }}>
                                {plan.features.map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--color-ocean-text)', lineHeight: 1.5, fontWeight: plan.popular ? 600 : 400 }}>
                                        <FontAwesomeIcon icon={faCheck} style={{ color: 'var(--color-ocean-primary)', marginTop: '4px' }} />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => handleDeposit(plan)} disabled={loadingPlan === plan.name} className={plan.popular ? 'btn-ocean' : 'btn-ocean-ghost'} style={{ width: '100%', padding: '16px' }}>
                                {loadingPlan === plan.name ? 'Đang mã hóa giao dịch...' : 'Kích Hoạt Gói'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', animationDelay: '0.6s' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, textAlign: 'center', marginBottom: '32px' }}>Câu hỏi từ thực tập sinh</h2>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {FAQS.map((f, i) => (
                            <div key={i} className="ocean-card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px' }}>{f.q}</h3>
                                <p style={{ fontSize: '15px', color: 'var(--color-ocean-text-muted)', lineHeight: 1.6 }}>{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
