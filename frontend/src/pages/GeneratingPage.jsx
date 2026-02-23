import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function GeneratingPage() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!location.state?.logoId) {
            navigate('/onboarding', { replace: true })
        }
    }, [location, navigate])

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-dark-950)' }}>
            <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
                <div style={{ width: '96px', height: '96px', margin: '0 auto 32px', borderRadius: '28px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ width: '56px', height: '56px', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>AI đang thiết kế logo...</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.7, marginBottom: '32px' }}>
                    Chúng tôi đang sử dụng trí tuệ nhân tạo để tạo logo phù hợp nhất. Vui lòng chờ trong giây lát.
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', animation: `pulse-glow 1.2s infinite`, animationDelay: `${i * 0.15}s`, opacity: 0.6 }} />
                    ))}
                </div>
            </div>
        </div>
    )
}
