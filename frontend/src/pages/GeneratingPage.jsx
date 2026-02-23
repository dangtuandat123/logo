import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function GeneratingPage() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Nếu không có state từ onboarding, redirect về
        if (!location.state?.logoId) {
            navigate('/onboarding', { replace: true })
        }
    }, [location, navigate])

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
                <div className="w-24 h-24 mx-auto mb-8 bg-primary-light rounded-3xl flex items-center justify-center relative">
                    <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-on-surface mb-3">AI đang thiết kế logo...</h1>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                    Chúng tôi đang sử dụng trí tuệ nhân tạo để tạo logo phù hợp nhất với yêu cầu của bạn. Vui lòng chờ trong giây lát.
                </p>
                <div className="flex gap-2 justify-center">
                    {[0, 1, 2, 3].map(i => (
                        <div
                            key={i}
                            className="w-2.5 h-2.5 rounded-full bg-primary"
                            style={{
                                animation: 'bounce 1s infinite',
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
