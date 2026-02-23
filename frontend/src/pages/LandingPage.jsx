import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faPalette, faPenNib, faShieldHalved, faStar, faDollarSign } from '@fortawesome/free-solid-svg-icons'

export default function LandingPage() {
    const { user } = useAuth()
    const features = [
        { icon: faBolt, title: 'Nhanh xuất thần', desc: 'Công nghệ AI mạnh mẽ tạo ra hàng chục ý tưởng thiết kế chỉ trong thời gian bạn ngáp một cái.' },
        { icon: faPalette, title: 'Tùy biến đa dạng', desc: 'Dễ dàng thay đổi màu sắc, font chữ và bố cục. Creative freedom hoàn toàn trong tay bạn.' },
        { icon: faPenNib, title: 'Chuẩn Vector SVG', desc: 'Xuất file chuẩn in ấn. Phóng to thoải mái không bao giờ lo vỡ nét hay mờ nhòe.' },
        { icon: faStar, title: 'Phong cách độc bản', desc: 'Từ Minimalist tinh tế đến Mascot nghịch ngợm. AI học hỏi các xu hướng thiết kế mới nhất toàn cầu.' },
        { icon: faShieldHalved, title: 'Bảo mật tuyệt đối', desc: 'Dữ liệu thương hiệu của bạn được mã hóa và bảo vệ an toàn trên nền tảng đám mây.' },
        { icon: faDollarSign, title: 'Đầu tư thông minh', desc: 'Bắt đầu hoàn toàn miễn phí. Chỉ thanh toán khi bạn thực sự hài lòng với thiết kế cuối cùng.' },
    ]

    return (
        <div>
            {/* Hero Section */}
            <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div className="animate-float" style={{ position: 'absolute', top: '20px', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(122,178,178,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', zIndex: 10 }}>
                    <span className="ocean-badge animate-slide-up" style={{ marginBottom: '32px' }}>✨ Trí tuệ thiết kế tương lai</span>
                    <h1 className="animate-slide-up" style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
                        Biến Ý Tưởng Thành
                        <br />
                        <span style={{ color: 'var(--color-ocean-primary)' }}>Logo Độc Bản</span>
                    </h1>
                    <p className="animate-slide-up" style={{ fontSize: '18px', color: 'var(--color-ocean-text-muted)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6, animationDelay: '0.1s' }}>
                        Nâng tầm thương hiệu của bạn với công cụ AI thiết kế logo đỉnh cao. Không cần kinh nghiệm, chỉ cần vài giây để sở hữu bộ nhận diện thương hiệu chuyên nghiệp.
                    </p>
                    <div className="animate-slide-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.2s' }}>
                        <Link to={user ? '/onboarding' : '/register'} className="btn-ocean" style={{ padding: '16px 40px', fontSize: '16px' }}>Khởi tạo ngay</Link>
                        <Link to="/pricing" className="btn-ocean-ghost" style={{ padding: '16px 40px', fontSize: '16px' }}>Bảng giá IP</Link>
                    </div>
                </div>
            </section>

            {/* Features Showcase */}
            <section style={{ padding: '80px 24px', position: 'relative' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>Sức mạnh của Logo Master</h2>
                        <p style={{ color: 'var(--color-ocean-text-muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>Tại sao hàng ngàn startup và doanh nghiệp tin tưởng giải pháp thiết kế của chúng tôi?</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                        {features.map((f, i) => (
                            <div key={i} className="ocean-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(122,178,178,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(122,178,178,0.3)', color: 'var(--color-ocean-primary)' }}>
                                    <FontAwesomeIcon icon={f.icon} style={{ fontSize: '24px' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-ocean-text)' }}>{f.title}</h3>
                                    <p style={{ fontSize: '15px', color: 'var(--color-ocean-text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: '100px 24px', textAlign: 'center' }}>
                <div className="ocean-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 32px', background: 'linear-gradient(135deg, rgba(8,131,149,0.4), rgba(122,178,178,0.2))' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '20px' }}>Sẵn sàng đột phá?</h2>
                    <p style={{ color: 'var(--color-ocean-text-muted)', fontSize: '18px', marginBottom: '40px' }}>Đừng để ý tưởng chỉ nằm trên giấy. Hãy hiện thực hóa ngay hôm nay.</p>
                    <Link to={user ? '/onboarding' : '/register'} className="btn-ocean" style={{ padding: '16px 48px', fontSize: '18px' }}>Tạo Logo Ai</Link>
                </div>
            </section>
        </div>
    )
}
