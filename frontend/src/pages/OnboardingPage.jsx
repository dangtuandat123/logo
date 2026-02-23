import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useToast } from '../contexts/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faLaptopCode, faUtensils, faShirt, faNotesMedical, faGraduationCap,
    faChartLine, faFutbol, faPlane, faSpa, faBuilding, faMusic, faFeather,
    faCircleNotch, faStamp, faGhost, faFont, faArrowRight, faArrowLeft, faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons'

const INDUSTRIES = [
    { value: 'technology', label: 'Công nghệ', icon: faLaptopCode }, { value: 'food', label: 'F&B', icon: faUtensils },
    { value: 'fashion', label: 'Thời trang', icon: faShirt }, { value: 'health', label: 'Y tế', icon: faNotesMedical },
    { value: 'education', label: 'Giáo dục', icon: faGraduationCap }, { value: 'finance', label: 'Tài chính', icon: faChartLine },
    { value: 'sports', label: 'Thể thao', icon: faFutbol }, { value: 'travel', label: 'Du lịch', icon: faPlane },
    { value: 'beauty', label: 'Làm đẹp', icon: faSpa }, { value: 'real_estate', label: 'Bất động sản', icon: faBuilding },
    { value: 'music', label: 'Âm nhạc', icon: faMusic }, { value: 'other', label: 'Khác', icon: faFeather },
]

const STYLES = [
    { value: 'minimalist', label: 'Minimalist', desc: 'Đơn giản, hiện đại tinh tế', icon: faCircleNotch },
    { value: 'artisan', label: 'Artisan', desc: 'Dấu ấn thủ công cổ điển', icon: faStamp },
    { value: 'mascot', label: 'Mascot', desc: 'Linh vật độc đáo, vui nhộn', icon: faGhost },
    { value: 'typography', label: 'Typography', desc: 'Nghệ thuật chữ sáng tạo', icon: faFont },
]

const PALETTES = [
    { name: 'Khởi nguyên', colors: ['#09637E', '#088395', '#7AB2B2'] },
    { name: 'Đại dương sương mù', colors: ['#0f172a', '#3b82f6', '#ffffff'] },
    { name: 'San hô rực rỡ', colors: ['#991b1b', '#f59e0b', '#fef3c7'] },
    { name: 'Thung lũng ngọc', colors: ['#064e3b', '#10b981', '#f0fdf4'] },
    { name: 'Bóng đêm tím', colors: ['#4c1d95', '#a855f7', '#f5f3ff'] },
]

export default function OnboardingPage() {
    const navigate = useNavigate(); const toast = useToast()
    const [step, setStep] = useState(1); const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ name: '', slogan: '', industry: '', style: 'minimalist', colors: ['#09637E', '#088395', '#7AB2B2'] })

    const canNext = () => {
        if (step === 1) return form.name.trim().length > 0 && form.industry;
        if (step === 2) return form.style;
        return form.colors.length > 0;
    }

    const handleGenerate = async () => {
        setLoading(true)
        try {
            const r = await api.post('/logos/generate', form);
            navigate(`/editor/${r.data.data.logo.id}`);
            toast.success('Khởi tạo logo thành công!')
        } catch (e) {
            toast.error(e.response?.data?.message || 'Phân tích AI thất bại.');
            setLoading(false)
        }
    }

    // Hide header in AppLayout when navigating through steps to create an immersive experience
    const chip = (sel) => ({
        padding: '16px', borderRadius: '16px', border: `1.5px solid ${sel ? 'var(--color-ocean-primary)' : 'rgba(235,244,246,0.1)'}`,
        background: sel ? 'rgba(122,178,178,0.15)' : 'rgba(235,244,246,0.02)',
        color: sel ? 'var(--color-ocean-text)' : 'var(--color-ocean-text-muted)', cursor: 'pointer',
        fontSize: '15px', fontWeight: 600, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: sel ? 'scale(1.02)' : 'scale(1)',
    })

    return (
        <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
            {/* Progress Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '56px' }}>
                {[1, 2, 3].map(s => (
                    <div key={s} style={{
                        flex: 1, height: '4px', borderRadius: '4px',
                        background: s <= step ? 'var(--color-ocean-primary)' : 'rgba(235,244,246,0.1)',
                        transition: 'background 0.4s ease',
                        boxShadow: s <= step ? '0 0 10px rgba(122,178,178,0.5)' : 'none'
                    }} />
                ))}
            </div>

            <div className="ocean-card" style={{ padding: '48px 40px', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                {step === 1 && <div className="animate-slide-up" style={{ flex: 1 }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>DNA Thương Hiệu</h1>
                        <p style={{ color: 'var(--color-ocean-text-muted)', fontSize: '16px' }}>AI của chúng tôi cần hiểu rõ về bản sắc dự án của bạn.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Tên thương hiệu <span style={{ color: '#fca5a5' }}>*</span></label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="ocean-input" placeholder="Ví dụ: SpaceTech Labs" autoFocus />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Slogan / Châm ngôn</label>
                            <input type="text" value={form.slogan} onChange={e => setForm({ ...form, slogan: e.target.value })} className="ocean-input" placeholder="Ví dụ: Vượt mọi giới hạn" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Lĩnh vực hoặt động <span style={{ color: '#fca5a5' }}>*</span></label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                                {INDUSTRIES.map(i => (
                                    <button key={i.value} onClick={() => setForm({ ...form, industry: i.value })} style={chip(form.industry === i.value)}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: form.industry === i.value ? 'var(--color-ocean-primary)' : 'rgba(235,244,246,0.05)', color: form.industry === i.value ? 'var(--color-ocean-bg)' : 'var(--color-ocean-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                                            <FontAwesomeIcon icon={i.icon} />
                                        </div>
                                        {i.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>}

                {step === 2 && <div className="animate-slide-up" style={{ flex: 1 }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>Ngôn Ngữ Thiết Kế</h1>
                        <p style={{ color: 'var(--color-ocean-text-muted)', fontSize: '16px' }}>Chọn một định hướng nghệ thuật cho logo của bạn.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {STYLES.map(s => (
                            <button key={s.value} onClick={() => setForm({ ...form, style: s.value })} style={{ ...chip(form.style === s.value), padding: '24px', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: form.style === s.value ? 'var(--color-ocean-primary)' : 'rgba(235,244,246,0.05)', color: form.style === s.value ? 'var(--color-ocean-bg)' : 'var(--color-ocean-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', transition: 'all 0.2s' }}>
                                    <FontAwesomeIcon icon={s.icon} />
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{s.label}</span>
                                    <span style={{ display: 'block', fontSize: '14px', color: form.style === s.value ? 'rgba(235,244,246,0.9)' : 'var(--color-ocean-text-muted)', fontWeight: 400, lineHeight: 1.5 }}>{s.desc}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>}

                {step === 3 && <div className="animate-slide-up" style={{ flex: 1 }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>Năng Lượng Màu Sắc</h1>
                        <p style={{ color: 'var(--color-ocean-text-muted)', fontSize: '16px' }}>Linh hồn của thương hiệu thể hiện qua màu sắc.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        {PALETTES.map(p => (
                            <button key={p.name} onClick={() => setForm({ ...form, colors: p.colors })} style={{ ...chip(JSON.stringify(form.colors) === JSON.stringify(p.colors)), padding: '20px', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                    {p.colors.map((c, i) => <div key={i} style={{ width: '36px', height: '36px', borderRadius: '50%', background: c, border: `2px solid ${c === '#ffffff' ? '#e2e8f0' : 'transparent'}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />)}
                                </div>
                                <span style={{ fontSize: '15px', fontWeight: 700 }}>{p.name}</span>
                            </button>
                        ))}
                    </div>
                    <div style={{ padding: '24px', background: 'rgba(235,244,246,0.02)', borderRadius: '16px', border: '1px solid rgba(235,244,246,0.1)' }}>
                        <label style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', display: 'block' }}>Hoặc pha trộn bảng màu riêng của bạn</label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {form.colors.map((c, i) => (
                                <div key={i} style={{ position: 'relative' }}>
                                    <input type="color" value={c} onChange={e => { const n = [...form.colors]; n[i] = e.target.value; setForm({ ...form, colors: n }) }} style={{ width: '56px', height: '56px', borderRadius: '14px', border: '2px solid rgba(235,244,246,0.2)', cursor: 'pointer', padding: '4px', background: 'transparent' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(235,244,246,0.1)' }}>
                    <button onClick={() => step > 1 && setStep(step - 1)} className="btn-ocean-ghost" style={{ visibility: step > 1 ? 'visible' : 'hidden', padding: '14px 28px' }}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Lùi lại
                    </button>

                    {step < 3 ? (
                        <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="btn-ocean" style={{ padding: '14px 32px' }}>
                            Tiếp tục <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    ) : (
                        <button onClick={handleGenerate} disabled={!canNext() || loading} className="btn-ocean" style={{ padding: '14px 40px', background: 'linear-gradient(135deg, #088395, #7AB2B2)' }}>
                            {loading ? 'Đang suy nghĩ...' : <><FontAwesomeIcon icon={faWandMagicSparkles} /> Tiến Hành Tạo AI</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
