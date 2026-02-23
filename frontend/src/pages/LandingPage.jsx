import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LandingPage() {
    const { user } = useAuth()

    return (
        <div className="bg-surface">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium mb-8">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Được hỗ trợ bởi AI
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-on-surface leading-tight mb-6">
                        Tạo Logo Chuyên Nghiệp
                        <span className="text-primary block mt-2">Chỉ Trong Vài Giây</span>
                    </h1>
                    <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
                        Sử dụng trí tuệ nhân tạo để thiết kế logo SVG vector chất lượng cao. Tùy chỉnh phong cách, màu sắc, font chữ — tải xuống ngay lập tức.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to={user ? '/onboarding' : '/register'}
                            className="px-8 py-3.5 rounded-full bg-primary text-on-primary text-base font-semibold hover:bg-primary-hover transition-colors"
                        >
                            Bắt đầu tạo logo miễn phí
                        </Link>
                        <Link
                            to="/pricing"
                            className="px-8 py-3.5 rounded-full bg-surface-container text-on-surface text-base font-semibold hover:bg-outline transition-colors border border-outline"
                        >
                            Xem bảng giá
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-surface-dim border-t border-outline">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-on-surface mb-4">Tại sao chọn Logo Master?</h2>
                        <p className="text-on-surface-variant max-w-xl mx-auto">Công cụ tạo logo AI mạnh mẽ nhất, xuất file vector SVG chất lượng cao</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '⚡',
                                title: 'Nhanh chóng',
                                desc: 'AI tạo logo trong vài giây. Không cần kỹ năng thiết kế.'
                            },
                            {
                                icon: '🎨',
                                title: 'Tùy chỉnh linh hoạt',
                                desc: 'Chỉnh sửa text, màu sắc, font chữ, bố cục ngay trên trình duyệt.'
                            },
                            {
                                icon: '📐',
                                title: 'SVG Vector',
                                desc: 'Xuất file SVG chất lượng vô hạn, sắc nét mọi kích thước.'
                            },
                            {
                                icon: '🎯',
                                title: 'Nhiều phong cách',
                                desc: 'Minimalist, Artisan, Mascot, Typography — đa dạng phong cách.'
                            },
                            {
                                icon: '🔒',
                                title: 'Bảo mật',
                                desc: 'Dữ liệu được lưu trữ an toàn, chỉ bạn có quyền truy cập.'
                            },
                            {
                                icon: '💰',
                                title: 'Giá hợp lý',
                                desc: 'Dùng thử miễn phí. Tải bản HD với giá cực kỳ phải chăng.'
                            },
                        ].map((feature, i) => (
                            <div key={i} className="bg-surface rounded-3xl border border-outline p-8 hover:border-primary/30 transition-colors">
                                <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-2xl mb-5">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-on-surface mb-2">{feature.title}</h3>
                                <p className="text-sm text-on-surface-variant leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-outline">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className="text-3xl font-bold text-on-surface mb-4">Sẵn sàng tạo logo?</h2>
                    <p className="text-on-surface-variant mb-8 max-w-lg mx-auto">Bắt đầu ngay với tài khoản miễn phí. Không cần thẻ tín dụng.</p>
                    <Link
                        to={user ? '/onboarding' : '/register'}
                        className="inline-flex px-8 py-3.5 rounded-full bg-primary text-on-primary text-base font-semibold hover:bg-primary-hover transition-colors"
                    >
                        Tạo logo ngay
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-outline bg-surface-dim">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-on-surface-variant">© 2026 Logo Master. Powered by AI.</p>
                        <div className="flex gap-6">
                            <Link to="/pricing" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Bảng giá</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
