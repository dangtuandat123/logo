import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

export default function GeneratingPage() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!location.state?.logoId) navigate('/onboarding', { replace: true })
    }, [location, navigate])

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-ocean-bg)' }}>
            <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
                <div className="animate-float" style={{ width: '120px', height: '120px', margin: '0 auto 40px', borderRadius: '32px', background: 'rgba(122,178,178,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid rgba(122,178,178,0.3)', boxShadow: '0 20px 40px rgba(9,99,126,0.6)' }}>
                    <FontAwesomeIcon icon={faWandMagicSparkles} style={{ fontSize: '40px', color: 'var(--color-ocean-primary)' }} />
                    <div style={{ position: 'absolute', inset: '-4px', border: '2px solid transparent', borderTopColor: 'var(--color-ocean-primary)', borderRadius: '36px', animation: 'spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
                </div>
                <h1 className="animate-slide-up" style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', color: 'var(--color-ocean-text)' }}>Neural Network Đang Sinh Hình...</h1>
                <p className="animate-slide-up" style={{ color: 'var(--color-ocean-text-muted)', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px', animationDelay: '0.1s' }}>
                    Các vector đang được định vị. Thuật toán pha trộn mã nguồn thẩm mỹ để kết tinh tác phẩm của bạn.
                </p>
                <div className="animate-slide-up" style={{ display: 'flex', gap: '12px', justifyContent: 'center', animationDelay: '0.2s' }}>
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-ocean-primary)', animation: `float 2s infinite`, animationDelay: `${i * 0.2}s`, opacity: 0.8 }} />
                    ))}
                </div>
            </div>
        </div>
    )
}
