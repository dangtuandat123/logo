import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Zap, Palette, PenTool, Shield, Star, DollarSign } from 'lucide-react'

export default function LandingPage() {
    const { user } = useAuth()
    const features = [
        { icon: Zap, title: 'Nhanh chóng', desc: 'AI tạo logo trong vài giây. Không cần kỹ năng thiết kế.' },
        { icon: Palette, title: 'Tùy chỉnh', desc: 'Chỉnh sửa text, màu sắc, font chữ ngay trên trình duyệt.' },
        { icon: PenTool, title: 'SVG Vector', desc: 'Xuất file SVG chất lượng vô hạn, sắc nét mọi kích thước.' },
        { icon: Star, title: 'Nhiều phong cách', desc: 'Minimalist, Artisan, Mascot, Typography đa dạng.' },
        { icon: Shield, title: 'Bảo mật', desc: 'Dữ liệu được lưu trữ an toàn, chỉ bạn có quyền truy cập.' },
        { icon: DollarSign, title: 'Giá hợp lý', desc: 'Dùng thử miễn phí. Tải bản HD với giá phải chăng.' },
    ]

    return (
        <div style={{ paddingTop: '64px' }}>
            {/* Hero */}
            <section style={{ padding: '100px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Glow orbs */}
                <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '-100px', right: '-200px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
                    <span className="badge animate-fade-in" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', marginBottom: '24px', display: 'inline-flex' }}>✨ Powered by AI</span>
                    <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }} className="animate-fade-in">
                        Tạo Logo Chuyên Nghiệp
                        <br />
                        <span style={{ background: 'linear-gradient(135deg, #3b82f6, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chỉ Trong Vài Giây</span>
                    </h1>
                    <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)', maxWidth: '540px', margin: '0 auto 36px', lineHeight: 1.7 }} className="animate-fade-in">
                        Sử dụng trí tuệ nhân tạo để thiết kế logo SVG vector chất lượng cao. Tùy chỉnh phong cách, màu sắc — tải xuống ngay lập tức.
                    </p>
                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }} className="animate-fade-in">
                        <Link to={user ? '/onboarding' : '/register'} className="btn-primary" style={{ padding: '14px 36px', fontSize: '15px' }}>Bắt đầu miễn phí</Link>
                        <Link to="/pricing" className="btn-glass" style={{ padding: '14px 36px', fontSize: '15px' }}>Xem bảng giá</Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, textAlign: 'center', marginBottom: '12px' }}>Tại sao chọn Logo Master?</h2>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '48px', maxWidth: '480px', margin: '0 auto 48px' }}>Công cụ tạo logo AI mạnh mẽ nhất</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                        {features.map((f, i) => {
                            const Icon = f.icon
                            return (
                                <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', transition: 'all 0.2s', cursor: 'default' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={22} color="#60a5fa" />
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{f.title}</h3>
                                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{f.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Sẵn sàng tạo logo?</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>Bắt đầu ngay, không cần thẻ tín dụng.</p>
                <Link to={user ? '/onboarding' : '/register'} className="btn-primary" style={{ padding: '14px 36px', fontSize: '15px' }}>Tạo logo ngay</Link>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>© 2026 Logo Master. Powered by AI.</p>
            </footer>
        </div>
    )
}
