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
    { name: 'Hiện đại', colors: ['#2563EB', '#1E293B', '#F8FAFC'] },
    { name: 'Ấm áp', colors: ['#DC2626', '#F97316', '#FEF3C7'] },
    { name: 'Sang trọng', colors: ['#1E293B', '#D4AF37', '#F8FAFC'] },
    { name: 'Tự nhiên', colors: ['#16A34A', '#065F46', '#ECFDF5'] },
    { name: 'Sáng tạo', colors: ['#7C3AED', '#EC4899', '#F5F3FF'] },
    { name: 'Chuyên nghiệp', colors: ['#0F172A', '#3B82F6', '#FFFFFF'] },
]

export default function OnboardingPage() {
    const navigate = useNavigate()
    const toast = useToast()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: '',
        slogan: '',
        industry: '',
        style: 'minimalist',
        colors: ['#2563EB', '#1E293B', '#F8FAFC'],
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
            const logoId = res.data.data.logo.id
            navigate(`/editor/${logoId}`)
            toast.success('Logo đã được tạo!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi tạo logo.')
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 mx-auto mb-6 bg-primary-light rounded-3xl flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                    <h2 className="text-xl font-bold text-on-surface mb-2">AI đang tạo logo...</h2>
                    <p className="text-on-surface-variant text-sm">Đang phân tích yêu cầu và thiết kế logo cho "{form.name}". Quá trình này có thể mất 10-30 giây.</p>
                    <div className="mt-8 flex gap-2 justify-center">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-surface-dim">
            <div className="max-w-2xl mx-auto px-4 py-12">
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-10">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex-1 flex items-center gap-2">
                            <div className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-outline'}`} />
                        </div>
                    ))}
                    <span className="text-xs text-on-surface-variant font-medium ml-2">Bước {step}/3</span>
                </div>

                {/* Step 1: Brand Info */}
                {step === 1 && (
                    <div>
                        <h1 className="text-2xl font-bold text-on-surface mb-2">Thông tin thương hiệu</h1>
                        <p className="text-on-surface-variant mb-8">Cho chúng tôi biết về thương hiệu của bạn.</p>

                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-2">Tên thương hiệu *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-5 py-3.5 rounded-2xl bg-surface border border-outline text-on-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/50"
                                    placeholder="Ví dụ: Café Luna"
                                    maxLength={50}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-2">Khẩu hiệu (tùy chọn)</label>
                                <input
                                    type="text"
                                    value={form.slogan}
                                    onChange={e => setForm({ ...form, slogan: e.target.value })}
                                    className="w-full px-5 py-3.5 rounded-2xl bg-surface border border-outline text-on-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/50"
                                    placeholder="Ví dụ: Hương vị đậm đà"
                                    maxLength={100}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-3">Ngành nghề *</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {INDUSTRIES.map(ind => (
                                        <button
                                            key={ind.value}
                                            onClick={() => setForm({ ...form, industry: ind.value })}
                                            className={`px-4 py-3 rounded-2xl border text-left text-sm font-medium transition-colors ${form.industry === ind.value
                                                    ? 'bg-primary-light border-primary text-primary'
                                                    : 'bg-surface border-outline text-on-surface hover:border-primary/30'
                                                }`}
                                        >
                                            <span className="text-lg mr-2">{ind.icon}</span>{ind.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Style */}
                {step === 2 && (
                    <div>
                        <h1 className="text-2xl font-bold text-on-surface mb-2">Phong cách thiết kế</h1>
                        <p className="text-on-surface-variant mb-8">Chọn phong cách bạn muốn cho logo.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {STYLES.map(s => (
                                <button
                                    key={s.value}
                                    onClick={() => setForm({ ...form, style: s.value })}
                                    className={`p-6 rounded-3xl border text-left transition-colors ${form.style === s.value
                                            ? 'bg-primary-light border-primary'
                                            : 'bg-surface border-outline hover:border-primary/30'
                                        }`}
                                >
                                    <span className="text-3xl mb-3 block">{s.icon}</span>
                                    <h3 className={`font-semibold mb-1 ${form.style === s.value ? 'text-primary' : 'text-on-surface'}`}>{s.label}</h3>
                                    <p className="text-sm text-on-surface-variant">{s.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Colors */}
                {step === 3 && (
                    <div>
                        <h1 className="text-2xl font-bold text-on-surface mb-2">Bảng màu</h1>
                        <p className="text-on-surface-variant mb-8">Chọn tông màu chủ đạo cho logo.</p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {COLOR_PRESETS.map(preset => (
                                <button
                                    key={preset.name}
                                    onClick={() => setForm({ ...form, colors: preset.colors })}
                                    className={`p-5 rounded-3xl border transition-colors ${JSON.stringify(form.colors) === JSON.stringify(preset.colors)
                                            ? 'border-primary bg-primary-light'
                                            : 'border-outline bg-surface hover:border-primary/30'
                                        }`}
                                >
                                    <div className="flex gap-2 mb-3">
                                        {preset.colors.map((c, i) => (
                                            <div key={i} className="w-8 h-8 rounded-xl border border-outline" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                    <p className="text-sm font-medium text-on-surface">{preset.name}</p>
                                </button>
                            ))}
                        </div>

                        {/* Custom color input */}
                        <div className="mt-6 p-5 rounded-3xl border border-outline bg-surface">
                            <label className="block text-sm font-medium text-on-surface mb-3">Hoặc nhập mã HEX tùy chọn</label>
                            <div className="flex gap-2">
                                {form.colors.map((c, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <input
                                            type="color"
                                            value={c}
                                            onChange={e => {
                                                const newColors = [...form.colors]
                                                newColors[i] = e.target.value
                                                setForm({ ...form, colors: newColors })
                                            }}
                                            className="w-10 h-10 rounded-xl border border-outline cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-10">
                    <button
                        onClick={() => step > 1 && setStep(step - 1)}
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${step > 1 ? 'text-on-surface hover:bg-surface-container' : 'invisible'
                            }`}
                    >
                        ← Quay lại
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => canNext() && setStep(step + 1)}
                            disabled={!canNext()}
                            className="px-8 py-3 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40"
                        >
                            Tiếp theo →
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerate}
                            disabled={!canNext()}
                            className="px-8 py-3 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40"
                        >
                            ✨ Tạo Logo
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
