import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LandingPage() {
    const { user } = useAuth()

    const features = [
        { icon: '⚡', title: 'Nhanh chóng', desc: 'AI tạo logo trong vài giây. Không cần kỹ năng thiết kế.' },
        { icon: '🎨', title: 'Tùy chỉnh linh hoạt', desc: 'Chỉnh sửa text, màu sắc, font chữ, bố cục ngay trên trình duyệt.' },
        { icon: '📐', title: 'SVG Vector', desc: 'Xuất file SVG chất lượng vô hạn, sắc nét mọi kích thước.' },
        { icon: '🎯', title: 'Nhiều phong cách', desc: 'Minimalist, Artisan, Mascot, Typography — đa dạng phong cách.' },
        { icon: '🔒', title: 'Bảo mật', desc: 'Dữ liệu được lưu trữ an toàn, chỉ bạn có quyền truy cập.' },
        { icon: '💰', title: 'Giá hợp lý', desc: 'Dùng thử miễn phí. Tải bản HD với giá cực kỳ phải chăng.' },
    ]

    return (
        <div>
            {/* Hero Section */}
            <section style={{ padding: '80px 0 60px' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <span className="badge" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', marginBottom: '24px', display: 'inline-flex' }}>
                        ⚡ Được hỗ trợ bởi AI
                    </span>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1.1, marginBottom: '16px' }}>
                        Tạo Logo Chuyên Nghiệp
                        <br />
                        <span style={{ color: 'var(--color-primary)' }}>Chỉ Trong Vài Giây</span>
                    </h1>
                    <p style={{ fontSize: '17px', color: 'var(--color-on-surface-variant)', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                        Sử dụng trí tuệ nhân tạo để thiết kế logo SVG vector chất lượng cao. Tùy chỉnh phong cách, màu sắc, font chữ — tải xuống ngay lập tức.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to={user ? '/onboarding' : '/register'} className="btn-primary" style={{ padding: '14px 36px', fontSize: '15px' }}>
                            Bắt đầu tạo logo miễn phí
                        </Link>
                        <Link to="/pricing" className="btn-secondary" style={{ padding: '14px 36px', fontSize: '15px' }}>
                            Xem bảng giá
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ backgroundColor: 'var(--color-surface-dim)', borderTop: '1px solid var(--color-outline)', padding: '80px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '12px' }}>Tại sao chọn Logo Master?</h2>
                        <p style={{ color: 'var(--color-on-surface-variant)', maxWidth: '480px', margin: '0 auto' }}>Công cụ tạo logo AI mạnh mẽ nhất, xuất file vector SVG chất lượng cao</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                        {features.map((f, i) => (
                            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-primary-light)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-on-surface)' }}>{f.title}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ borderTop: '1px solid var(--color-outline)', padding: '80px 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '12px' }}>Sẵn sàng tạo logo?</h2>
                    <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px' }}>
                        Bắt đầu ngay với tài khoản miễn phí. Không cần thẻ tín dụng.
                    </p>
                    <Link to={user ? '/onboarding' : '/register'} className="btn-primary" style={{ padding: '14px 36px', fontSize: '15px' }}>
                        Tạo logo ngay
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--color-outline)', backgroundColor: 'var(--color-surface-dim)', padding: '24px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>© 2026 Logo Master. Powered by AI.</p>
                    <Link to="/pricing" style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}>Bảng giá</Link>
                </div>
            </footer>
        </div>
    )
}
