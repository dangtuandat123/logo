import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useToast } from '../contexts/ToastContext'

const INDUSTRIES = [
    { value: 'technology', label: 'Công nghệ', icon: '💻' },
    { value: 'food', label: 'F&B / Ẩm thực', icon: '🍽️' },
    { value: 'fashion', label: 'Thời trang', icon: '👗' },
    { value: 'health', label: 'Y tế / Sức khỏe', icon: '🏥' },
    { value: 'education', label: 'Giáo dục', icon: '📚' },
    { value: 'finance', label: 'Tài chính', icon: '💰' },
    { value: 'sports', label: 'Thể thao', icon: '⚽' },
    { value: 'travel', label: 'Du lịch', icon: '✈️' },
    { value: 'beauty', label: 'Làm đẹp', icon: '💄' },
    { value: 'real_estate', label: 'Bất động sản', icon: '🏠' },
    { value: 'music', label: 'Âm nhạc', icon: '🎵' },
    { value: 'other', label: 'Khác', icon: '🔮' },
]

const STYLES = [
    { value: 'minimalist', label: 'Minimalist', desc: 'Tối giản, hiện đại', icon: '◻️' },
    { value: 'artisan', label: 'Artisan', desc: 'Huy hiệu cổ điển', icon: '🏛️' },
    { value: 'mascot', label: 'Mascot', desc: 'Linh vật vui nhộn', icon: '🐻' },
    { value: 'typography', label: 'Typography', desc: 'Chữ nghệ thuật', icon: '🔤' },
]

const COLOR_PRESETS = [
    { name: 'Hiện đại', colors: ['#1a73e8', '#1f1f1f', '#f8f9fa'] },
    { name: 'Ấm áp', colors: ['#d93025', '#f9ab00', '#fef7e0'] },
    { name: 'Sang trọng', colors: ['#1f1f1f', '#d4af37', '#f8f9fa'] },
    { name: 'Tự nhiên', colors: ['#1e8e3e', '#065f46', '#e6f4ea'] },
    { name: 'Sáng tạo', colors: ['#7c3aed', '#ec4899', '#f5f3ff'] },
    { name: 'Chuyên nghiệp', colors: ['#0f172a', '#1a73e8', '#ffffff'] },
]

export default function OnboardingPage() {
    const navigate = useNavigate()
    const toast = useToast()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: '', slogan: '', industry: '', style: 'minimalist',
        colors: ['#1a73e8', '#1f1f1f', '#f8f9fa'],
    })

    const canNext = () => {
        if (step === 1) return form.name.trim() && form.industry
        if (step === 2) return form.style
        if (step === 3) return form.colors.length > 0
        return false
    }

    const handleGenerate = async () => {
        setLoading(true)
        try {
            const res = await api.post('/logos/generate', form)
            navigate(`/editor/${res.data.data.logo.id}`)
            toast.success('Logo đã được tạo!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi tạo logo.')
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface)' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
                    <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', backgroundColor: 'var(--color-primary-light)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-outline)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>AI đang tạo logo...</h2>
                    <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>Đang phân tích yêu cầu và thiết kế logo cho "{form.name}". Quá trình này mất 10-30 giây.</p>
                </div>
            </div>
        )
    }

    const chipStyle = (selected) => ({
        padding: '12px 16px',
        borderRadius: '16px',
        border: `1px solid ${selected ? 'var(--color-primary)' : 'var(--color-outline)'}`,
        backgroundColor: selected ? 'var(--color-primary-light)' : 'var(--color-surface)',
        color: selected ? 'var(--color-primary)' : 'var(--color-on-surface)',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        textAlign: 'left',
        fontFamily: 'var(--font-sans)',
        transition: 'all 0.15s ease',
    })

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: 'var(--color-surface-dim)', padding: '48px 24px' }}>
            <div className="container-md">
                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', backgroundColor: s <= step ? 'var(--color-primary)' : 'var(--color-outline)', transition: 'background-color 0.3s ease' }} />
                    ))}
                    <span style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', fontWeight: 500, marginLeft: '8px', whiteSpace: 'nowrap' }}>Bước {step}/3</span>
                </div>

                {/* Step 1: Brand Info */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Thông tin thương hiệu</h1>
                        <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: '32px', fontSize: '15px' }}>Cho chúng tôi biết về thương hiệu của bạn.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Tên thương hiệu *</label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Ví dụ: Café Luna" maxLength={50} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Khẩu hiệu (tùy chọn)</label>
                                <input type="text" value={form.slogan} onChange={e => setForm({ ...form, slogan: e.target.value })} className="input-field" placeholder="Ví dụ: Hương vị đậm đà" maxLength={100} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Ngành nghề *</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                                    {INDUSTRIES.map(ind => (
                                        <button key={ind.value} onClick={() => setForm({ ...form, industry: ind.value })} style={chipStyle(form.industry === ind.value)}>
                                            <span style={{ marginRight: '8px' }}>{ind.icon}</span>{ind.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Style */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Phong cách thiết kế</h1>
                        <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: '32px', fontSize: '15px' }}>Chọn phong cách bạn muốn cho logo.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                            {STYLES.map(s => (
                                <button key={s.value} onClick={() => setForm({ ...form, style: s.value })} style={{ ...chipStyle(form.style === s.value), padding: '24px', borderRadius: '20px', textAlign: 'left' }}>
                                    <span style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }}>{s.icon}</span>
                                    <span style={{ display: 'block', fontSize: '15px', fontWeight: 600, marginBottom: '4px', color: form.style === s.value ? 'var(--color-primary)' : 'var(--color-on-surface)' }}>{s.label}</span>
                                    <span style={{ display: 'block', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>{s.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Colors */}
                {step === 3 && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Bảng màu</h1>
                        <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: '32px', fontSize: '15px' }}>Chọn tông màu chủ đạo cho logo.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                            {COLOR_PRESETS.map(preset => (
                                <button key={preset.name} onClick={() => setForm({ ...form, colors: preset.colors })} style={{ ...chipStyle(JSON.stringify(form.colors) === JSON.stringify(preset.colors)), padding: '20px', borderRadius: '20px' }}>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                        {preset.colors.map((c, i) => (
                                            <div key={i} style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: c, border: '1px solid var(--color-outline)' }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{preset.name}</span>
                                </button>
                            ))}
                        </div>
                        {/* Custom color */}
                        <div className="card" style={{ marginTop: '24px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', display: 'block' }}>Hoặc nhập mã HEX tùy chọn</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {form.colors.map((c, i) => (
                                    <input key={i} type="color" value={c} onChange={e => {
                                        const nc = [...form.colors]; nc[i] = e.target.value; setForm({ ...form, colors: nc })
                                    }} style={{ width: '44px', height: '44px', borderRadius: '12px', border: '1px solid var(--color-outline)', cursor: 'pointer', padding: '2px' }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px' }}>
                    <button onClick={() => step > 1 && setStep(step - 1)} className="btn-secondary" style={{ visibility: step > 1 ? 'visible' : 'hidden', padding: '10px 24px' }}>
                        ← Quay lại
                    </button>
                    {step < 3 ? (
                        <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="btn-primary" style={{ padding: '12px 32px' }}>
                            Tiếp theo →
                        </button>
                    ) : (
                        <button onClick={handleGenerate} disabled={!canNext()} className="btn-primary" style={{ padding: '12px 32px' }}>
                            ✨ Tạo Logo
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
