import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useToast } from '../contexts/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faFloppyDisk, faDownload, faPalette, faFont, faLayerGroup, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

export default function EditorPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()

    const [logo, setLogo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({ color: '#ffffff', scale: 100, rotate: 0 })

    useEffect(() => {
        const fetchLogo = async () => {
            try { const r = await api.get(`/logos/${id}`); setLogo(r.data.data) }
            catch (e) { toast.error('Không tìm thấy bản thiết kế'); navigate('/dashboard') }
            finally { setLoading(false) }
        }
        fetchLogo()
        // eslint-disable-next-line
    }, [id])

    const handleSave = async () => {
        setSaving(true)
        try { await api.put(`/logos/${id}`, { svg_content: logo.svg_content, settings }); toast.success('Đã lưu thiết kế!') }
        catch (e) { toast.error('Lỗi lưu trữ.') }
        finally { setSaving(false) }
    }

    const handleBasicDownload = () => {
        const blob = new Blob([logo.svg_content], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = `logo-draft-${id}.svg`; a.click()
        URL.revokeObjectURL(url)
    }

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-ocean-bg)' }}>
            <div className="skeleton" style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
        </div>
    )

    return (
        <div style={{ height: '100vh', display: 'flex', background: 'var(--color-ocean-bg)', overflow: 'hidden' }}>
            {/* Sidebar Controls */}
            <aside className="ocean-glass" style={{ width: '320px', height: '100vh', borderRight: '1px solid var(--color-ocean-border)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--color-ocean-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid var(--color-ocean-border)', color: 'var(--color-ocean-text)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Studio Thiết Kế</h2>
                        <p style={{ fontSize: '12px', color: 'var(--color-ocean-text-muted)' }}>Chế độ Beta</p>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Tools */}
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ocean-text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FontAwesomeIcon icon={faPalette} /> Màu sắc chủ đạo
                        </h3>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input type="color" value={settings.color} onChange={e => setSettings({ ...settings, color: e.target.value })} style={{ width: '48px', height: '48px', borderRadius: '12px', border: '2px solid rgba(235,244,246,0.1)', background: 'transparent', cursor: 'pointer', padding: '4px' }} />
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ocean-text)', padding: '8px 12px', background: 'rgba(235,244,246,0.05)', borderRadius: '8px', border: '1px solid rgba(235,244,246,0.1)' }}>{settings.color.toUpperCase()}</span>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ocean-text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FontAwesomeIcon icon={faLayerGroup} /> Biến dạng kích thước
                        </h3>
                        <input type="range" min="50" max="200" value={settings.scale} onChange={e => setSettings({ ...settings, scale: parseInt(e.target.value) })} style={{ width: '100%', accentColor: 'var(--color-ocean-primary)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--color-ocean-text-muted)' }}><span>50%</span><span>{settings.scale}%</span><span>200%</span></div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ocean-text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FontAwesomeIcon icon={faWandMagicSparkles} /> Xoay định hướng
                        </h3>
                        <input type="range" min="0" max="360" value={settings.rotate} onChange={e => setSettings({ ...settings, rotate: parseInt(e.target.value) })} style={{ width: '100%', accentColor: 'var(--color-ocean-primary)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--color-ocean-text-muted)' }}><span>0°</span><span>{settings.rotate}°</span><span>360°</span></div>
                    </div>
                </div>

                <div style={{ padding: '24px', borderTop: '1px solid var(--color-ocean-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button onClick={handleSave} disabled={saving} className="btn-ocean" style={{ width: '100%' }}>
                        <FontAwesomeIcon icon={faFloppyDisk} /> {saving ? 'Đang lưu...' : 'Lưu Bản Nháp'}
                    </button>
                    <button onClick={handleBasicDownload} className="btn-ocean-ghost" style={{ width: '100%' }}>
                        <FontAwesomeIcon icon={faDownload} /> Tải định dạng nháp
                    </button>
                </div>
            </aside>

            {/* Main Preview Area */}
            <main style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(235,244,246,1) 1px, transparent 0)', backgroundSize: '32px 32px'
                }} />

                <div className="ocean-card" style={{ width: '100%', maxWidth: '800px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(8,131,149,0.1)', overflow: 'hidden' }}>
                    <div
                        style={{
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: `scale(${settings.scale / 100}) rotate(${settings.rotate}deg)`,
                            width: '80%', height: '80%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        dangerouslySetInnerHTML={{ __html: logo?.svg_content.replace(/currentColor|#\w{3,6}/gi, settings.color) }}
                    />
                </div>
            </main>
        </div>
    )
}
