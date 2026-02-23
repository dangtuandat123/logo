import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useToast } from '../contexts/ToastContext'

const INDUSTRIES = [
    { value: 'technology', label: 'Công nghệ', icon: '💻' }, { value: 'food', label: 'F&B', icon: '🍽️' },
    { value: 'fashion', label: 'Thời trang', icon: '👗' }, { value: 'health', label: 'Y tế', icon: '🏥' },
    { value: 'education', label: 'Giáo dục', icon: '📚' }, { value: 'finance', label: 'Tài chính', icon: '💰' },
    { value: 'sports', label: 'Thể thao', icon: '⚽' }, { value: 'travel', label: 'Du lịch', icon: '✈️' },
    { value: 'beauty', label: 'Làm đẹp', icon: '💄' }, { value: 'real_estate', label: 'Bất động sản', icon: '🏠' },
    { value: 'music', label: 'Âm nhạc', icon: '🎵' }, { value: 'other', label: 'Khác', icon: '🔮' },
]
const STYLES = [
    { value: 'minimalist', label: 'Minimalist', desc: 'Tối giản, hiện đại', icon: '◻️' },
    { value: 'artisan', label: 'Artisan', desc: 'Huy hiệu cổ điển', icon: '🏛️' },
    { value: 'mascot', label: 'Mascot', desc: 'Linh vật vui nhộn', icon: '🐻' },
    { value: 'typography', label: 'Typography', desc: 'Chữ nghệ thuật', icon: '🔤' },
]
const PALETTES = [
    { name: 'Neon Blue', colors: ['#3b82f6', '#0f172a', '#f8fafc'] },
    { name: 'Sunset', colors: ['#ef4444', '#f59e0b', '#fef3c7'] },
    { name: 'Luxury', colors: ['#1f1f1f', '#d4af37', '#f8f9fa'] },
    { name: 'Nature', colors: ['#22c55e', '#065f46', '#e6f4ea'] },
    { name: 'Creative', colors: ['#a855f7', '#ec4899', '#f5f3ff'] },
    { name: 'Pro', colors: ['#0f172a', '#3b82f6', '#ffffff'] },
]

export default function OnboardingPage() {
    const navigate = useNavigate(); const toast = useToast()
    const [step, setStep] = useState(1); const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ name: '', slogan: '', industry: '', style: 'minimalist', colors: ['#3b82f6', '#0f172a', '#f8fafc'] })
    const canNext = () => { if (step === 1) return form.name.trim() && form.industry; if (step === 2) return form.style; return form.colors.length > 0 }

    const handleGenerate = async () => {
        setLoading(true)
        try { const r = await api.post('/logos/generate', form); navigate(`/editor/${r.data.data.logo.id}`); toast.success('Logo đã được tạo!') }
        catch (e) { toast.error(e.response?.data?.message || 'Lỗi tạo logo.'); setLoading(false) }
    }

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', maxWidth: '360px', padding: '24px' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '24px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>AI đang tạo logo...</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Đang thiết kế logo cho "{form.name}". Mất 10-30 giây.</p>
            </div>
        </div>
    )

    const chip = (sel) => ({ padding: '12px 16px', borderRadius: '12px', border: `1px solid ${sel ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`, background: sel ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)', color: sel ? '#60a5fa' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '14px', fontWeight: 500, textAlign: 'left', fontFamily: 'var(--font-sans)', transition: 'all 0.15s' })

    return (
        <div style={{ padding: '32px 24px', maxWidth: '720px', margin: '0 auto' }}>
            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
                {[1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: '3px', borderRadius: '3px', background: s <= step ? '#3b82f6' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />)}
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginLeft: '8px', whiteSpace: 'nowrap' }}>Bước {step}/3</span>
            </div>

            {step === 1 && <div className="animate-fade-in">
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Thông tin thương hiệu</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontSize: '15px' }}>Cho chúng tôi biết về thương hiệu của bạn.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Tên thương hiệu *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="glass-input" placeholder="Ví dụ: Café Luna" /></div>
                    <div><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Slogan (tùy chọn)</label><input type="text" value={form.slogan} onChange={e => setForm({ ...form, slogan: e.target.value })} className="glass-input" placeholder="Ví dụ: Hương vị đậm đà" /></div>
                    <div><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>Ngành nghề *</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '8px' }}>
                            {INDUSTRIES.map(i => <button key={i.value} onClick={() => setForm({ ...form, industry: i.value })} style={chip(form.industry === i.value)}><span style={{ marginRight: '8px' }}>{i.icon}</span>{i.label}</button>)}
                        </div></div>
                </div></div>}

            {step === 2 && <div className="animate-fade-in">
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Phong cách thiết kế</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontSize: '15px' }}>Chọn phong cách cho logo.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '12px' }}>
                    {STYLES.map(s => <button key={s.value} onClick={() => setForm({ ...form, style: s.value })} style={{ ...chip(form.style === s.value), padding: '24px', borderRadius: '16px' }}>
                        <span style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }}>{s.icon}</span>
                        <span style={{ display: 'block', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{s.label}</span>
                        <span style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{s.desc}</span>
                    </button>)}
                </div></div>}

            {step === 3 && <div className="animate-fade-in">
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Bảng màu</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontSize: '15px' }}>Chọn tông màu chủ đạo.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '12px' }}>
                    {PALETTES.map(p => <button key={p.name} onClick={() => setForm({ ...form, colors: p.colors })} style={{ ...chip(JSON.stringify(form.colors) === JSON.stringify(p.colors)), padding: '20px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>{p.colors.map((c, i) => <div key={i} style={{ width: '28px', height: '28px', borderRadius: '8px', background: c, border: '1px solid rgba(255,255,255,0.1)' }} />)}</div>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{p.name}</span>
                    </button>)}
                </div>
                <div className="glass-card" style={{ marginTop: '20px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: '12px', display: 'block' }}>Màu tùy chỉnh</label>
                    <div style={{ display: 'flex', gap: '10px' }}>{form.colors.map((c, i) => <input key={i} type="color" value={c} onChange={e => { const n = [...form.colors]; n[i] = e.target.value; setForm({ ...form, colors: n }) }} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', padding: '2px', background: 'transparent' }} />)}</div>
                </div></div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px' }}>
                <button onClick={() => step > 1 && setStep(step - 1)} className="btn-glass" style={{ visibility: step > 1 ? 'visible' : 'hidden', padding: '10px 24px' }}>← Quay lại</button>
                {step < 3 ? <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="btn-primary" style={{ padding: '10px 28px' }}>Tiếp theo →</button>
                    : <button onClick={handleGenerate} disabled={!canNext()} className="btn-primary" style={{ padding: '10px 28px' }}>✨ Tạo Logo</button>}
            </div>
        </div>
    )
}
